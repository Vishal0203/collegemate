<?php

namespace App\Http\Controllers;

use App\Institute;
use App\User;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'inst_admin']);
    }

    public function getCounts($institute_guid)
    {
        $categoryCount= Institute::where('inst_profile_guid', '=', $institute_guid)->first()->categories()->count();

        $membersCount = User::wherehas('institutes', function ($q) use ($institute_guid) {
            $q->where(['inst_profile_guid' => $institute_guid, 'role' => 'inst_student']);
        })->count();


        $roles = array("inst_staff", "inst_admin");
        $staffCount = User::wherehas('institutes', function ($q) use ($institute_guid, $roles) {
            $q->where('inst_profile_guid', '=', $institute_guid)
                ->whereIn('role', $roles);
        })->count();

        $notificationsCount = Institute::where('inst_profile_guid', '=', $institute_guid)
            ->first()->notifications()->count();

        return response()->json(['categoryCount' => $categoryCount, 'membersCount' => $membersCount,
            'staffCount' => $staffCount, 'notificationsCount' => $notificationsCount ], 200);
    }

    public function getCountPerCategory($institute_guid)
    {
        $instituteCategories = Institute::where('inst_profile_guid', '=', $institute_guid)
            ->first()->categories()->get();

        foreach ($instituteCategories as $category) {
            $categories[$category['category_type']] = $category->notificationsCount;
        }

        return response()->json(compact('categories'), 200);
    }
}
