<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewPost extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected $user;
    protected $post;
    protected $instName;

    /**
     * Create a new message instance.
     *
     * @param $user
     * @param $post
     * @param $instName
     */
    public function __construct($user, $post, $instName)
    {
        $this->user = $user;
        $this->post = $post;
        $this->instName = $instName;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('email.PostEmail')
            ->subject('A new question has been asked')
            ->with([
                'userName' => $this->user->first_name,
                'postHeading' => $this->post['post_heading'],
                'postGuid' => $this->post['post_guid'],
                'instName' => $this->instName
            ]);
    }
}
