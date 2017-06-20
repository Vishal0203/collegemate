<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EditedByAnnouncement extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('notification_data', function (Blueprint $table) {
            $table->integer('edited_by')->unsigned()->nullable()->after('created_by');
        });

        Schema::table('notification_data', function (Blueprint $table) {
            $table->foreign('edited_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('notification_data', function (Blueprint $table) {
            $table->dropForeign(['edited_by']);
            $table->dropColumn('edited_by');
        });
    }
}
