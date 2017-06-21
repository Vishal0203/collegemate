<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AnnouncementEditedAt extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('notification_data', function (Blueprint $table) {
            $table->timestamp('edited_at')->nullable()->after('edited_by');
        });

        DB::update('update notification_data set edited_at = created_at');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('notification_data', function (Blueprint $table) {
            $table->dropColumn('edited_at');
        });
    }
}
