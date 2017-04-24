<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NotificationData extends Model
{

    protected $table = 'notification_data';

    protected $fillable = ['notification_guid', 'notification_head', 'notification_body', 'notification_level',
        'event_date', 'category_id', 'created_by'];

    protected $hidden = ['id', 'category_id', 'created_by', 'updated_at'];

    public function category()
    {
        return $this->belongsTo('App\Category', 'category_id');
    }

    public function publisher()
    {
        return $this->belongsTo('App\User', 'created_by');
    }
    
    public function notificationFiles()
    {
        return $this->hasMany('App\NotificationFiles', 'notification_id');
    }
}
