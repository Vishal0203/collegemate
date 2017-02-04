<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;

class AnnouncementNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $category;
    public $notification;
    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($category, $notification)
    {
        $this->category = $category;
        $this->notification = $notification;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }


    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'category_guid' => $this->category['category_guid'],
            'category_type' => $this->category['category_type'],
            'notification_guid' => $this->notification['notification_guid']
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'data' => [
                'category_guid' => $this->category['category_guid'],
                'category_type' => $this->category['category_type'],
                'notification_guid' => $this->notification['notification_guid']
            ],
            'message' => 'Announcement published in '. $this->category['category_type']
        ]);
    }
}
