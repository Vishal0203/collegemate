<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use App\Mail\UpdatedAnnouncement;

class AnnouncementUpdateNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $category;
    public $notification;
    public $oldNotificationHead;
    public $institute_guid;

    /**
     * Create a new notification instance.
     * @param $category
     * @param $notification
     * @param $oldNotificationHead
     * @param string $institute_guid
     * @internal param App/Category $category
     * @internal param App/Notification $notification
     */
    public function __construct($category, $notification, $oldNotificationHead, $institute_guid)
    {
        $this->category = $category;
        $this->notification = $notification;
        $this->oldNotificationHead = $oldNotificationHead;
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
            'old_notification_head' => $this->oldNotificationHead,
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
                'old_notification_head' => $this->oldNotificationHead,
                'institute_guid' => $this->institute_guid
            ],
            'message' => 'Announcement published in ' . $this->category['category_type']
        ]);
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed $notifiable
     * @return UpdatedAnnouncement
     */
    public function toMail($notifiable)
    {
        $this->notification->load('editor');
        $announcer = $this->notification->editor['first_name'] . ' ' . $this->notification->editor['last_name'];
        return (
            new UpdatedAnnouncement(
                $notifiable,
                $this->category,
                $announcer,
                $this->oldNotificationHead
            )
        )->to($notifiable->email);
    }
}
