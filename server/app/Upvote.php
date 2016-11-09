<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Upvote extends Model
{
    protected $table = 'upvotes';

    protected $fillable = ['user_id'];

    protected $hidden = ['user_id'];

    public $timestamps = false;

    public function upvotable()
    {
        return $this->morphTo();
    }
}
