<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DynamicInstituteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('institute_profile', function(Blueprint $table) {
            $table->integer('dynamic_table_limit')->unsigned()->default(3)->after('country');
        });

        Schema::create('dynamic_tables', function(Blueprint $table) {
            $table->increments('id');
            $table->string('dynamic_table_guid', 36);
            $table->integer('institute_id')->unsigned();
            $table->string('table_display_name', 130);
            $table->string('table_actual_name', 130);
            $table->text('table_description');
            $table->json('table_schema');
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::table('dynamic_tables', function(Blueprint $table) {
            $table->foreign('institute_id')->references('id')->on('institute_profile')->onDelete('cascade');
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
            $table->dropforeign('dynamic_tables_institute_id_foreign');
        });

        Schema::table('institute_profile', function(Blueprint $table) {
            $table->dropColumn('dynamic_table_limit');
        });

        Schema::dropIfExists('dynamic_tables');
    }
}
