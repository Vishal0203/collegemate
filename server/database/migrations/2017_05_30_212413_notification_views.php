<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class NotificationViews extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('notification_data', function (Blueprint $table) {
            $table->integer('views')->unsigned()->default(0)->after('created_by');
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
            $table->dropColumn('views');
        });
    }
}
