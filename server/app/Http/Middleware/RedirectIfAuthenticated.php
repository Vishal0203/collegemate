<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;

class RedirectIfAuthenticated
{
    /**
     * The Guard implementation.
     *
     * @var Guard
     */
    protected $auth;

    /**
     * Create a new filter instance.
     *
     * @param  Guard  $auth
     * @return void
     */
    public function __construct(Guard $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($this->auth->check()) {
            $user = $this->auth->user();
            $user->load(['userProfile', 'institutes', 'defaultInstitute.categories' =>
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
                    }
            ]);

            return response()->json(compact('user'));
        }

        return $next($request);
    }
}
