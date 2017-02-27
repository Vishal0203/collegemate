<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Notifications\Notifiable;
use Illuminate\Broadcasting\Channel;

class User extends Model implements
    AuthenticatableContract,
    AuthorizableContract,
    CanResetPasswordContract
{
    use Authenticatable, Authorizable, CanResetPassword, Notifiable;

    protected $table = 'users';

    protected $fillable = ['google_id', 'is_verified', 'first_name', 'last_name', 'email', 'password',
        'hash', 'user_guid', 'todevs_superuser', 'default_institute'];

    protected $hidden = ['google_id', 'password', 'remember_token', 'id', 'created_at', 'updated_at', 'hash',
        'default_institute'];

    protected $dates = ['created_at', 'updated_at'];

    public function institutes()
    {
        return $this->belongsToMany('App\Institute', 'users_institutes')
            ->withPivot('member_id', 'role', 'designation', 'invitation_status')->withTimestamps();
    }

    public function defaultInstitute()
    {
        return $this->belongsTo('App\Institute', 'default_institute');
    }

    public function notifyingCategories()
    {
        return
            $this->belongsToMany('App\Category', 'institute_notifiers', 'user_id', 'category_id')
                ->withTimestamps();
    }


    public function subscriptions()
    {
        return
            $this->belongsToMany('App\Category', 'subscriptions_user', 'user_id', 'category_id');
    }

    public function userProfile()
    {
        return $this->hasOne('App\UserProfile');
    }

    public function posts()
    {
        return $this->hasMany('App\Post');
    }

    public function comments()
    {
        return $this->hasMany('App\Comment');
    }

    public function receivesBroadcastNotificationsOn()
    {
        return new Channel('users_'. $this->user_guid);
    }

    public function toArray()
    {
        $attributes = $this->attributesToArray();
        $attributes = array_merge($attributes, $this->relationsToArray());
        if (isset($attributes['pivot'])) {
            foreach (array_keys($attributes['pivot']) as $key) {
                if (strpos($key, '_id') !== false && $key != 'member_id') {
                    unset($attributes['pivot'][$key]);
                }
            }
        }

        if (isset($attributes['institutes'])) {
            foreach ($attributes['institutes'] as $key => $institute) {
                unset($institute['pivot']['user_id']);
                unset($institute['pivot']['institute_id']);
                $attributes['institutes'][$key] = $institute;
            }
        }

        return $attributes;
    }
}
