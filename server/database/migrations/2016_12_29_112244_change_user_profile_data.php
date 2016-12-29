<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeUserProfileData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_profile', function ($table) {
            $table->dropColumn('user_avatar');
        });

        Schema::table('user_profile', function ($table) {
            $table->text('user_avatar')->after('about_me');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_profile', function ($table) {
            $table->dropColumn('user_avatar');
        });

        Schema::table('user_profile', function ($table) {
            $table->string('user_avatar')->default(env('HOST_URL') . 'avatar/default0.jpg')->after('about_me');
        });
    }
}
