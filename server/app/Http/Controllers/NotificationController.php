<?php

namespace App\Http\Controllers;

use App\Events\AnnouncementUpdate;
use App\Helper\S3Helper;
use Illuminate\Http\Request;

use App\NotificationFiles;
use App\Institute;
use App\NotificationData;
use Input;
use App\Category;
use Faker;
use Event;
use App\Events\NewAnnouncement;
use Illuminate\Support\Facades\Notification;
use App\Notifications\AnnouncementNotification;
use App\Notifications\AnnouncementUpdateNotification;
use App\Events\DeletedAnnouncement;
use Carbon\Carbon;

class NotificationController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('belongs_to_institute');
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
     * @param $institute_guid
     * @param $notification_guid
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update($institute_guid, $notification_guid, Request $request)
    {
        if ($request['event_date'] && Carbon::createFromFormat('Y-m-d', $request['event_date']) === false) {
            return response()->json(['Error' => 'Invalid Date Format - event_date.'], 400);
        }

        $category_guid = $request['category_guid'];
        $category = Category::where('category_guid', $category_guid)->get(['id'])->first();

        $notification = NotificationData::where('notification_guid', $notification_guid)
            ->withCount(['notificationFiles'])->get()->first();

        $oldNotificationHead = $notification->notification_head;

        $notification->notification_head = $request['notification_head'];
        $notification->notification_body = $request['notification_body'];
        $notification->event_date = $request['event_date'];
        $notification->category_id = $category['id'];
        $notification->edited_by = \Auth::user()->id;
        if ($request['notify'] == 'true') {
            $notification->edited_at = Carbon::now()->toDateTimeString();
        }
        $notification->save();

        $removed_files = $request['removed_files'] ? $request['removed_files'] : [];
        $notification_files = NotificationFiles::whereIn('url_code', $removed_files)->get();

        if ($notification['notification_files_count'] === count($removed_files)) {
            S3Helper::deleteAllFiles($notification_guid, $notification_files);
            $notification->notificationFiles()->delete();
        } else {
            foreach ($notification_files as $file) {
                S3Helper::deleteFile($notification_guid, $file);
                $file->delete();
            }
        }

        if ($request->hasFile('notification_files')) {
            $notification_files = [];
            foreach ($request->file('notification_files') as $file) {
                $newFile = new NotificationFiles([
                    'file' => $file->getClientOriginalName(),
                    'url_code' => uniqid()
                ]);

                S3Helper::uploadFile($notification_guid, $file);
                array_push($notification_files, $newFile);
            }
            $notification->notificationFiles()->saveMany($notification_files);
        }

        if ($request['notify'] == 'true') {
            $notificationAudience = $category->subscribers()->where('id', '<>', \Auth::user()->id)->get();
            Notification::send($notificationAudience, new AnnouncementUpdateNotification(
                $category,
                $notification,
                $oldNotificationHead,
                $institute_guid
            ));
        }

        Event::fire(new AnnouncementUpdate($notification, $institute_guid, $request['notify'], true));
        return response()->json(['message' => 'The announcement has been updated.']);
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
        if ($request['event_date'] && Carbon::createFromFormat('Y-m-d', $request['event_date']) === false) {
            return response()->json(['Error' => 'Invalid Date Format - event_date.'], 400);
        }
        $category_guid = $request['category_guid'];
        $category =
            Category::where('category_guid', $category_guid)->get()->first();

        # TODO: Not considering notification_level for now
        $internals = Faker\Factory::create('en_US');
        $notification = new NotificationData([
            'notification_guid' => $internals->uuid,
            'notification_head' => $request['notification_head'],
            'notification_body' => $request['notification_body'],
            'event_date' => $request['event_date'],
            'edited_at' => Carbon::now()->toDateTimeString(),
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

                S3Helper::uploadFile($notification['notification_guid'], $file);
                array_push($notification_files, $newFile);
            }
            $notification->notificationFiles()->saveMany($notification_files);
        }

        Event::fire(new NewAnnouncement($notification, $institute_guid));

        $notificationAudience = $category->subscribers()->where('id', '<>', \Auth::user()->id)->get();
        Notification::send($notificationAudience, new AnnouncementNotification(
            $category,
            $notification,
            $institute_guid
        ));

        return response()->json($request['event_date'], 200);
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
                ->with(['notificationFiles', 'category',
                    'publisher' => function ($query) use ($institute_guid) {
                        $query->with(['userProfile', 'institutes' => function ($institutes) use ($institute_guid) {
                            $institutes->where('inst_profile_guid', $institute_guid)
                                ->select('id', 'designation')->get();
                        }]);
                    }])->first();

        return response()->json(compact('notification'), 200);
    }

    public function categoryNotifications($institute_guid, Request $request)
    {
        $page = $request->get('page', 1);
        $skip = ($page - 1) * 10 + $request->get('skip', 0);
        $category_guid = $request['category_guid'];
        $category_ids = Category::whereIn('category_guid', explode(',', $category_guid))
            ->pluck('id');
        $notifications = NotificationData::whereIn('category_id', $category_ids->toArray());

        $data = $notifications->with([
            'publisher' => function ($query) use ($institute_guid) {
                $query->with(['userProfile', 'institutes' => function ($institutes) use ($institute_guid) {
                    $institutes->where('inst_profile_guid', $institute_guid)
                        ->select('id', 'designation')->get();
                }]);
            },
            'editor',
            'notificationFiles',
            'category'
        ])->orderBy('edited_at', 'DESC')->skip($skip)->take(10)->get();

        $total = NotificationData::whereIn('category_id', $category_ids->toArray())->count();
        $nextPage = $page + 1;
        $query_params = array_merge(Input::except(['page', 'skip']), ['page' => $nextPage]);
        $next_page_url = ($nextPage - 1) * 10 < $total ?
            $request->url() . "?" . http_build_query($query_params) : null;

        return response()->json(compact('total', 'next_page_url', 'data'), 200);
    }

    public function getNextEvents($institute_guid, Request $request)
    {
        $user = \Auth::user();
        $category_guid = $request['category_guid'];
        $category_ids = Category::whereIn('category_guid', explode(',', $category_guid))
            ->pluck('id');
        $events = NotificationData::whereIn('category_id', $category_ids->toArray())
            ->where('event_date', '>=', date('Y-m-d'))->orderBy('event_date', 'asc')->take(4)->get();
        return response()->json(compact('events'), 200);
    }

    public function getEventsInRange($institute_guid, Request $request)
    {
        $user = \Auth::user();
        $start = $request->get('startDate', Carbon::now()->startOfMonth());
        $end = $request->get('endDate', Carbon::now()->endOfMonth());
        $category_guid = $request['category_guid'];
        $category_ids = Category::whereIn('category_guid', explode(',', $category_guid))
            ->pluck('id');
        $events = NotificationData::whereIn('category_id', $category_ids->toArray())
            ->where('event_date', '>=', $start)->where('event_date', '<=', $end)->orderBy('event_date', 'asc')->get();
        return response()->json(compact('events'), 200);
    }

    public function destroy($institute_guid, $notification_guid, Request $request)
    {
        $user = \Auth::user();
        $notification = NotificationData::where('notification_guid', $notification_guid)->first();
        $notificationFiles = $notification->notificationFiles()->get();
        if (!$notification) {
            return response()->json(['error' => 'Announcement does not exist'], 400);
        }
        if ($notification['created_by'] !== $user['id'] && $request->get('auth_user_role') == 'inst_student') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        S3Helper::deleteAllFiles($notification['notification_guid'], $notificationFiles);
        $category = $notification->category;
        $notification->notificationFiles()->delete();
        $notification->delete();
        Event::fire(new DeletedAnnouncement($notification_guid, $category['category_guid']));
        return response()->json(['success' => 'Announcement removed successfully'], 200);
    }
}
