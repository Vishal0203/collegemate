<?php

namespace App\Http\Controllers;

use App\NotificationData;
use App\User;
use App\Institute;
use App\UserInstitute;
use App\UserProfile;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Storage;
use Response;
use Illuminate\Support\Facades\Notification;
use App\Notifications\ApprovalNotification;
use Carbon\Carbon;

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
            'dob' => $request['dob'],
            'github_link' => $request['github_link'],
            'linkedin_link' => $request['linkedin_link'],
            'stackoverflow_link'=> $request['stackoverflow_link']
        ]);

        try {
            UserInstitute::where('user_id', $user['id'])->where('institute_id', $institute['id'])->update([
                'member_id' => $request['memberId'],
                'specialization' => $request['specialization'],
                'designation' => $request['designation'],
                'cgpa' => $request['cgpa'],
                'graduated_year' => $request['graduated_year']
            ]);
        } catch (QueryException $e) {
            return response()->json([
                'error' => 'The hall ticket number or employee ID is already registered in this Institute.'
            ], 403);
        }

        $staff = $institute->staff()->where('id', '!=', $user['id'])->get();
        $userInstitute = UserInstitute::where('user_id', $user['id'])->where('institute_id', $institute['id'])->first();
        if ($userInstitute->invitation_status == 'pending') {
            Notification::send($staff, new ApprovalNotification($user, $institute));
        }

        $user->load(['userProfile', 'defaultInstitute.userInstituteInfo' =>
            function ($userInstitute) use ($user) {
                $userInstitute->where('user_id', $user['id']);
            }
        ]);

        return response()->json(compact('user'));
    }

    public function readNotifications(Request $request)
    {
        $user = \Auth::user();
        $notificationIds = $request["notification_ids"];
        $notifications = $user->unreadNotifications()->whereIn('id', $notificationIds)->get();
        foreach ($notifications as $notification) {
            $this->checkForAnnouncementViewsUpdate($notification);
            $notification->update(['read_at' => Carbon::now()]);
        }

        return response()->json(['success' => 'Marked notification as read'], 200);
    }

    public function readAllNotifications(Request $request)
    {
        $user = \Auth::user();
        $notifications = $user->unreadNotifications()->get();
        foreach ($notifications as $notification) {
            $this->checkForAnnouncementViewsUpdate($notification);
            $notification->update(['read_at' => Carbon::now()]);
        }
        return response()->json(['success' => 'Marked all as read'], 200);
    }

    private function checkForAnnouncementViewsUpdate($notification)
    {
        if ($notification['type'] == 'App\Notifications\AnnouncementNotification') {
            $announcement_guid = $notification['data']['notification_guid'];
            NotificationData::where('notification_guid', $announcement_guid)->increment('views');
        }
    }
}
