<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class NotificationFiles extends Model
{
    protected $primaryKey = 'url_code';

    public $incrementing = false;

    protected $table = 'notification_files';
    
    protected $fillable = ['notification_id', 'file', 'url_code'];

    protected $hidden = ['created_by', 'updated_at'];

    public function notification()
    {
        return $this->belongsTo('App\NotificationData');
    }
}
