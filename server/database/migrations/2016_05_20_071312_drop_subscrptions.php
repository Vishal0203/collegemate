<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropSubscrptions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('subscriptions', function(Blueprint $table) {
            $table->dropforeign('subscriptions_inst_notification_id_foreign');
            $table->dropforeign('subscriptions_user_id_foreign');
        });

        Schema::table('subscriptions_user', function(Blueprint $table) {
            $table->dropForeign('subscriptions_user_subscription_id_foreign');
            $table->dropColumn('subscription_id');
            $table->integer('inst_notification_id')->unsigned()->after('user_id');
            $table->foreign('inst_notification_id')->references('id')->on('institute_notifications')->onDelete('cascade');
        });
        
        Schema::dropIfExists('subscriptions');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
