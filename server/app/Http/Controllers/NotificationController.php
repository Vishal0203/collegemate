<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\NotificationFiles;
use App\Institute;
use App\NotificationData;
use Input;
use Storage;
use App\Category;
use Faker;
use URL;

class NotificationController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('belongs_to_institute');
        $this->middleware('inst_admin', ['except' => ['categoryNotifications']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @param string $institute_guid
     * @return \Illuminate\Http\Response
     */
    public function index($institute_guid)
    {
        $notifications = Institute::where('inst_profile_guid', '=', $institute_guid)->first()->notifications()
            ->with('categories')
            ->orderBy('created_at', 'DESC')->take(10)->get();

        return response()->json(compact('notifications'), 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param $institute_guid
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store($institute_guid, Request $request)
    {
        $category_guid = $request['category_guid'];

        $category =
            Category::where('category_guid', $category_guid)->get()->first();

        # TODO: Not considering notification_level for now
        $internals = Faker\Factory::create('en_US');
        $notification = new NotificationData([
            'notification_guid' => $internals->uuid,
            'notification_head' => $request['notification_head'],
            'notification_body' => $request['notification_body'],
            'created_by' => \Auth::user()->id
        ]);

        $category->notifications()->save($notification);
        if ($request->hasFile('notification_files')) {
            $notification_files = [];
            foreach ($request->file('notification_files') as $file) {
                $newFile = new NotificationFiles([
                    'file' => $file->getClientOriginalName(),
                    'url_code' => uniqid()
                ]);

                Storage::put(
                    'notification_files/' . $notification['notification_guid'] . '/' . $file->getClientOriginalName(),
                    file_get_contents($file->getRealPath())
                );
                array_push($notification_files, $newFile);
            }
            $notification->notificationFiles()->saveMany($notification_files);
        }

        $notification->load(['publisher' => function ($query) use ($institute_guid) {
            $query->with(['userProfile', 'institutes' => function ($institutes) use ($institute_guid) {
                $institutes->where('inst_profile_guid', $institute_guid)
                    ->select('id', 'designation')->get();
            }]);
        }, 'notificationFiles', 'category']);
        return response()->json(compact('notification'), 200);
    }

    /**
     * Display the specified resource.
     *
     * @param string $institute_guid
     * @param string $notification_guid
     * @return \Illuminate\Http\Response
     */
    public function show($institute_guid, $notification_guid)
    {
        $notification =
            NotificationData
                ::where('notification_guid', '=', $notification_guid)
                ->with('attachments', 'categories')->get();

        return response()->json(compact('notification'), 200);
    }

    public function categoryNotifications($institute_guid, Request $request)
    {
        $page = $request->get('page', 1);
        $skip = ($page - 1) * 10 + $request->get('skip', 0);
        $category_guid = $request['category_guid'];
        $category_ids = Category::whereIn('category_guid', explode(',', $category_guid))
            ->pluck('id');

        $data =
            NotificationData::whereIn('category_id', $category_ids->toArray())->with([
                'publisher' => function ($query) use ($institute_guid) {
                    $query->with(['userProfile', 'institutes' => function ($institutes) use ($institute_guid) {
                        $institutes->where('inst_profile_guid', $institute_guid)
                            ->select('id', 'designation')->get();
                    }]);
                },
                'notificationFiles',
                'category'
            ])->orderBy('created_at', 'DESC')->skip($skip)->take(10)->get();

        $total = NotificationData::whereIn('category_id', $category_ids->toArray())->count();
        $nextPage = $page + 1;
        $query_params = array_merge(Input::except(['page', 'skip']), ['page' => $nextPage]);
        $next_page_url = ($nextPage - 1) * 10 < $total ?
            $request->url() . "?" . http_build_query($query_params) : null;

        return response()->json(compact('total', 'next_page_url', 'data'), 200);
    }
}
