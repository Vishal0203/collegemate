<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = 'posts';

    protected $fillable = ['post_guid', 'user_id', 'post_heading', 'post_description', 'is_anonymous', 'institute_id'];

    protected $hidden = ['id', 'user_id', 'is_anonymous', 'institute_id'];

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

    public function upvotesCount()
    {
        return $this->morphMany('App\Upvote', 'upvotable')->count();
    }

    public function replies()
    {
        return $this->morphMany('App\Reply', 'repliable');
    }

    public function commentsCount()
    {
        return $this->hasMany('App\Comment')->count();
    }
}
