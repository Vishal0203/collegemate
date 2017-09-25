<?php

namespace App\Notifications;

use App\Mail\NewPost;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;

class NewPostNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $post;
    public $institute;

    /**
     * Create a new notification instance.
     *
     * @param $post
     * @param $institute
     */
    public function __construct($post, $institute)
    {
        $this->post = $post;
        $this->institute = $institute;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database', 'mail'];
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
            'post_guid' => $this->post['post_guid'],
            'post_heading' => $this->post['post_heading'],
            'institute_guid' => $this->institute['inst_profile_guid']
        ];
    }

    public function toMail($notifiable)
    {
        return (new NewPost($notifiable, $this->post, $this->institute['institute_name']))->to($notifiable->email);
    }
}
