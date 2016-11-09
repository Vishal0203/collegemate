<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{

    protected $table = 'collegemate_jobs';

    protected $fillable =
        ['job_guid', 'user_id', 'institute_id' , 'domain' ,'heading', 'description', 'location', 'type'];

    protected $hidden = ['id','updated_at','user_id','institute_id'];

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function institute()
    {
        return $this->belongsTo('App\Institute');
    }

    public function tags()
    {
        return $this->morphToMany('App\Tag', 'taggable');
    }
}
