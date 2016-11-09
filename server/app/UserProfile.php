<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $table = 'user_profile';

    protected $fillable = ['dob', 'gender', 'about_me', 'user_avatar', 'user_id', 'user_profile_guid'];

    protected $hidden = ['id', 'created_at', 'user_id'];

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
