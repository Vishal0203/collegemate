<?php

namespace App\Console\Commands;

use App\Notification;
use App\NotificationData;
use Illuminate\Console\Command;

class UpdateViews extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update_views';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Updates views of announcements';

    /**
     * Create a new command instance.
     *
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $notifications = Notification::whereNotNull('read_at')->get();
        foreach ($notifications as $notification) {
            if ($notification['type'] == 'App\Notifications\AnnouncementNotification') {
                $announcement_guid = json_decode($notification['data'])->notification_guid;
                NotificationData::where('notification_guid', $announcement_guid)->increment('views');
            }
        }
    }
}
