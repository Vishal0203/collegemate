<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class NotificationFiles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notification_files', function (Blueprint $table) {
            $table->integer('notification_id')->unsigned();
            $table->string('file');
            $table->string('url_code', 15);
            $table->timestamps();
        });

        Schema::table('notification_files', function(Blueprint $table) {
            $table->foreign('notification_id')->references('id')->on('notification_data')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notification_files');
    }
}
