<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InstituteNotifiers extends Model
{
    use SoftDeletes;

    protected $table = 'institute_notifiers';

    protected $hidden = ["id", '"inst_info_guid"', "institute_id", 'notification_id', 'user_id', 'created_by',
        'updated_by', 'created_at', 'updated_at', 'deleted_at'];

    protected $dates = ['deleted_at'];

    public function users()
    {
        return $this->belongsToMany('App\Institute', 'users_institutes')->withPivot('member_id', 'role');
    }
}
