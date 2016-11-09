<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DynamicTables extends Model
{
    use SoftDeletes;

    protected $table = 'dynamic_tables';

    protected $fillable = ['dynamic_table_guid', 'institute_id', 'is_default', 'table_display_name',
        'table_actual_name', 'table_description', 'table_schema'];

    protected $hidden = ['id', 'institute_id', 'table_actual_name', 'table_schema', 'created_at',
        'updated_at', 'deleted_at'];

    protected $dates = ['deleted_at'];

    public function institute()
    {
        return $this->belongsTo('App\Institute');
    }
}
