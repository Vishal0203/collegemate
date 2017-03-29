<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = 'feedback';

    protected $fillable = ['type', 'message',  'file'];

    protected $hidden = ['id'];
}
