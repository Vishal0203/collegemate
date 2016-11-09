<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InstituteIdJobsPosts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('collegemate_jobs', function(Blueprint $table) {
            $table->integer('institute_id')->unsigned()->after('user_id');
            $table->foreign('institute_id')->references('id')->on('institute_profile')->onDelete('cascade');
        });

        Schema::table('posts', function(Blueprint $table) {
            $table->integer('institute_id')->unsigned()->after('user_id');
            $table->foreign('institute_id')->references('id')->on('institute_profile')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('collegemate_jobs', function(Blueprint $table) {
            $table->dropForeign('collegemate_jobs_institute_id_foreign');
            $table->dropColumn('institute_id');
        });

        Schema::table('posts', function(Blueprint $table) {
            $table->dropForeign('posts_institute_id_foreign');
            $table->dropColumn('institute_id');
        });
    }
}
