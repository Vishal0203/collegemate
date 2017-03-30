<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewCommentOnPost extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected $post;
    /**
     * Create a new message instance.
     *
     * @return void
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
                    ->subject('Comment in your post Notification')
                    ->with([
                        'userName' => $this->user->first_name,
                        'postHeading' => $this->post['post_heading'],
                        'postguid' => $this->post['post_guid'],
                    ]);
    }
}
