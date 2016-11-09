<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameInstNotification extends Migration
{
    private function recreateNotificationData()
    {
        Schema::table('notification_data', function (Blueprint $table) {
            $table->dropForeign('notification_data_created_by_foreign');
            $table->dropForeign('notification_data_inst_notification_id_foreign');
        });

        Schema::table('notification_files', function (Blueprint $table) {
            $table->dropForeign('notification_files_notification_id_foreign');
        });

        Schema::drop('notification_data');
        Schema::create('notification_data', function (Blueprint $table) {
            $table->increments('id');
            $table->string('notification_guid', 36);
            $table->string('notification_head' ,500);
            $table->text('notification_body');

            $table->enum(
                'notification_level',
                ['all', 'inst_admin', 'inst_staff', 'inst_student', 'inst_org', 'inst_staff_students']
            )->default('all');

            $table->integer('category_id')->unsigned();
            $table->integer('created_by')->unsigned();
            $table->timestamps();
        });

        Schema::table('notification_data', function (Blueprint $table) {
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users');
        });

        Schema::table('notification_files', function(Blueprint $table) {
            $table->foreign('notification_id')->references('id')->on('notification_data')->onDelete('cascade');
        });
    }

    private function refactorInstituteNotifiers()
    {
        Schema::table('institute_notifiers', function (Blueprint $table) {
            $table->dropForeign('institute_notifiers_inst_notification_id_foreign');
        });

        Schema::table('institute_notifiers', function ($table) {
            $table->renameColumn('inst_notification_id', 'category_id');
        });

        Schema::table('institute_notifiers', function(Blueprint $table){
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    private function refactorSubscriptionUser()
    {
        Schema::table('subscriptions_user', function (Blueprint $table) {
            $table->dropForeign('subscriptions_user_inst_notification_id_foreign');
        });

        Schema::table('subscriptions_user', function ($table) {
            $table->renameColumn('inst_notification_id', 'category_id');
        });

        Schema::table('subscriptions_user', function(Blueprint $table){
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    public function up()
    {
        Schema::rename('institute_notifications', 'categories');
        Schema::table('categories', function ($table) {
            $table->renameColumn('inst_notification_guid', 'category_guid');
            $table->renameColumn('notification_type', 'category_type');
            $table->renameColumn('notification_desc', 'category_desc');
        });

        $this->refactorInstituteNotifiers();
        $this->recreateNotificationData();
        $this->refactorSubscriptionUser();
    }

    public function down()
    {
        // No revert from here
    }
}
