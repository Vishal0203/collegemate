<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class InviteStaff extends Mailable
{
    use Queueable, SerializesModels;

    protected $institute;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($institute)
    {
        $this->institute = $institute;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('email.InviteStaff')
                    ->subject('Invitation to Collegemate')
                    ->with([
                        'instituteName' => $this->institute->institute_name,
                    ]);
    }
}
