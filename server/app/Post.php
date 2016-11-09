<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = 'posts';

    protected $fillable = ['post_guid', 'user_id', 'post_heading', 'post_description'];

    protected $hidden = ['id', 'user_id'];

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function institute()
    {
        return $this->belongsTo('App\Institute');
    }

    public function comments()
    {
        return $this->hasMany('App\Comment');
    }

    public function tags()
    {
        return $this->morphToMany('App\Tag', 'taggable');
    }

    public function upvotes()
    {
        return $this->morphMany('App\Upvote', 'upvotable');
    }
}
