<?php

namespace App\Http\Controllers\Auth;

use App\User;
use App\UserInstitute;
use App\UserProfile;
use Auth;
use Illuminate\Http\Request;
use Mail;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Faker;

class AuthControllerGeneral extends Controller
{
    use AuthenticatesUsers;

    public function __construct()
    {
        $this->middleware('guest', ['except' => ['getLogout', 'loggedInUserInfo']]);
    }

    private function buildUserReturnable(User $user)
    {
        $user->load(['userProfile', 'institutes', 'unreadNotifications', 'defaultInstitute.categories',
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

        foreach ($user['unreadNotifications'] as $notification) {
            unset(
                $notification['notifiable_id'],
                $notification['notifiable_type'],
                $notification['read_at'],
                $notification['updated_at']
            );
        }

        return $user;
    }

    private function buildBase64($url)
    {
        $image = file_get_contents($url);
        if ($image !== false) {
            return 'data:image/jpg;base64,' . base64_encode($image);
        }
    }

    public function googleOauth(Request $request)
    {
        $id_token = $request->get('id_token');
        $client = new \Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
        $payload = $client->verifyIdToken($id_token);

        $user = User::where('google_id', $payload['sub'])->get()->first();
        if ($user) {
            $user_profile = UserProfile::where('user_id', $user['id'])->get()->first();
            $google_avatar = $this->buildBase64($payload['picture'] . '?sz=250');
            if ($google_avatar != $user_profile['user_avatar']) {
                $user_profile->update([
                    'user_avatar' => $google_avatar
                ]);
            }

            Auth::login($user, true);
            $user = $this->buildUserReturnable($user);
            return response()->json(compact('user'));
        } else {
            //Todo: Hardcoded inst details. Need to update based on user input
            if ($payload) {
                $internals = Faker\Factory::create('en_US');
                $user = User::create([
                    'user_guid' => $internals->uuid,
                    'google_id' => $payload['sub'],
                    'email' => $payload['email'],
                    'first_name' => $payload['given_name'],
                    'default_institute' => 1,
                    'last_name' => $payload['family_name'],
                    'is_verified' => $payload['email_verified']
                ]);

                UserProfile::create([
                    'user_profile_guid' => $internals->uuid,
                    'user_id' => $user['id'],
                    'user_avatar' => $this->buildBase64($payload['picture'] . '?sz=250')
                ]);

                UserInstitute::create([
                    'user_id' => $user['id'],
                    'institute_id' => 1,
                    'role' => 'inst_student',
                    'invitation_status' => 'accepted'
                ]);

                Auth::login($user, true);
                $user = $this->buildUserReturnable($user);
                return response()->json(compact('user'));
            } else {
                return response()->json(['error' => 'Invalid auth token'], 400);
            }
        }
    }

    public function postRegister(Request $request)
    {
        $validator = $this->validator($request->all());
        if ($validator->fails()) {
            $messages = $validator->errors();
            return response()->json($messages->all(), 400);
        }

        $user = $this->create($request->all());
        if ($user == null) {
            return response()->json(['error' => 'error creating user'], 500);
        } else {
            return response()->json(compact('user'), 200);
        }
    }

    public function postLogin(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $remember = $request->get('remember_me');

        if (Auth::attempt($credentials, $remember)) {
            $user = $this->buildUserReturnable(Auth::user());
            return response()->json(compact('user'));
        }

        return response()->json(['error' => 'invalid credentials'], 401);
    }

    private function validator(array $data)
    {
        $messages = [
            'required' => ':attribute is required field',
            'email.max' => ':attribute exceeds max limit 255 chars',
            'first_name.max' => ':attribute exceeds max limit 30 chars',
            'last_name.max' => ':attribute exceeds max limit 30 chars',
            'min' => ':attribute requires min 6 chars',
            'unique' => ':attribute already exists'
        ];

        return Validator::make($data, [
            'email' => 'required|email|max:255|unique:users',
            'first_name' => 'required|max:30',
            'last_name' => 'required|max:30'
        ], $messages);
    }

    private function create(array $data)
    {
        $internals = Faker\Factory::create('en_US');
        $user = User::create([
            'user_guid' => $internals->uuid,
            'email' => $data['email'],
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'hash' => $internals->md5
        ]);

        UserProfile::create([
            'user_profile_guid' => $internals->uuid,
            'user_id' => $user['id']
        ]);

        $user->userProfile;

        if (env('APP_ENV') == 'production' || env('APP_ENV') == 'test') {
            $verification_url = env('HOST_URL') . "verify?u=" . $user['user_guid'] . "&h=" . $user['hash'];
            $data['url'] = $verification_url;
            $this->sendVerificationMail('email.verification', $data, 'Please verify your email');
        }

        return $user;
    }

    public function getLogout()
    {
        Auth::logout();
        return response()->json(["success" => "Logged Out"], 200);
    }

    public static function sendVerificationMail($email_template, $data, $subject)
    {
        Mail::queueOn('emails', $email_template, $data, function ($m) use ($data, $subject) {
            $m->from('no-reply@todevs.com', 'ToDevs Team');
            $m->to($data['email'], $data['first_name'])->subject($subject);
        });
    }

    public function verifyAccountView(Request $request)
    {
        $user = User::where('user_guid', $request['u'])
            ->where('hash', $request['h'])->get()->first();

        if (!is_null($user)) {
            return view('verify.verification', [
                'user_guid' => $request['u'],
                'hash' => $request['h'],
                'verified' => $user['is_verified']]);
        } else {
            return view('errors.404');
        }
    }

    public function verifyAccount(Request $request, $with_password = true)
    {
        $user = User::where('user_guid', $request['user_guid'])
            ->where('hash', $request['hash'])
            ->update(['is_verified' => true, 'hash' => null, 'password' => bcrypt($request['password'])]);

        if ($user) {
            return view('verify.verification', ['verified' => true]);
        } else {
            return view('errors.404');
        }
    }

    public function checkUser(Request $request)
    {
        $user = User::where('email', $request['email'])->first();
        if (!is_null($user)) {
            return response()->json(['first_name' => $user->first_name, 'last_name' => $user->last_name], 200);
        }

        return response('', 204);
    }
}
