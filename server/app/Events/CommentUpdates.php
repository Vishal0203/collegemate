<?php

namespace App\Events;

use App\Post;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class CommentUpdates extends Event implements ShouldBroadcast
{
    use SerializesModels;

    public $comment_guid;
    public $post_guid;
    public $institute_guid;
    public $type;

    /**
     * Create a new event instance.
     *
     * @param $post_guid
     * @param $comment_guid
     * @param $institute_guid
     * @param $type
     */
    public function __construct($post_guid, $comment_guid, $institute_guid, $type)
    {
        $this->post_guid = $post_guid;
        $this->comment_guid = $comment_guid;
        $this->institute_guid = $institute_guid;
        $this->type = $type;
    }

    public function broadcastAs()
    {
            return 'comment-update';
    }

    /**
     * Get the channels the event should be broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
        return ['post_' . $this->post_guid];
    }

    public function broadcastWith()
    {
        return [
            'comment_guid' => $this->comment_guid,
            'post_guid' => $this->post_guid,
            'institute_guid' => $this->institute_guid,
            'type' => $this->type,
            'message' => 'Post was updated',
            'snackbar' => false
        ];
    }
}
