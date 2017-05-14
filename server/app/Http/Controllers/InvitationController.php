<?php

namespace App\Http\Controllers;

use App\UserInstitute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helper\UploadDataValidator;
use App\Http\Requests;
use App\Http\Controllers\Auth\AuthControllerGeneral;
use Illuminate\Database\QueryException;
use App\User;
use App\UserProfile;
use App\Category;
use Faker;
use Mail;
use App\Institute;
use Maatwebsite\Excel\Facades\Excel;
use Validator;
use App\Mail\StudentApproved;

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
        $uploaded_data = Excel::load($file->path(), function ($reader) {
            $reader->ignoreEmpty();
        })->get()->toArray();

        $required_keys = ["employeeid", "email", "designation"];

        if ($request->get('for') == 'member') {
            array_pop($required_keys);
        }
        $validator = new UploadDataValidator($uploaded_data);
        $refined_data = $validator->validateAndRefineUploadedExcel($required_keys);
        if (count($refined_data['success']) > 0 && count($refined_data['error']) == 0) {
            DB::beginTransaction();
            foreach ($refined_data["success"] as $input) {
                $validator = $this->validator($input);
                if ($validator->fails() == false) {
                    $req = [
                        'memberId' => $input['employeeid'],
                        'designation' => $input['designation'],
                        'email' => $input['email']
                    ];
                    StaffController::addStaffMember($req, $institute_guid);
                } else {
                    DB::rollBack();
                    return response()->json(['ErrorResponse' => 'Please submit a valid file'], 400);
                }
            }
            DB::commit();
            return response()->json(['Response' => 'File has been successfully processed'], 200);
        } else {
            return response()->json(['ErrorResponse' => 'Please submit a valid file'], 400);
        }
    }

    public static function addUserInstitute(Institute $institute, User $user_data, array $request)
    {
        try {
            $institute->users()->attach($user_data, [
                'member_id' => $request['member_id'],
                'role' => $request['role'],
                'designation' => $request['designation']
            ]);

            $t = time();
            $user_data['pivot'] = [
                'role' => $request['role'],
                'invitation_status' => 'pending',
                'designation' => $request['designation'],
                'member_id' => $request['member_id'],
                'created_at' => date("Y-m-d H:i:s", $t),
                'updated_at' => date("Y-m-d H:i:s", $t)
            ];
        } catch (QueryException $e) {
            return $e;
        }

        if (env('APP_ENV') == 'production' || env('APP_ENV') == 'test') {
            $verification_url =
                env('HOST_URL') . "invite/" . $institute['inst_profile_guid'] . "?u=" . $user_data['user_guid'];

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

    public function studentRequestAction(Request $request, $institute_guid)
    {
        $institute = Institute::where('inst_profile_guid', $institute_guid)->get()->first();
        $user = User::where('user_guid', $request->get('user_guid'))->get()->first();

        if ($request['status'] == 'accepted') {
            UserInstitute::where('user_id', $user['id'])->where('institute_id', $institute['id'])->update([
                'invitation_status' => $request->get('status')
            ]);
            $allcategories = Institute::where('inst_profile_guid', $institute_guid)->first()
                                      ->categories()->withCount('subscribers')->get();
            $categories = $allcategories->sortByDesc('subscribers_count')->splice(0, 3);
            Mail::to($user->email)
                ->queue(new StudentApproved($user, $categories));
            return response()->json([
                "message" => "You have approved " . $user['first_name'] . "'s request."
            ], 201);
        } else {
            UserInstitute::where('user_id', $user['id'])->where('institute_id', $institute['id'])->forceDelete();
            $user->default_institute = null;
            $user->save();

            //Todo: Send declined mail
            return response()->json([
                "message" => "You have declined " . $user['first_name'] . "'s request."
            ], 201);
        }
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

    public function validator(array $data)
    {
        $messages = [
            'required' => ':attribute is required field',
            'email.max' => ':attribute exceeds max limit 255 chars',
            'unique' => ':attribute already exists'
        ];

        return Validator::make($data, [
            'email' => 'bail|required|email|max:255',
            'employeeid' => 'bail|required:users_institutes,member_id'
        ], $messages);
    }
}
