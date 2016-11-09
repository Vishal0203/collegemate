<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class NotificationLevelColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('notification_data', function(Blueprint $table) {
            $table->enum('notification_level', ['all', 'inst_admin', 'inst_staff', 'inst_student', 'inst_org', 'inst_staff_students'])
                ->default('all')->after('notification_body');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('notification_data', function(Blueprint $table) {
            $table->dropColumn('notification_level');
        });
    }
}
