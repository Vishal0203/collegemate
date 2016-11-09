<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Institute;
use App\Category;
use App\InstituteNotifiers;
use App\User;
use Auth;
use Faker;
use Illuminate\Database\QueryException;
use Illuminate\Database\Eloquent\Collection;

class CategoryController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('inst_super', ['only' => ['destroy']]);
        $this->middleware('inst_admin', ['except' => ['destroy', 'getCategoryNotifiers']]);
    }

    /**
     * Display a listing of the resource.
     * @param string $institute_guid
     * @return \Illuminate\Http\Response
     */
    public function index($institute_guid)
    {
        $institute = Institute::where('inst_profile_guid', $institute_guid)->with('categories')->get()->first();
        return response()->json(compact('institute'), 200);
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param string $institute_guid
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($institute_guid, Request $request)
    {
        $institute = Institute::where('inst_profile_guid', $institute_guid)->first();
        $institute_id = $institute->id;
        $internals = Faker\Factory::create('en_US');

        $category = Category::create([
            'category_guid' => $internals->uuid,
            'institute_id' => $institute_id,
            'category_type' => $request['category_type'],
            'category_desc' => $request['category_desc'],
            'created_by' => \Auth::user()->id,
        ]);

        $this->addNotifierToCategory($category, Auth::user());

        return response()->json(compact('category'), 200);
    }



    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param string $institute_guid
     * @param  string  $category_guid
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $institute_guid, $category_guid)
    {
        $update_status = Category::where('category_guid', $category_guid)
            ->update([
                'category_type' => $request['category_type'],
                'category_desc' => $request['category_desc']
            ]);

        if ($update_status) {
            $updated_category = [
                'category_type' => $request['category_type'],
                'category_desc' => $request['category_desc']
            ];
            return response()->json(compact('updated_category'), 201);
        } else {
            return response()->json(['error' => 'something went wrong'], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param string $institute_guid
     * @param  string  $category_guid
     * @return \Illuminate\Http\Response
     */
    public function destroy($institute_guid, $category_guid)
    {
        $category = Category::where('category_guid', $category_guid)->first();
        InstituteNotifiers::where('category_id', $category['id'])->delete();

        $category->delete();
    }

    public function addNotifierToCategory(Category $category, User $user_data)
    {
        try {
            $category->notifiers()->attach($user_data, [
                'created_by' => $user_data['id'],
                'updated_by' => $user_data['id']
            ]);

            $category->subscribers()->attach($user_data);
        } catch (QueryException $e) {
            return $e;
        }
    }


    public function addMultipleNotifiersToCategory(Category $category, Collection $users)
    {
        $data = [];
        foreach ($users as $user) {
            $data[$user['id']] = ['created_by' => Auth::user()['id'], 'updated_by' => Auth::user()['id']];
        }

        try {
            $category->notifiers()->attach($data);
            $category->subscribers()->attach(array_keys($data));
            return response()->json(compact('users'));
        } catch (QueryException $e) {
            return $e;
        }
    }

    public function removeStaff(Request $request)
    {
        $user = User::where('user_guid', $request['user_guid'])->with(['notifyingCategories' =>
            function ($query) use ($request) {
                $query->where('category_guid', $request['category_guid']);
            }])->get()->first();

        $user->notifyingCategories()->detach($user['notifyingCategories'][0]);

        return response()->json(['success' => 'successfully retracted from category'], 201);
    }

    public function assignStaff(Request $request)
    {
        $category_guid = $request['category_guid'];
        $category = Category::where('category_guid', $category_guid)->first();
        $users = User::whereIn('user_guid', $request['user_guids'])->with('userProfile')->get();

        return $this->addMultipleNotifiersToCategory($category, $users);
    }

    public function getNotifiers(Request $request)
    {
        $category_guid = $request['category_guid'];
        $category_users = Category::where('category_guid', $category_guid)
            ->with(['notifiers.userProfile'])->get()->first();
        return response()->json(compact('category_users'), 200);
    }
}
