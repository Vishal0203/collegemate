<?php

namespace App\Http\Middleware;

use App\Category;
use App\UserInstitute;
use Closure;
use Illuminate\Contracts\Auth\Guard;

class SubscriptionCheck
{
    protected $auth;

    public function __construct(Guard $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $category_guid = $request->route('category_guid') != null ?
            $request->route('category_guid') : $request['category'];
        
        $user = $this->auth->user();
        $institute = Category::where('category_guid', $category_guid)->get()->first();

        if (!$institute) {
            return response()->json(['error' => 'You are not authorized'], 403);
        }

        $institute_id = $institute->institute_id;

        if ($user['todevs_superuser'] == 1) {
            return $next($request);
        }

        $userInstitutes = UserInstitute::where('institute_id', $institute_id)
            ->where('user_id', $user->id)->get()->first();

        if ($userInstitutes) {
            return $next($request);
        }

        return response()->json(['error' => 'You are not authorized'], 403);
    }
}
