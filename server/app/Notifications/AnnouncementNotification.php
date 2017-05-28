<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use App\Mail\NewAnnouncement;

class AnnouncementNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $category;
    public $notification;
    public $institute_guid;

    /**
     * Create a new notification instance.
     * @param $category
     * @param $notification
     * @param string $institute_guid
     * @internal param $App /Category $category
     * @internal param $App /Notification $notification
     */
    public function __construct($category, $notification, $institute_guid)
    {
        $this->category = $category;
        $this->notification = $notification;
        $this->institute_guid = $institute_guid;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail', 'database', 'broadcast'];
    }


    /**
     * Get the array representation of the notification.
     *
     * @param  mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'category_guid' => $this->category['category_guid'],
            'category_type' => $this->category['category_type'],
            'notification_guid' => $this->notification['notification_guid'],
            'institute_guid' => $this->institute_guid
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'data' => [
                'category_guid' => $this->category['category_guid'],
                'category_type' => $this->category['category_type'],
                'notification_guid' => $this->notification['notification_guid'],
                'institute_guid' => $this->institute_guid
            ],
            'message' => 'Announcement published in ' . $this->category['category_type']
        ]);
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed $notifiable
     * @return NewAnnouncement
     */
    public function toMail($notifiable)
    {
        $this->notification->load('publisher');
        $announcer = $this->notification->publisher['first_name'] . ' ' . $this->notification->publisher['last_name'];
        return (
        new NewAnnouncement(
            $notifiable,
            $this->category,
            $announcer,
            $this->notification['notification_head']
        )
        )->to($notifiable->email);
    }
}
