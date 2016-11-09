<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes;

    protected $table = 'categories';

    protected $fillable =
        ['category_type', 'category_desc',  'institute_id', 'category_guid', 'created_by' ];

    protected $hidden = ['id', 'institute_id', 'created_by', 'created_at', 'updated_at', 'deleted_at', 'pivot'];

    protected $dates = ['deleted_at'];

    public function notifiers()
    {
        return $this->belongsToMany('App\User', 'institute_notifiers', 'category_id')->withTimestamps();
    }

    public function institutes()
    {
        return $this->belongsTo('App\Institute', 'institute_id');
    }

    public function subscribers()
    {
        return $this->belongsToMany('App\User', 'subscriptions_user', 'category_id')->withTimestamps();
    }

    public function notifications()
    {
        return $this->hasMany('App\NotificationData', 'category_id', 'id');
    }


    public function notificationsCountRelation()
    {
        return $this->hasOne('App\NotificationData', 'category_id', 'id')
            ->selectRaw('category_id, count(*) as count')->groupBy('category_id');
    }

    public function getNotificationsCountAttribute()
    {
        if ($this->notificationsCountRelation) {
            return $this->notificationsCountRelation->count;
        }
        return 0;
    }
}
