<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PostUpdate extends Event implements ShouldBroadcast
{
    use SerializesModels;

    public $post;
    public $type;
    public $reply_guid;
    public $institute_guid;

    /**
     * Create a new event instance.
     *
     * @param $post
     * @param $reply_guid
     * @param $institute_guid
     * @param $type
     */
    public function __construct($post, $reply_guid, $institute_guid, $type)
    {
        $this->post = $post;
        $this->type = $type;
        $this->reply_guid = $reply_guid;
        $this->institute_guid = $institute_guid;
    }

    public function broadcastAs()
    {
        return 'post-update';
    }

    /**
     * Get the channels the event should be broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
        return ['post_' . $this->post['post_guid']];
    }

    public function broadcastWith()
    {
        $this->post->load('tags', 'user.userProfile')->get();
        return [
            'institute_guid' => $this->institute_guid,
            'post_guid' => $this->post['post_guid'],
            'post_heading' => $this->post['post_heading'],
            'post_description' => $this->post['post_description'],
            'is_anonymous' => $this->post['is_anonymous'],
            'poster' => ($this->post['is_anonymous'] == 1 ? null: $this->post->user),
            'tags' => $this->post['tags'],
            'reply_guid' => $this->reply_guid,
            'message' => 'Post was updated',
            'snackbar' => false,
            'type' => $this->type
        ];
    }
}
