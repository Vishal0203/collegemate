<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;

class ToDevsAuthChecker
{
    protected $auth;

    /**
     * ToDevsAuthChecker constructor.
     * @param Guard $auth
     */
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
        $user = $this->auth->user();
        if ($user['todevs_superuser'] == 1 || $user['todevs_staff'] == 1) {
            return $next($request);
        } else {
            return response()->json(["error" => "Not Authorized"], 403);
        }
    }
}
