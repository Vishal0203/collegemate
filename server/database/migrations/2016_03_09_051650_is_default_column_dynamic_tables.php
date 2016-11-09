<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class IsDefaultColumnDynamicTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('dynamic_tables', function(Blueprint $table) {
            $table->boolean('is_default')->after('table_description');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('dynamic_tables', function(Blueprint $table) {
            $table->dropColumn('is_default');
        });
    }
}
