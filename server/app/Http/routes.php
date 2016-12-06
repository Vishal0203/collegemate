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

Route::get('verify', 'Auth\AuthControllerGeneral@verifyAccountView');
Route::post('verify', 'Auth\AuthControllerGeneral@verifyAccount');

Route::group(['prefix' => 'todevs/king/api/v1_0'], function () {
    Route::post('register', 'Auth\AuthController@postRegister');
    Route::post('login', 'Auth\AuthController@postLogin');
});

Route::get('avatar/{filename}', 'UserProfileController@getAvatar');

Route::group(['prefix' => 'api/v1_0'], function () {
    Route::post('register', 'Auth\AuthControllerGeneral@postRegister');
    Route::post('login', 'Auth\AuthControllerGeneral@postLogin');
    Route::get('logout', 'Auth\AuthControllerGeneral@getLogout');
    Route::post('update_profile', 'UserProfileController@updateProfile');

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
        Route::resource(
            'staff',
            'StaffController',
            ['only' => ['index', 'store', 'update', 'destroy']]
        );

        Route::resource(
            'members',
            'MemberController',
            ['only' => ['index', 'store', 'destroy']]
        );

        Route::post('category/assign_staff', 'CategoryController@assignStaff');
        Route::delete('category/remove_staff', 'CategoryController@removeStaff');
        Route::get('category/notifiers', 'CategoryController@getNotifiers');
        Route::resource(
            'category',
            'CategoryController',
            ['only' => ['index', 'store', 'update' , 'destroy']]
        );

        Route::post('invitation/bulk_invite', 'InvitationController@bulkInvite');
        Route::resource(
            'invitation',
            'InvitationController',
            ['only' => ['show', 'update', 'destroy']]
        );
        
        Route::get('get_counts', 'DashboardController@getCounts');
        Route::get('get_countPerCategory', 'DashboardController@getCountPerCategory');

        Route::get('category_notifications', 'NotificationController@categoryNotifications');
        Route::resource(
            'notification',
            'NotificationController',
            ['only' => ['index','store', 'show']]
        );

        Route::post('post/{post_guid}/upvote', 'PostController@upvote');
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
        Route::get('unsubscribe', 'SubscriptionsController@unsubscribe');
    });

    Route::group(['prefix' => 'post/{post_guid}'], function () {
        Route::post('comment/{comment_guid}/upvote', 'CommentController@upvote');
        Route::resource(
            'comment',
            'CommentController',
            ['only' => ['index', 'store', 'update', 'destroy']]
        );
    });
});
