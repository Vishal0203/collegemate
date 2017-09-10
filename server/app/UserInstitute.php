<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserInstitute extends Model
{
    use SoftDeletes;

    protected $table = 'users_institutes';

    protected $fillable = ['user_id', 'institute_id', 'member_id', 'role',
        'invitation_status', 'specialization', 'cgpa', 'graduated_year'];

    protected $hidden = ['user_id', 'institute_id'];

    protected $dates = ['deleted_at'];
}
