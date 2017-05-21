<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;

class PostUpvoteNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $post;
    public $institute_guid;

    /**
     * Create a new notification instance.
     *
     * @param App/Post $post
     * @param string $institute_guid
     */
    public function __construct($post, $institute_guid)
    {
        $this->post = $post;
        $this->institute_guid = $institute_guid;
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
            'post_guid' => $this->post['post_guid'],
            'post_heading' => $this->post['post_heading'],
            'institute_guid' => $this->institute_guid
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'data' => [
                'post_guid' => $this->post['post_guid'],
                'post_heading' => $this->post['post_heading'],
                'institute_guid' => $this->institute_guid
            ],
            'message' => 'Your post "' . substr($this->post['post_heading'], 0, 40) .  '... was upvoted"'
        ]);
    }
}
