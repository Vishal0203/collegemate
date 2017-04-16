<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;

class CommentUpvoteNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $comment;

    /**
     * Create a new notification instance.
     *
     * @param App/Comment $comment
     * @return void
     */
    public function __construct($comment)
    {
        $this->comment = $comment;
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
            'comment_guid' => $this->comment['comment_guid'],
            'post_guid' => $this->comment->post['post_guid'],
            'post_heading' => $this->comment->post['post_heading'],
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'data' => [
                'comment_guid' => $this->comment['comment_guid'],
                'post_guid' => $this->comment->post['post_guid'],
                'post_heading' => $this->comment->post['post_heading'],
            ],
            'message' =>
                'Your answer on post "' . substr($this->comment->post['post_heading'], 0, 40) . '" was upvoted'
        ]);
    }
}
