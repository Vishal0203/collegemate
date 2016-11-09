<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDesignationToUserInstitutes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_profile', function ($table) {
            $table->dropColumn('designation');
        });

        Schema::table('users_institutes', function ($table) {
            $table->string('designation')->nullable()->after('member_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users_institutes', function ($table) {
            $table->dropColumn('designation');
        });

        Schema::table('user_profile', function ($table) {
            $table->string('designation')->nullable()->after('user_id');
        });
    }
}
