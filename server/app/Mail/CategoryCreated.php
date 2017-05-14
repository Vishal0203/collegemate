<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class CategoryCreated extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected $category;
    protected $institute;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user, $category, $institute)
    {
        $this->user = $user;
        $this->category = $category;
        $this->institute = $institute;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('email.CategoryCreated')
                    ->subject('New Category created in your institute')
                    ->with([
                        'userName' => $this->user->first_name,
                        'categoryName' => $this->category->category_type,
                        'instituteName' => $this->institute->institute_name,
                    ]);
    }
}
