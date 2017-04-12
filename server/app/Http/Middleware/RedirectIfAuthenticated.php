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
     * @param  Guard $auth
     * @return void
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
        if ($this->auth->check()) {
            $user = $this->auth->user();
            $user->load(['userProfile', 'institutes', 'unreadNotifications',
                'defaultInstitute.categories' =>
                    function ($category) {
                        $category->with('creator');
                        $category->withCount('subscribers');
                    },
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

            return response()->json(compact('user'));
        }

        return $next($request);
    }
}
