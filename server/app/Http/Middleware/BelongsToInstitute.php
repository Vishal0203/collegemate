<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Auth\Guard;

class BelongsToInstitute
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
        $institute_guid = $request['institute_guid'] == null ?
            $request->route('institute_guid') : $request['institute_guid'];
        $user = $this->auth->user();

        if ($user['todevs_superuser'] == 1 || $user['todevs_staff'] == 1) {
            return $next($request);
        }

        $key = \Session::getId() . "_" . $institute_guid;
        $role = \Cache::get($key);
        if ($role) {
            $request->attributes->add(['auth_user_role' => $role]);
            return $next($request);
        } else {
            $user_institute = $user->institutes()->where('inst_profile_guid', $institute_guid)->get();
            // array will always have 1 institute
            if ($user_institute->count() != 0) {
                $role = $user_institute[0]->pivot->role;

                $expiresAt = Carbon::now()->addMinutes(20);
                \Cache::add($key, $role, $expiresAt);

                $request->attributes->add(['auth_user_role' => $role]);
                return $next($request);
            }
        }

        return response()->json(['error' => 'You are not authorized'], 403);
    }
}
