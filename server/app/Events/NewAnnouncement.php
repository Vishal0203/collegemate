<?php

namespace App\Events;

use App\NotificationData;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NewAnnouncement extends Event implements ShouldBroadcast
{
    use SerializesModels;

    public $notification;
    public $institute_guid;

    /**
     * Create a new event instance.
     *
     * @param NotificationData $notification
     * @param $institute_guid
     */
    public function __construct(NotificationData $notification, $institute_guid)
    {
        $this->notification = $notification;
        $this->institute_guid = $institute_guid;
    }

    public function broadcastAs()
    {
        return 'new-announcement';
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
        }, 'notificationFiles', 'category']);
        return array_merge(
            $this->notification->toArray(),
            ['message' => 'Announcement published in ' . $this->notification['category']['category_type']]
        );
    }
}
