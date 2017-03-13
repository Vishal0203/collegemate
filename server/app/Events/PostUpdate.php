<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PostUpdate extends Event implements ShouldBroadcast
{
    use SerializesModels;

    public $post;
    public $institute_guid;

    /**
     * Create a new event instance.
     *
     * @param $post
     * @param $institute_guid
     */
    public function __construct($post)
    {
        $this->post = $post;
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
        $this->post->load('user', 'user.userProfile')->get();
        return [
            'post_guid' => $this->post['post_guid'],
            'post_heading' => $this->post['post_heading'],
            'post_description' => $this->post['post_description'],
            'is_anonymous' => $this->post['is_anonymous'],
            'poster' => ($this->post['is_anonymous'] == 1 ? null: $this->post->user),
            'message' => 'Post was updated',
            'snackbar' => false
        ];
    }
}
