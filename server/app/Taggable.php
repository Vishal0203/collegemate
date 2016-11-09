<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Taggable extends Model
{
    protected $table = 'taggable';

    protected $hidden = ['taggable_id', 'tag_id'];
}
