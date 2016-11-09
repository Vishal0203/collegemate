<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UserPostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->increments('id');
            $table->string('post_guid', 36);
            $table->integer('user_id')->unsigned();
            $table->enum('visibility', ['public', 'private'])->default('public');
            $table->tinyInteger('is_anonymous')->default(0);
            $table->string('post_heading');
            $table->text('post_description');
            $table->timestamps();
        });

        Schema::table('posts', function(Blueprint $table) {
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
        Schema::table('posts', function(Blueprint $table) {
            $table->dropForeign('posts_user_id_foreign');
        });
        
        Schema::dropIfExists('posts');
    }
}
