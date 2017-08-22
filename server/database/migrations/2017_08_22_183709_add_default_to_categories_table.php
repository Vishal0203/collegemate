<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddDefaultToCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->boolean('is_default')->after('created_by')->default(false);
        });
        DB::statement('ALTER TABLE `categories` MODIFY `institute_id` INTEGER UNSIGNED NULL;');
        DB::statement('UPDATE `categories` SET `institute_id` = NULL WHERE `institute_id` = 0;');        
        Schema::create('users_jobs', function (Blueprint $table) {
            $table->integer('user_id')->unsigned();
            $table->integer('notification_id')->unsigned();
            $table->primary(array('user_id', 'notification_id'));
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('is_default');
        });
        Schema::dropIfExists('users_jobs');    
        DB::statement('DELETE from `categories` WHERE `institute_id` IS NULL;');        
       // DB::statement('ALTER TABLE `categories` MODIFY `institute_id` INTEGER UNSIGNED NOT NULL;');        
    }
}
