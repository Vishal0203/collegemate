<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InitialTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('user_guid', 36);
            $table->string('email')->unique();
            $table->string('password', 60)->nullable();
            $table->string('first_name', 30);
            $table->string('last_name', 30);
            $table->boolean('todevs_superuser');
            $table->boolean('todevs_staff');
            $table->boolean('is_verified');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('users_institutes', function (Blueprint $table) {
            $table->integer('user_id')->unsigned();
            $table->integer('institute_id')->unsigned();
            $table->string('member_id')->nullable();
            $table->enum('role', ['todevs', 'inst_superuser', 'inst_admin', 'inst_staff', 'inst_student']);
            $table->primary(array('user_id', 'institute_id'));
            $table->unique(array('institute_id', 'member_id'));
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('user_profile', function (Blueprint $table) {
            $table->increments('id');
            $table->string('user_profile_guid', 36);
            $table->integer('user_id')->unsigned();
            $table->date('dob');
            $table->text('about_me');
            $table->timestamps();
        });

        Schema::create('institute_profile', function (Blueprint $table) {
            $table->increments('id');
            $table->string('inst_profile_guid', 36);
            $table->integer('user_id')->unsigned();
            $table->string('institute_code')->nullable();
            $table->string('institute_name', 100);
            $table->string('institute_description', 300);
            $table->string('contact', 20);
            $table->text('address');
            $table->string('city', 100);
            $table->string('postal_code', 16);
            $table->string('country', 100);
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('institute_notifications', function (Blueprint $table) {
            $table->increments('id');
            $table->string('inst_notification_guid', 36);
            $table->integer('institute_id')->unsigned();
            $table->string('notification_type');
            $table->string('notification_desc', 150);
            $table->integer('created_by')->unsigned();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('institute_notifiers', function (Blueprint $table) {
            $table->integer('inst_notification_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->integer('created_by')->unsigned();
            $table->integer('updated_by')->unsigned();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('notification_data', function (Blueprint $table) {
            $table->increments('id');
            $table->string('notification_guid', 36);
            $table->string('notification_head' ,500);
            $table->text('notification_body');
            $table->integer('inst_notification_id')->unsigned();
            $table->integer('created_by')->unsigned();
            $table->timestamps();
        });

        Schema::create('subscriptions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('subscription_guid', 36);
            $table->integer('inst_notification_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('subscriptions_user', function (Blueprint $table) {
            $table->integer('subscription_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::table('institute_profile', function(Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users');
        });

        Schema::table('institute_notifications', function(Blueprint $table) {
            $table->foreign('institute_id')->references('id')->on('institute_profile')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users');
        });

        Schema::table('institute_notifiers', function(Blueprint $table) {
            $table->foreign('inst_notification_id')->references('id')->on('institute_notifications')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('updated_by')->references('id')->on('users');
        });

        Schema::table('notification_data', function(Blueprint $table) {
            $table->foreign('inst_notification_id')->references('id')->on('institute_notifications')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users');
        });

        Schema::table('subscriptions', function(Blueprint $table) {
            $table->foreign('inst_notification_id')->references('id')->on('institute_notifications')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('subscriptions_user', function(Blueprint $table) {
            $table->foreign('subscription_id')->references('id')->on('subscriptions')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('user_profile', function(Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('users_institutes', function(Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
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
        Schema::table('users_institutes', function(Blueprint $table) {
            $table->dropForeign('users_institutes_user_id_foreign');
            $table->dropForeign('users_institutes_institute_id_foreign');
        });

        Schema::table('subscriptions', function(Blueprint $table) {
            $table->dropforeign('subscriptions_inst_notification_id_foreign');
            $table->dropforeign('subscriptions_user_id_foreign');
        });


        Schema::table('subscriptions_user', function(Blueprint $table) {
            $table->dropForeign('subscriptions_user_subscription_id_foreign');
            $table->dropforeign('subscriptions_user_user_id_foreign');
        });

        Schema::table('notification_data', function(Blueprint $table) {
            $table->dropforeign('notification_data_inst_notification_id_foreign');
            $table->dropforeign('notification_data_created_by_foreign');
        });

        Schema::table('institute_notifiers', function(Blueprint $table){
            $table->dropForeign('institute_notifiers_created_by_foreign');
            $table->dropForeign('institute_notifiers_inst_notification_id_foreign');
            $table->dropForeign('institute_notifiers_updated_by_foreign');
            $table->dropForeign('institute_notifiers_user_id_foreign');
        });

        Schema::table('institute_notifications', function(Blueprint $table){
            $table->dropForeign('institute_notifications_institute_id_foreign');
            $table->dropForeign('institute_notifications_created_by_foreign');
        });

        Schema::table('institute_profile', function(Blueprint $table){
            $table->dropForeign('institute_profile_user_id_foreign');
        });

        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('subscriptions_user');
        Schema::dropIfExists('notification_data');
        Schema::dropIfExists('institute_notifiers');
        Schema::dropIfExists('institute_notifications');
        Schema::dropIfExists('institute_profile');
        Schema::dropIfExists('users_institutes');
        Schema::dropIfExists('user_profile');
        Schema::dropIfExists('users');
    }
}
