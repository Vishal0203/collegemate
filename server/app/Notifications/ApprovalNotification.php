<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;

class ApprovalNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $user;
    public $institute;
    /**
     * Create a new notification instance.
     *
     * @param App/User $user
     * @param App/Institute $institute
     * @return void
     */
    public function __construct($user, $institute)
    {
        $this->user = $user;
        $this->institute = $institute;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }


    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return ['user' => $this->user];
    }

    public function toBroadcast($notifiable)
    {
        $insitute_id = $this->institute->id;
        return new BroadcastMessage([
            'message' => 'Pending approvals in your Institute',
            'data' => $this->user->load(['userProfile', 'institutes' => function ($query) use ($insitute_id) {
                $query->where('institute_id', $insitute_id)->first();
            }])
        ]);
    }
}
