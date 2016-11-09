<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 26/12/15
 * Time: 4:41 PM
 */

namespace App\Http\Controllers;

use Faker;
use App\User;
use App\SubscriptionsUser;
use App\Category;
use App\Subscriptions;
use Auth;
use Illuminate\Http\Request;

class SubscriptionsController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'inst_user']);
    }

    /**
     * @param string $category_guid
     * @return \Illuminate\Http\Response
     */
    public function store($category_guid)
    {
        $category =
            Category::where('category_guid', $category_guid)->get()->first();

        $subscriptions = SubscriptionsUser::create([
            'category_id' => $category->id,
            'user_id' => \Auth::user()['id']
        ]);

        return response()->json(compact('subscriptions'), 200);
    }

    /**
     * @param string $category_guid
     * @return \Illuminate\Http\Response
     */
    public function index($category_guid)
    {
        $notifications = Category::where('category_guid', $category_guid)->
        with(['subscriptions'])->get()->first();

        return response()->json(compact('notifications'), 200);
    }

    public function unsubscribe($category_guid)
    {
        $user = Auth::user();
        $notifyingCategory = Category::where('category_guid', $category_guid)
            ->whereHas('notifiers', function ($notifiers) use ($user) {
                $notifiers->where('user_id', $user['id']);
            })->get();
        if ($notifyingCategory->isEmpty()) {
            $category = Category::where('category_guid', $category_guid)->first();
            $result = $user->subscriptions()->detach($category);
            return $result == 1 ?
                response()->json(['success' => 'successfully unsubscribed from category'], 200) :
                response()->json(['failure' => 'member is not subscribed to the category'], 400);
        }
        return response()->json(['failure' => 'Notifiers cannot unsubscribe from the Category'], 400);
    }
}
