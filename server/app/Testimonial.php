<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $table = 'testimonials';

    protected $fillable = ['message'];

    protected $hidden = ['id', 'user_id', 'selected', 'updated_at'];

    public function creator()
    {
        return $this->belongsTo('App\User', 'user_id');
    }
}
