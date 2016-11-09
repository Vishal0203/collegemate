<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ColumnInviteStatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users_institutes', function(Blueprint $table) {
            $table->enum('invitation_status',['accepted', 'pending', 'declined', 'cancelled'])->after('role')->default('pending');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users_institutes', function(Blueprint $table) {
            $table->dropColumn('invitation_status');
        });
    }
}
