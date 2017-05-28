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
    protected $announcer;
    protected $announcement_heading;

    /**
     * Create a new message instance.
     *
     * @param $user
     * @param $category
     * @param $announcer
     * @param $announcement_heading
     */
    public function __construct($user, $category, $announcer, $announcement_heading)
    {
        $this->user = $user;
        $this->category = $category;
        $this->announcer = $announcer;
        $this->announcement_heading = $announcement_heading;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('email.AnnouncementEmail')
            ->subject('Announcement Notification')
            ->with([
                'username' => $this->user->first_name,
                'categoryType' => $this->category['category_type'],
                'announcer' => $this->announcer,
                'heading' => $this->announcement_heading
            ]);
    }
}
