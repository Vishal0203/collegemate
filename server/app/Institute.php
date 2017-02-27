<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Institute extends Model
{
    use SoftDeletes;

    protected $table = 'institute_profile';

    protected $fillable = ['inst_profile_guid', 'institute_code', 'institute_name', 'institute_description',
        'user_id', 'contact', 'address', 'city', 'postal_code', 'country', 'state'];

    protected $hidden = ['id', 'dynamic_table_limit', 'updated_at', 'deleted_at', 'user_id'];

    protected $dates = ['deleted_at'];

    public function superUser()
    {
        return $this->belongsToMany('App\User', 'users_institutes')->wherePivot('role', 'inst_superuser');
    }

    public function users()
    {
        return $this->belongsToMany('App\User', 'users_institutes')
            ->withPivot('role', 'invitation_status', 'created_at', 'member_id')->withTimestamps();
    }

    public function pendingStudents()
    {
        return $this->belongsToMany('App\User', 'users_institutes')
            ->wherePivot('role', 'inst_student')
            ->wherePivot('invitation_status', 'pending')
            ->withPivot('role', 'invitation_status', 'member_id');
    }

    public function pendingStaff()
    {
        return $this->belongsToMany('App\User', 'users_institutes')
            ->wherePivot('role', 'inst_staff')
            ->wherePivot('invitation_status', 'pending')
            ->where('is_verified', 1)
            ->withPivot('role', 'invitation_status', 'member_id');
    }

    public function dynamicTables()
    {
        return $this->hasMany('App\DynamicTables');
    }

    public function categories()
    {
        return $this->hasMany('App\Category');
    }

    public function subscriptions()
    {
        return $this->hasMany('App\Category');
    }

    public function notifyingCategories()
    {
        return $this->hasMany('App\Category');
    }

    public function notifications()
    {
        return $this->hasManyThrough(
            'App\NotificationData',
            'App\Category',
            'institute_id',
            'category_id'
        );
    }

    public function userInstituteInfo()
    {
        return $this->hasMany('App\UserInstitute');
    }

    public function jobs()
    {
        return $this->hasMany('App\Job');
    }

    public function posts()
    {
        return $this->hasMany('App\Post');
    }

    public function toArray()
    {
        $attributes = $this->attributesToArray();
        $attributes = array_merge($attributes, $this->relationsToArray());
        if (isset($attributes['users'])) {
            foreach ($attributes['users'] as $key => $institute) {
                unset($institute['pivot']['user_id']);
                unset($institute['pivot']['institute_id']);
                $attributes['users'][$key] = $institute;
            }
        }

        return $attributes;
    }
}
