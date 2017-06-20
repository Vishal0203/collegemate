<?php

namespace App\Events;

use App\Category;
use App\NotificationData;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class DeletedAnnouncement extends Event implements ShouldBroadcast
{
    use SerializesModels;

    public $notification_guid;
    public $category_guid;

    /**
     * Create a new event instance.
     *
     * @param string $notification_guid
     * @param string $category_guid
     */
    public function __construct($notification_guid, $category_guid)
    {
        $this->notification_guid = $notification_guid;
        $this->category_guid = $category_guid;
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
        return ['category_' . $this->category_guid];
    }

    public function broadcastWith()
    {
        return array_merge(
            [
                'type' => 'AnnouncementDelete',
                'message' => 'Announcement is updated',
                'notification_guid' => $this->notification_guid,
                'category' => [
                    'category_guid' => $this->category_guid
                ],
                'snackbar' => false
            ]
        );
    }
}
