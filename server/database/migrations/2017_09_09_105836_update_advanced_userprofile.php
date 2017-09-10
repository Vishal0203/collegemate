<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateAdvancedUserprofile extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users_institutes', function (Blueprint $table) {
            $table->string('specialization');
            $table->double('cgpa');
            $table->integer('graduated_year');
        });

        Schema::table('user_profile', function (Blueprint $table) {
            $table->string('github_link', 128);
            $table->string('linkedin_link', 128);
            $table->string('stackoverflow_link', 128);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users_institutes', function (Blueprint $table) {
            $table->dropColumn('specialization');
            $table->dropColumn('cgpa');
            $table->dropColumn('graduated_year');
        });

        Schema::table('user_profile', function (Blueprint $table) {
            $table->dropColumn('github_link');
            $table->dropColumn('linkedin_link');
            $table->dropColumn('stackoverflow_link');
        });
    }
}
