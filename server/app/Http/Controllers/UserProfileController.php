<?php

namespace App\Http\Controllers;

use App\Institute;
use App\UserInstitute;
use App\UserProfile;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Storage;
use Response;

class UserProfileController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @param $user
     * @return \Illuminate\Http\Response
     */
    public function updateAvatar(Request $request, $user)
    {
        $filename = $user['user_guid'] . '.' . $request->file('avatar')->getClientOriginalExtension();

        Storage::put(
            'avatars/' . $filename,
            file_get_contents($request->file('avatar')->getRealPath())
        );

        $avatar = env('HOST_URL') . 'avatar/' . $filename . '?random=' . uniqid();
        return $avatar;
    }

    public function getAvatar($filename)
    {
        $content = Storage::get('/avatars/' . $filename);
        $mimetype = Storage::mimeType('/avatars/' . $filename);

        $response = Response::make($content, 200);
        $response->header("Content-Type", $mimetype);

        return $response;
    }

    public function updateProfile(Request $request)
    {
        $user = \Auth::user();
        $institute = Institute::where('inst_profile_guid', $request['institute_guid'])->first();

        UserProfile::where('user_id', $user['id'])->update([
            'about_me' => $request['aboutMe'],
            'gender' => $request['gender'],
            'dob' => $request['dob']
        ]);

        UserInstitute::where('user_id', $user['id'])->where('institute_id', $institute['id'])->update([
            'member_id' => $request['memberId'],
            'designation' => $request['designation']
        ]);

        $user->load(['userProfile', 'defaultInstitute.userInstituteInfo' =>
            function ($userInstitute) use ($user) {
                $userInstitute->where('user_id', $user['id']);
            }
        ]);

        return response()->json(compact('user'));
    }
}
