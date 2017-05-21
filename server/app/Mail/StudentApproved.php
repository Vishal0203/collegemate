<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class StudentApproved extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected $categories;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user, $categories)
    {
        $this->user = $user;
        $this->categories = $categories;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('email.StudentApproved')
                    ->subject('Invitation accepted')
                    ->with([
                        'userName' => $this->user->first_name,
                        'categories' => $this->categories,
                    ]);
    }
}
