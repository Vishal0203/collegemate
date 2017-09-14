<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserproject extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_projects', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title', 36);
            $table->text('description');
            $table->string('link', 512)->nullable();
            $table->integer('user_id')->unsigned();
            $table->timestamps();
        });

        Schema::table('user_projects', function(Blueprint $table) {
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
        Schema::table('user_projects', function(Blueprint $table) {
            $table->dropForeign('user_projects_user_id_foreign');
        });

        Schema::dropIfExists('user_projects');
    }
}
