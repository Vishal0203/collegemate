<?php

namespace App\Http\Controllers\Auth;

use App\User;
use Illuminate\Http\Request;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use Faker;

class AuthController extends Controller
{
    use AuthenticatesAndRegistersUsers, ThrottlesLogins;

    public function __construct()
    {
        $this->middleware('guest', ['except' => 'getLogout']);
    }

    public function postRegister(Request $request)
    {
        $validator = $this->validator($request->all());

        if ($validator->fails()) {
            $messages = $validator->errors();
            return response()->json($messages->all(), 400);
        }

        return response()->json($this->create($request->all()), 200);
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
            'password' => 'required|confirmed|min:6',
            'first_name' => 'required|max:30',
            'last_name' => 'required|max:30',
            'todevs_superuser' => 'required'
        ], $messages);
    }

    private function create(array $data)
    {
        $internals = Faker\Factory::create('en_US');
        return User::create([
            'user_guid' => $internals->uuid,
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'hash' => $internals->md5,
            'todevs_superuser' => $data['todevs_superuser']
        ]);
    }
}
