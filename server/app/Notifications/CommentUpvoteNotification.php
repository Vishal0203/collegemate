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
    public $institute_guid;

    /**
     * Create a new notification instance.
     *
     * @param App/Comment $comment
     * @param string $institute_guid
     */
    public function __construct($comment, $institute_guid)
    {
        $this->comment = $comment;
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
            'comment_guid' => $this->comment['comment_guid'],
            'post_guid' => $this->comment->post['post_guid'],
            'post_heading' => $this->comment->post['post_heading'],
            'institute_guid' => $this->institute_guid
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'data' => [
                'comment_guid' => $this->comment['comment_guid'],
                'post_guid' => $this->comment->post['post_guid'],
                'post_heading' => $this->comment->post['post_heading'],
                'institute_guid' => $this->institute_guid
            ],
            'message' =>
                'Your answer on post "' . substr($this->comment->post['post_heading'], 0, 40) . '" was upvoted'
        ]);
    }
}
