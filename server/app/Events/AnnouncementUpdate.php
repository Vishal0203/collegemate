<?php

namespace App\Events;

use App\NotificationData;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class AnnouncementUpdate extends Event implements ShouldBroadcast
{
    use SerializesModels;

    public $notification;
    public $institute_guid;
    public $notify_users;

    /**
     * Create a new event instance.
     *
     * @param NotificationData $notification
     * @param $institute_guid
     * @param $notify
     */
    public function __construct(NotificationData $notification, $institute_guid, $notify)
    {
        $this->notification = $notification;
        $this->institute_guid = $institute_guid;
        $this->notify_users = $notify;
    }

    public function broadcastAs()
    {
        return 'announcement-updates';
    }

    /**
     * Get the channels the event should be broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
        return ['category_' . $this->notification['category']['category_guid']];
    }

    public function broadcastWith()
    {
        $institute_guid = $this->institute_guid;
        $this->notification->load(['publisher' => function ($query) use ($institute_guid) {
            $query->with(['userProfile', 'institutes' => function ($institutes) use ($institute_guid) {
                $institutes->where('inst_profile_guid', $institute_guid)
                    ->select('id', 'designation')->get();
            }]);
        }, 'editor', 'notificationFiles', 'category']);
        return array_merge(
            $this->notification->toArray(),
            [
                'type' => 'AnnouncementUpdate',
                'message' => 'Announcement has been updated',
                'snackbar' => true,
                'notify_users' => $this->notify_users
            ]
        );
    }
}
