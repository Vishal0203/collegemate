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
    public $upvoter;

    /**
     * Create a new notification instance.
     *
     * @param App/Comment $comment
     * @param App/User $upvoter
     * @return void
     */
    public function __construct($comment, $upvoter)
    {
        $this->comment = $comment;
        $this->upvoter = $upvoter;
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
            'upvoter' => $this->upvoter['first_name']
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'data' => [
                'comment_guid' => $this->comment['comment_guid'],
                'post_guid' => $this->comment->post['post_guid'],
                'post_heading' => $this->comment->post['post_heading'],
                'upvoter' => $this->upvoter['first_name'],
            ],
            'message' =>
                'Your comment on post "' . substr($this->comment->post['post_heading'], 0, 40) . '" was upvoted'
        ]);
    }
}
