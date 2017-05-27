<?php
/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'HomeController@show');

Route::get('verify', 'Auth\AuthControllerGeneral@verifyAccountView');
Route::post('verify', 'Auth\AuthControllerGeneral@verifyAccount');

Route::group(['prefix' => 'todevs/king/api/v1_0'], function () {
    Route::post('register', 'Auth\AuthController@postRegister');
    Route::post('login', 'Auth\AuthController@postLogin');
});

Route::group(['prefix' => 'api/v1_0'], function () {
    Route::post('register', 'Auth\AuthControllerGeneral@postRegister');
    Route::post('login', 'Auth\AuthControllerGeneral@postLogin');
    Route::post('google_token', 'Auth\AuthControllerGeneral@googleOauth');
    Route::get('logout', 'Auth\AuthControllerGeneral@getLogout');
    Route::post('update_profile', 'UserProfileController@updateProfile');
    Route::put('read_notifications', 'UserProfileController@readNotifications');
    Route::put('read_all_notifications', 'UserProfileController@readAllNotifications');
    Route::get('change_institute', 'InstituteController@changeInstitute');

    Route::post('feedback', 'FeedbackController@create');

    Route::resource(
        'institutes',
        'InstituteController',
        ['only' => ['index', 'store', 'destroy']]
    );
    
    Route::resource(
        'tags',
        'TagsController',
        ['only' => ['index']]
    );
    Route::group(['prefix' => 'institute/{institute_guid}'], function () {
        Route::get('file/{short_code}', 'FilesController@getFile');
        Route::get('files/download', 'FilesController@downloadAll');
        Route::get('staff/categories', 'StaffController@getCategoriesForNotifier');
        Route::get('students_requests', 'InstituteController@getPendingStudentsRequests');
        Route::post('students_requests', 'InvitationController@studentRequestAction');
        Route::get('staff_requests', 'InstituteController@getPendingStaffMembers');
        Route::post('staff_requests', 'InvitationController@studentRequestAction');
        Route::post('register', 'InstituteController@registerToInstitute');
        Route::resource(
            'staff',
            'StaffController',
            ['only' => ['index', 'store', 'update', 'destroy']]
        );
        Route::get('download_staff_template', 'StaffController@getStaffTemplateSheet');
        Route::resource(
            'members',
            'MemberController',
            ['only' => ['index', 'store', 'destroy']]
        );

        Route::post('category/assign_notifier', 'CategoryController@assignNotifier');
        Route::delete('category/remove_notifier', 'CategoryController@removeNotifier');
        Route::get('category/notifiers', 'CategoryController@getNotifiers');
        Route::get('category/subscribers', 'CategoryController@getSubscribers');
        Route::post('category/update_subscribers', 'CategoryController@updateSubscribers');
        Route::get('category/validate_notifier', 'CategoryController@validateNotifier');

        Route::resource(
            'category',
            'CategoryController',
            ['only' => ['index', 'store', 'update' , 'destroy']]
        );

        Route::post('invitation/bulk_invite', 'InvitationController@bulkInvite');
        Route::post('staff/add_staff', 'StaffController@staffInviteRequest');
        Route::resource(
            'invitation',
            'InvitationController',
            ['only' => ['show', 'update', 'destroy']]
        );
        
        Route::get('get_counts', 'DashboardController@getCounts');
        Route::get('get_countPerCategory', 'DashboardController@getCountPerCategory');

        Route::get('get_next_events', 'NotificationController@getNextEvents');
        Route::get('get_events_in_range', 'NotificationController@getEventsInRange');
        Route::get('category_notifications', 'NotificationController@categoryNotifications');
        Route::resource(
            'notification',
            'NotificationController',
            ['only' => ['index','store', 'show', 'destroy']]
        );

        Route::post('post/{post_guid}/upvote', 'PostController@upvote');
        Route::post('post/{post_guid}/reply', 'PostController@addReply');
        Route::resource(
            'post',
            'PostController',
            ['only' => ['index', 'store', 'show' ,'update', 'destroy']]
        );

        Route::resource(
            'job',
            'JobController',
            ['only' => ['index', 'store', 'update', 'destroy']]
        );
    });

    Route::group(['prefix' => 'category/{category_guid}'], function () {
        Route::post('subscribe', 'SubscriptionsController@store');
        Route::get('subscriptions', 'SubscriptionsController@index');
        Route::post('unsubscribe', 'SubscriptionsController@unsubscribe');
    });

    Route::group(['prefix' => 'post/{post_guid}'], function () {
        Route::post('comment/{comment_guid}/upvote', 'CommentController@upvote');
        Route::post('comment/{comment_guid}/reply', 'CommentController@addReply');
        Route::get('reply/{reply_guid}', 'PostController@getReply');
        Route::delete('reply', 'PostController@deleteReply');
        Route::resource(
            'comment',
            'CommentController',
            ['only' => ['index', 'store', 'show', 'update', 'destroy']]
        );
    });
});
