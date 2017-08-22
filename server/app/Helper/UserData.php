<?php

namespace App\Helper;

use App\Category;

class UserData
{
    private static function getLoadableRelations($user)
    {
        return [
            'userProfile', 'institutes', 'unreadNotifications',
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
        ];
    }

    private static function getDefaultCategories($user)
    {
        if (!$user['defaultInstitute']) {
            return;
        }
        $defaultCategories = Category::where('is_default', true)
            ->where(function ($allDefault) use ($user) {
                $allDefault->where('institute_id', $user->defaultInstitute['id'])
                    ->orWhere('institute_id', null);
            })->get();

        $notifyingDefaultCategories = Category::where('is_default', true)
            ->where('institute_id', null)
            ->whereHas('notifiers', function ($notifiers) use ($user) {
                $notifiers->where('user_id', $user['id']);
            })->get();

        $user['defaultInstitute']['default_categories'] = $defaultCategories;

        $temp = $user['defaultInstitute']['notifyingCategories'];
        unset($user['defaultInstitute']['notifyingCategories']);
        $user['defaultInstitute']['notifying_categories'] = $temp->merge($notifyingDefaultCategories);
    }

    public static function buildUserReturnable($user, $institutes_only = false)
    {
        $loadable_relations = UserData::getLoadableRelations(\Auth::user());
        if ($institutes_only) {
            $loadable_relations = array_slice($loadable_relations, 3);
        }

        $user->load($loadable_relations);

        UserData::getDefaultCategories($user);

        if (!$institutes_only) {
            foreach ($user['unreadNotifications'] as $notification) {
                unset(
                    $notification['notifiable_id'],
                    $notification['notifiable_type'],
                    $notification['read_at'],
                    $notification['updated_at']
                );
            }
        }

        return $user;
    }

    public static function getFieldsAsArray(array $data, string $key)
    {
        return array_map(function ($element) use ($key) {
            return $element[$key];
        }, $data);
    }
}
