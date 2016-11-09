<?php

namespace App\Http\Controllers;

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
        $response = [];
        if ($request->hasFile('avatar')) {
            $avatar = $this->updateAvatar($request, $user);
            UserProfile::where('user_id', $user['id'])->update([
                'about_me' => $request['about_me'],
                'gender' => $request['gender'],
                'user_avatar' => $avatar
            ]);
            $response['avatar'] = $avatar;
        } elseif ($request->has('avatar')) {
            UserProfile::where('user_id', $user['id'])->update([
                'about_me' => $request['about_me'],
                'gender' => $request['gender'],
                'user_avatar' => $request['avatar']
            ]);
            $response['avatar'] = $request['avatar'];
        } else {
            UserProfile::where('user_id', $user['id'])->update([
                'about_me' => $request['about_me'],
                'gender' => $request['gender']
            ]);
        }
        $response['about_me'] = $request['about_me'];
        $response['gender'] = $request['gender'];

        return response()->json(compact('response'));
    }
}
