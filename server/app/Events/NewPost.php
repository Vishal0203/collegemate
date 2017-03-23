<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NewPost extends Event implements ShouldBroadcast
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
    public function __construct($post, $institute_guid)
    {
        $this->post = $post;
        $this->institute_guid = $institute_guid;
    }

    public function broadcastAs()
    {
        return 'new-post';
    }

    /**
     * Get the channels the event should be broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
        return ['posts_' . $this->institute_guid];
    }

    public function broadcastWith()
    {
        if (!$this->post['is_anonymous']) {
            $this->post->load('user');
        }
        $this->post->load('tags');
        $this->post['upvotes_count'] = $this->post->upvotesCount();
        $this->post['comments_count'] = $this->post->commentsCount();

        return array_merge(
            $this->post->toArray(),
            [
                'message' => 'Question was asked in your institute',
                'snackbar' => true
            ]
        );
    }
}
