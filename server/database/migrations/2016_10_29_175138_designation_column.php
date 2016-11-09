<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DesignationColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_profile', function ($table) {
            $table->string('designation')->nullable()->after('user_id');
        });

        Schema::table('users', function ($table) {
            $table->integer('default_institute')->unsigned()->nullable()->after('remember_token');
        });

        Schema::table('users', function($table) {
            $table->foreign('default_institute')->references('id')->on('institute_profile');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function(Blueprint $table) {
            $table->dropForeign('users_default_institute_foreign');
        });

        Schema::table('users', function ($table) {
            $table->dropColumn('default_institute');
        });

        Schema::table('user_profile', function ($table) {
            $table->dropColumn('designation');
        });
    }
}
