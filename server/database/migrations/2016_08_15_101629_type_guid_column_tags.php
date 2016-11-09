<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TypeGuidColumnTags extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tags', function(Blueprint $table) {
            $table->string('tag_guid');
            $table->enum('type',['posts','jobs']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tags',function(Blueprint $table){
            $table->dropColumn('tag_guid');
            $table->dropColumn('type');
        });
    }
}
