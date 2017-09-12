<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UserProject extends Model
{
    protected $table = 'user_project';

    protected $fillable = ['title', 'description', 'link', 'user_id'];

    protected $hidden = ['id', 'created_at', 'user_id'];

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
