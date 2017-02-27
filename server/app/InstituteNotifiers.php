<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InstituteNotifiers extends Model
{
    protected $table = 'institute_notifiers';

    protected $hidden = ['category_id', 'user_id',
        'updated_by', 'created_at', 'updated_at'];

    protected $dates = ['deleted_at'];

    public function users()
    {
        return $this->belongsToMany('App\Institute', 'users_institutes')->withPivot('member_id', 'role');
    }
}
