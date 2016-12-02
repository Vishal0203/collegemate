<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $table = 'tags';
    protected $fillable = ['id','name','tag_guid','type'];
    protected $hidden = ['id', 'pivot', 'type'];

    public function posts()
    {
        return $this->morphedByMany('App\Post', 'taggable');
    }

    public function jobs()
    {
        return $this->morphedByMany('App\Job', 'taggable');
    }
}
