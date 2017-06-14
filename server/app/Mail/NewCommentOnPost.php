<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewCommentOnPost extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected $user;
    protected $post;

    /**
     * Create a new message instance.
     *
     * @param $user
     * @param $post
     */
    public function __construct($user, $post)
    {
        $this->user = $user;
        $this->post = $post;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('email.CommentEmail')
                    ->subject('A new answer on your post')
                    ->with([
                        'userName' => $this->user->first_name,
                        'postHeading' => $this->post['post_heading'],
                        'postguid' => $this->post['post_guid'],
                    ]);
    }
}
