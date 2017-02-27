<?php

namespace App\Http\Controllers;

class HomeController extends Controller
{
    public function show()
    {
        return view('index', ['app_name' => env('APP_NAME', 'College Mate'), 'version' => env('APP_VERSION')]);
    }
}
