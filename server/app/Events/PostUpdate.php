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
        if (!$this->post['is_anonymous']) {
            $this->post->load(['user', 'user.userProfile']);
        }
        $this->post->load('tags');
        $this->post->load(['comments' => function ($comment) {
            $comment->orderBy('created_at', 'DESC');
        },'comments.user.userProfile']);
        foreach ($this->post->comments as $comment) {
            $comment['upvotes_count'] = $comment->upvotesCount();
        }
        $this->post['upvotes_count'] = $this->post->upvotesCount();
        $this->post['comments_count'] = $this->post->commentsCount();
        return array_merge(
            $this->post->toArray(),
            ['message' => 'Post was updated']
        );
    }
}
