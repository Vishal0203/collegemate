<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubscriptionsUser extends Model
{
    protected $table = 'subscriptions_user';

    protected $fillable = ['category_id', 'user_id'];

    protected $hidden = ['category_id', 'created_at', 'updated_at'];
    
    public function institutes()
    {
        return $this->belongsTo('App\Category', 'category_id');
    }
}
