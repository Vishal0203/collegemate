<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Institute;
use App\User;
use App\UserProfile;
use App\Category;
use Faker;
use App\Http\Controllers\Auth\AuthControllerGeneral;
use Illuminate\Database\QueryException;
use Validator;

class StaffController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('inst_super', ['only' => ['store']]);
        $this->middleware('inst_admin', ['except' => ['store']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @param  string  $institute_guid
     * @return \Illuminate\Http\Response
     */
    public function index($institute_guid)
    {
        $institute = Institute::where('inst_profile_guid', $institute_guid)
            ->with(['users' => function ($query) {
                $query->where('role', '<>', 'inst_student');
            }, 'users.userProfile', 'users.notifyingCategories'])->get()->first();

        return response()->json(compact('institute'));
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $institute = Institute::where('inst_profile_guid', $request->route('institute_guid'))->get()->first();
        $validator = $this->validator($request->all());
        $data = [
            'member_id' => $request['member_id'],
            'role' => $request['role']
        ];

        if ($validator->fails()) {
            $failedRules = $validator->failed();
            if (isset($failedRules['email']['Unique'])) {
                $user = User::where('email', $request['email'])->get()->first();
                $user_data = InvitationController::addUserInstitute($institute, $user, $data);
                return response()->json(compact('user_data'), 201);
            } else {
                return response()->json(["error" => "Invalid request"], 400);
            }
        }

        $internals = Faker\Factory::create('en_US');
        $user = User::create([
            'user_guid' => $internals->uuid,
            'email' => $request['email'],
            'hash' => $internals->md5
        ]);

        UserProfile::create([
            'user_profile_guid' => $internals->uuid,
            'user_id' => $user['id']
        ]);

        $user_data = InvitationController::addUserInstitute($institute, $user, $data);
        return response()->json(compact('user_data'), 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  string  $institute_guid
     * @param  string  $user_guid
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update($institute_guid, $user_guid, Request $request)
    {
        $rank = \Config::get('enum.role_ranks');
        $institute = $this->getUserInstitutePivot($institute_guid, $user_guid);

        if (count($institute['users']) <= 0) {
            return response()->json(['Error' => 'No such user in your institute.'], 202);
        }

        if ($rank[$request->get('auth_user_role')] < $rank[$institute['users'][0]['pivot']['role']]) {
            $institute->users()->updateExistingPivot($institute['users'][0]['pivot']['user_id'], [
                'role' => $request['role']
            ]);

            $user = $institute['users'][0];
            return response()->json([
                'user_guid' => $user['user_guid'],
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'role' => $request['role']
            ], 202);
        } else {
            return response()->json(['Error' => 'Not Authorized.'], 403);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $institute_guid
     * @param  string  $user_guid
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function destroy($institute_guid, $user_guid, Request $request)
    {
        $rank = \Config::get('enum.role_ranks');
        $institute = $this->getUserInstitutePivot($institute_guid, $user_guid);

        if (count($institute['users']) <= 0) {
            return response()->json(['Error' => 'No such user in your institute.'], 202);
        }

        if ($rank[$request->get('auth_user_role')] < $rank[$institute['users'][0]['pivot']['role']] &&
            $institute->users()->detach($institute['users'][0]['id'])) {
            return response()->json(['user_guid' => $institute['users'][0]['user_guid']], 202);
        } else {
            return response()->json(['Error' => 'Not Authorized.'], 403);
        }
    }

    public function getCategoriesForNotifier($institute_guid)
    {
        $user_guid=\Auth::user()->user_guid;
        $categories=Category::wherehas('institutes', function ($q) use ($institute_guid) {
            $q->where('inst_profile_guid', '=', $institute_guid);
        })->wherehas('notifiers', function ($q) use ($user_guid) {
            $q->where('user_guid', '=', $user_guid);
        })->get();
        return response()->json(compact('categories'), 200);
    }

    public static function getUserInstitutePivot($institute_guid, $user_guid)
    {
        $institute = Institute::where('inst_profile_guid', $institute_guid)
            ->with(['users' => function ($query) use ($user_guid) {
                $query->where('user_guid', $user_guid);
            }])->get()->first();
        return $institute;
    }

    private function validator(array $data)
    {
        $messages = [
            'required' => ':attribute is required field',
            'email.max' => ':attribute exceeds max limit 255 chars',
            'unique' => ':attribute already exists'
        ];

        return Validator::make($data, [
            'email' => 'required|email|max:255|unique:users',
            'role' => 'required'
        ], $messages);
    }
}
