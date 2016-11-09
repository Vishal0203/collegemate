<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class JobsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('collegemate_jobs', function (Blueprint $table) {
            $table->increments('id');
            $table->string('job_guid', 36);
            $table->integer('user_id')->unsigned();
            $table->enum('type', ['internship', 'full_time'])->default('full_time');
            $table->string('domain');
            $table->string('heading');
            $table->text('description');
            $table->string('location');
            $table->timestamps();
        });

        Schema::table('collegemate_jobs', function(Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users');
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
            $table->dropForeign('collegemate_jobs_user_id_foreign');
        });

        Schema::dropIfExists('collegemate_jobs');
    }
}
