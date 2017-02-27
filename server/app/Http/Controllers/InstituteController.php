<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helper\DynamicSchema;
use App\Institute;
use App\UserInstitute;
use App\InstituteNotifiers;
use Faker;
use Validator;
use Schema;

class InstituteController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth', ['except' => 'index']);
        $this->middleware('inst_super', ['only' => 'destroy']);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $institutes = Institute::all();
        foreach ($institutes as $institute) {
            $institute->superUser;
        }
        return response()->json(compact('institutes'), 200);
    }

    private function createInstitute(array $data)
    {
        $internals = Faker\Factory::create('en_US');
        $institute = Institute::create([
            'user_id' => \Auth::user()['id'],
            'inst_profile_guid' => $internals->uuid,
            'institute_code' => isset($data['institute_code']) ? $data['institute_code'] : null,
            'institute_name' => $data['institute_name'],
            'institute_description' => $data['institute_description'],
            'contact' => $data['contact'],
            'address' => $data['address'],
            'city' => $data['city'],
            'state' => $data['state'],
            'postal_code' => $data['postal_code'],
            'country' => $data['country']
        ]);

        return $institute;

//        $table_actual_name = $institute['id'] . '_members_info';
//        $table_display_name = 'members_info';
//        $status = $this->createDynamicTable($this->getInstituteMembersSchema($table_actual_name), $table_actual_name);
//
//        if ($status == true) {
//            DynamicTables::create([
//                'dynamic_table_guid' => $internals->uuid,
//                'institute_id' => $institute['id'],
//                'table_display_name' => $table_display_name,
//                'table_actual_name' => $table_actual_name,
//                'table_description' => 'Default institute members table, member_id to be considered as foreign key',
//                'is_default' => true,
//                'table_schema' => json_encode($this->getInstituteMembersSchema($table_actual_name))
//            ]);
//
//            return $institute;
//        } else {
//            return null;
//        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = $this->validator($request->all());

        if ($validator->fails()) {
            $messages = $validator->errors();
            return response()->json($messages->all(), 400);
        }

        $institute = $this->createInstitute($request->all());

        if ($institute == null) {
            return response()->json(['error' => 'error creating institute'], 500);
        }

        UserInstitute::create([
            'user_id' => $institute->user_id,
            'institute_id' => $institute->id,
            'member_id' => null,
            'role' => 'inst_superuser',
            'invitation_status' => 'accepted'
        ]);

        $user = \Auth::user();
        $user->update(['default_institute' => $institute->id]);
        $user->load(['institutes', 'defaultInstitute.categories',
            'defaultInstitute.subscriptions' =>
                function ($categories) use ($user) {
                    $categories->whereHas('subscribers', function ($subscribers) use ($user) {
                        $subscribers->where('user_id', $user['id']);
                    });
                },
            'defaultInstitute.notifyingCategories' =>
                function ($categories) use ($user) {
                    $categories->whereHas('notifiers', function ($notifiers) use ($user) {
                        $notifiers->where('user_id', $user['id']);
                    });
                },
            'defaultInstitute.userInstituteInfo' =>
                function ($userInstitute) use ($user) {
                    $userInstitute->where('user_id', $user['id']);
                }
        ]);

        return response()->json(compact('user'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string $institute_guid
     * @return \Illuminate\Http\Response
     */
    public function destroy($institute_guid)
    {
        $institute = Institute::where('inst_profile_guid', $institute_guid)->first();
        $institute->dynamicTables()->delete();
        UserInstitute::where('institute_id', $institute['id'])->delete();
        $institute->delete();
        InstituteNotifiers::where('category_id', $institute['id'])->delete();

        return response()->json(["success" => "Soft deleted: " . $institute->institute_name], 201);
    }

    private function validator(array $data)
    {
        $messages = [
            'required' => ':attribute is required field',
            'max' => ':attribute exceeds max limit 255 chars',
            'min' => ':attribute requires min 6 chars',
            'unique' => ':attribute already exists'
        ];

        return Validator::make($data, [
            'institute_code' => 'max:255|min:|unique:institute_profile',
            'institute_name' => 'required|min:6|max:255',
            'institute_description' => 'required|max:255',
            'contact' => 'required|max:20|min:10',
            'address' => 'required',
            'city' => 'required',
            'postal_code' => 'required|max:16|min:',
            'state' => 'required',
            'country' => 'required'
        ], $messages);
    }

    public function registerToInstitute($institute_guid)
    {
        $institute = Institute::where('inst_profile_guid', $institute_guid)->get()->first();
        $institute_id = $institute->id;
        $user = \Auth::user();

        $user_inst = UserInstitute::where('user_id', $user['id'])
            ->where('institute_id', $institute_id)->get()->first();

        if (is_null($user_inst)) {
            $user_inst = UserInstitute::create([
                'user_id' => $user['id'],
                'institute_id' => $institute_id,
                'role' => 'inst_student',
                'invitation_status' => 'accepted',
            ]);
        }

        $user->update(['default_institute' => $institute_id]);

        if (!is_null($user_inst)) {
            $user->load(['institutes',
                'defaultInstitute.categories' =>
                    function ($category) {
                        $category->with('creator');
                    },
                'defaultInstitute.subscriptions' =>
                    function ($categories) use ($user) {
                        $categories->whereHas('subscribers', function ($subscribers) use ($user) {
                            $subscribers->where('user_id', $user['id']);
                        });
                    },
                'defaultInstitute.notifyingCategories' =>
                    function ($categories) use ($user) {
                        $categories->whereHas('notifiers', function ($notifiers) use ($user) {
                            $notifiers->where('user_id', $user['id']);
                        });
                    },
                'defaultInstitute.userInstituteInfo' =>
                    function ($userInstitute) use ($user) {
                        $userInstitute->where('user_id', $user['id']);
                    }
            ]);

            return response()->json(compact('user'));
        } else {
            return response()->json(["error" => "Some thing went wrong"], 500);
        }
    }

    private function createDynamicTable(array $schema, $table_name)
    {
        if (Schema::hasTable($table_name)) {
            return false;
        }
        return new DynamicSchema($schema);
    }

    private function getInstituteMembersSchema($table_name)
    {
        return [
            "table_name" => $table_name,
            "fields" => [
                "member_id" => [
                    "data_type" => "string",
                    "length" => 20,
                    "unique" => true,
                    "nullable" => false
                ],
                "email" => [
                    "data_type" => "string",
                    "length" => 255,
                    "unique" => true,
                    "nullable" => false
                ],
                "first_name" => [
                    "data_type" => "string",
                    "length" => 30,
                    "unique" => false,
                    "nullable" => false
                ],
                "last_name" => [
                    "data_type" => "string",
                    "length" => 30,
                    "unique" => false,
                    "nullable" => false
                ],
                "role" => [
                    "data_type" => "string",
                    "length" => 20,
                    "unique" => false,
                    "nullable" => false
                ],
                "status" => [
                    "data_type" => "enum",
                    "values" => ['pending', 'accepted', 'declined']
                ]
            ],
            "foreign_keys" => null
        ];
    }
}
