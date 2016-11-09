<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Helper\UploadDataValidator;
use App\Http\Requests;
use App\Http\Controllers\Auth\AuthControllerGeneral;
use Illuminate\Database\QueryException;
use App\User;
use App\UserProfile;
use Faker;
use App\Institute;

class InvitationController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'inst_admin'], ['except' => [
            'show',
            'update'
        ]]);
    }

    public function destroy($institute_guid, $user_guid)
    {
        $user = User::where('user_guid', $user_guid)
            ->with(['institutes' => function ($query) use ($institute_guid) {
                $query->where('inst_profile_guid', $institute_guid);
            }])->get()->first();

        if ($user['institutes'][0]['pivot']['invitation_status'] === 'pending') {
            $user->institutes()->detach($user['institutes'][0]);
            return response()->json(['success' => 'invitation successfully deleted'], 201);
        } else {
            return response()->json(['error' => 'invalid request'], 400);
        }
    }

    public function bulkInvite(Request $request, $institute_guid)
    {
        $institute = Institute::where('inst_profile_guid', $institute_guid)->get()->first();
        $file = $request->file('bulk_invite_file');

        $uploaded_data = Excel::load($file, function ($reader) {
            $reader->ignoreEmpty();
        })->get()->toArray();

        $required_keys = ["member_id", "email", "role"];

        if ($request->get('for') == 'member') {
            array_pop($required_keys);
        }

        $validator = new UploadDataValidator($uploaded_data);
        $refined_data = $validator->validateAndRefineUploadedExcel($required_keys);

        $internals = Faker\Factory::create('en_US');
        $roles = ['Administrator' => 'inst_admin', 'Staff' => 'inst_staff', 'Student' => 'inst_student'];

        $users_data = ['success' => [], 'error' => []];
        foreach ($refined_data["success"] as $input) {
            $user = User::where('email', $input['email'])->get()->first();
            if (!$user) {
                $user = User::create([
                    'user_guid' => $internals->uuid,
                    'email' => $input['email'],
                    'hash' => $internals->md5
                ]);

                UserProfile::create([
                    'user_profile_guid' => $internals->uuid,
                    'user_id' => $user['id']
                ]);
            }

            $role = $roles[array_key_exists("role", $input) ? $input['role'] : 'Member'];
            $data = [
                'member_id' => $input['member_id'],
                'role' => $role
            ];

            $response = $this->addUserInstitute($institute, $user, $data);
            if (!is_null($response->errorInfo)) {
                $input['error_msg'] = "This user might've already been invited or member ID is not unique";
                array_push($users_data['error'], $input);
            } else {
                array_push($users_data['success'], $response);
            }
        }

        $users_data['error'] = array_merge($users_data['error'], $refined_data['error']);
        return response()->json(compact('users_data'));
    }

    public static function addUserInstitute(Institute $institute, User $user_data, array $request)
    {
        try {
            $institute->users()->attach($user_data, ['member_id' => $request['member_id'], 'role' => $request['role']]);
            $t = time();
            $user_data['pivot'] = [
                'role' => $request['role'],
                'invitation_status' => 'pending',
                'member_id' => $request['member_id'],
                'created_at' => date("Y-m-d H:i:s", $t),
                'updated_at' => date("Y-m-d H:i:s", $t)
            ];
        } catch (QueryException $e) {
            return $e;
        }

        if (env('APP_ENV') == 'production' || env('APP_ENV') == 'test') {
            $verification_url =
                env('HOST_URL'). "invite/" . $institute['inst_profile_guid'] . "?u=" . $user_data['user_guid'];

            $data = [
                "email" => $user_data['email'],
                "first_name" => $user_data['first_name'],
                "inviter" => \Auth::user()['first_name'] . ' ' . \Auth::user()['last_name'],
                "institute" => $institute['institute_name'],
                "url" => $verification_url
            ];

            AuthControllerGeneral
                ::sendVerificationMail('email.invitation', $data, 'You are invited to join an Institute');
        }

        return $user_data;
    }

    public function show($institute_guid, $user_guid)
    {
        $roles = ['inst_admin' => 'Administrator', 'inst_staff' => 'Staff Member'];
        $institute = Institute::where('inst_profile_guid', $institute_guid)
            ->with(['users' => function ($query) use ($user_guid) {
                $query->where('user_guid', $user_guid);
            }])->get()->first();

        if ($institute['users'][0]['pivot']['invitation_status'] != 'pending') {
            return view('errors.404');
        }

        $data = [
            'institute_name' => $institute['institute_name'],
            'role' => $roles[$institute['users'][0]['pivot']['role']],
            'institute_guid' => $institute['inst_profile_guid'],
            'user_guid' => $institute['users'][0]['user_guid'],
            'hash' => $institute['users'][0]['hash'],
            'name' => true,
            'verified' => false
        ];

        if ($institute['users'][0]['is_verified']) {
            $data['verified'] = true;
        }

        if (!$institute['users'][0]['first_name'] && !$institute['users'][0]['last_name']) {
            $data['name'] = false;
        }

        return view('invitation.invitation', $data);
    }

    public function update(Request $request, $institute_guid, $user_guid)
    {
        $data = array('verified' => false, 'accepted' => false);
        $password_check = !is_null($request['password']) && !is_null($request['confirm_password']);
        $name_check = !is_null($request['first_name']) && !is_null($request['last_name']);
        if ($password_check && $name_check) {
            User::where('user_guid', $user_guid)
                ->update([
                    'hash' => null, 'is_verified' => true,
                    'first_name' => $request['first_name'],
                    'last_name' => $request['last_name'],
                    'password' => bcrypt($request['password'])
                ]);

            $data['verified'] = true;
        }

        if ($password_check && !$name_check) {
            User::where('user_guid', $request['user_guid'])
                ->update([
                    'password' => bcrypt($request['password'])
                ]);

            $data['verified'] = true;
        }

        $institute = StaffController::getUserInstitutePivot($institute_guid, $user_guid);

        $institute->users()
            ->updateExistingPivot(
                $institute['users'][0]['pivot']['user_id'],
                ['invitation_status' => $request['invitation_response']]
            );

        $data['invitation_status'] = $request['invitation_response'];

        return view('invitation.response', $data);
    }
}
