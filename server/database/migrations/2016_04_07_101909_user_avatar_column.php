<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UserAvatarColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_profile', function(Blueprint $table) {
            $table->string('user_avatar')->default(env('HOST_URL') . 'avatar/default0.jpg')->after('about_me');
            $table->enum('gender', ['male', 'female'])->nullable()->after('user_id');
            $table->text('about_me')->nullable()->change();
            $table->text('dob')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_profile', function(Blueprint $table) {
            $table->dropColumn('user_avatar');
            $table->dropColumn('gender');
            $table->text('about_me')->nullable(false)->change();
            $table->text('about_me')->nullable(false)->change();
        });
    }
}
