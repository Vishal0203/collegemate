<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $table = 'comments';

    protected $fillable = ['comment_guid', 'user_id', 'post_id', 'comment'];

    protected $hidden = ['id', 'user_id', 'post_id'];
    
    protected $touches = ['post'];

    public function post()
    {
        return $this->belongsTo('App\Post');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function upvotes()
    {
        return $this->morphMany('App\Upvote', 'upvotable');
    }
}
