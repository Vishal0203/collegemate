<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewAnnouncement extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected $category;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user, $category)
    {
        $this->user = $user;
        $this->category = $category;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('email.AnnouncementEmail')
                    ->subject('Announcemnet Notification')
                    ->with([
                        'userName' => $this->user->first_name,
                        'categoryType' => $this->category['category_type'],
                    ]);
    }
}
