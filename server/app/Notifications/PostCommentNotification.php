<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;

class PostCommentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $post;
    public $commenter;

    /**
     * Create a new notification instance.
     *
     * @param App/Post $post
     * @param App/User $commenter
     * @return void
     */
    public function __construct($post, $commenter)
    {
        $this->post = $post;
        $this->commenter = $commenter;
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
            'commenter' => $this->commenter['first_name']
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'data' => [
                'post_guid' => $this->post['post_guid'],
                'post_heading' => $this->post['post_heading'],
                'commenter' => $this->commenter['first_name'],
            ],
            'message' => 'New comment on post "' . substr($this->post['post_heading'], 0, 40) .  '..."'
        ]);
    }
}
