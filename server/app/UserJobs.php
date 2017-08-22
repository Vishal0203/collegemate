<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserJobs extends Model
{
    use SoftDeletes;

    protected $table = 'users_jobs';

    protected $fillable = ['user_id', 'notification_id'];

    protected $hidden = ['user_id', 'notification_id'];

    protected $dates = ['deleted_at', 'created_at', 'updated_at'];
}
