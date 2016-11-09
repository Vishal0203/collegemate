<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Helper\UploadDataValidator;
use Excel;
use Faker;
use App\User;
use App\UserProfile;
use App\Institute;
use Validator;

class MemberController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'inst_admin']);
    }

    /**
     * Display a listing of the resource.
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $institute_guid
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $institute_guid)
    {
        if ($request->has('status')) {
            return $this->getMembersStatusWise($request);
        }

        $institute = Institute::where('inst_profile_guid', $institute_guid)
            ->with(['users' => function ($query) {
                $query->where('role', '=', 'inst_student')->orderBy('member_id');
            }, 'users.userProfile'])->get()->first();

        return response()->json(compact('institute'));
    }

    private function getMembersStatusWise(Request $request)
    {
        $take = $request->has('take') ? $request['take'] : 20;

        $query = Institute::where('inst_profile_guid', $request->route('institute_guid'))->first()
            ->users()->with('userProfile')
            ->where([
                'invitation_status' => $request['status'],
                'role' => 'inst_student'
            ])->orderBy('member_id')->paginate($take);

        return $query;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string $institute_guid
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $institute_guid)
    {
        $institute = Institute::where('inst_profile_guid', $institute_guid)->get()->first();
        $validator = $this->validator($request->all());
        $data = [
            'member_id' => $request['member_id'],
            'role' => 'inst_student'
        ];

        if ($validator->fails()) {
            $failedRules = $validator->failed();
            if (isset($failedRules['email']['Unique'])) {
                $user = User::where('email', $request['email'])->get()->first();
                $user_data = InvitationController::addUserInstitute($institute, $user, $data);
                return response()->json(compact('user_data'), 201);
            } else {
                $messages = $validator->errors();
                return response()->json(compact('messages'), 400);
            }
        }

        $internals = Faker\Factory::create('en_US');
        $user = User::create([
            'user_guid' => $internals->uuid,
            'email' => $request['email'],
            'first_name' => $request['first_name'],
            'last_name' => $request['last_name'],
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
     * Remove the specified resource from storage.
     *
     * @param  string  $institute_guid
     * @param  string  $user_guid
     * @return \Illuminate\Http\Response
     */
    public function destroy($institute_guid, $user_guid)
    {
        $user = User::where('user_guid', $user_guid)
            ->with(['institutes' => function ($query) use ($institute_guid) {
                $query->where('inst_profile_guid', $institute_guid);
            }])->get()->first();

        if ($user['institutes'][0]['pivot']['invitation_status'] === 'accepted') {
            $user->institutes()->detach($user['institutes'][0]);
            return response()->json(['success' => 'member removed successfully'], 201);
        } else {
            return response()->json(['error' => 'invalid delete request'], 400);
        }
    }

    public function validator(array $data)
    {
        $messages = [
            'required' => ':attribute is required field',
            'email.max' => ':attribute exceeds max limit 255 chars',
            'unique' => ':attribute already exists'
        ];

        return Validator::make($data, [
            'email' => 'required|email|max:255|unique:users',
            'member_id' => 'required|unique:users_institutes,member_id'
        ], $messages);
    }
}
