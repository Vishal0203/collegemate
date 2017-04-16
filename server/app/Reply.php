<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Reply extends Model
{
    protected $table = 'replies';

    protected $fillable = ['user_id', 'reply_guid', 'reply_body'];

    protected $hidden = ['id', 'user_id', 'repliable_id', 'updated_at'];

    public function repliable()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
