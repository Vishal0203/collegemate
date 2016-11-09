<!DOCTYPE html>
<!--[if lt IE 7]>      <html lang="en" ng-app="collegemate" class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html lang="en" ng-app="collegemate" class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html lang="en" ng-app="collegemate" class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html lang="en" ng-app="collegemate" class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>College Mate</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:400,100,300,500">
    <link rel="stylesheet" href="assets/bower_components/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/bower_components/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/bower_components/Ionicons/css/ionicons.min.css">
    <link rel="stylesheet" href="assets/bower_components/iCheck/skins/all.css">
    <link rel="stylesheet" href="assets/bower_components/sweetalert/dist/sweetalert.css">
    <link rel="stylesheet" href="assets/bower_components/c3/c3.min.css">
    <link rel="stylesheet" href="assets/css/form-elements.css">
    <link rel="stylesheet" href="assets/css/animate.css">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="skin-black" ng-controller='RootController'>

    <header class="header" ng-show="check_user_status" ng-cloak>
        <div ng-include="'/root/header/header.html'"></div>
    </header>

    <div class="wrapper row-offcanvas row-offcanvas-left" ng-cloak>
        <div ng-show="check_user_status" ng-include="'/root/side-bar/side-bar.html'"></div>
        <div ng-view></div>

        <div aria-hidden="true" id="todevs_modal" class="modal fade">
            <div class="modal-dialog" style="{{ todevs_modal.style }}">
                <div class="modal-content">
                    <div class="modal-header">
                        <button aria-hidden="true" data-dismiss="modal" class="close" ng-if="todevs_modal.closable != false" type="button">×</button>
                        <h4 class="modal-title">{{ todevs_modal.title }}</h4>
                    </div>
                    <div class="modal-body" ng-include="todevs_modal.template" ng-cloak>
                    </div>
                    <div class="modal-footer" ng-if="todevs_modal.show_footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" ng-click="todevs_modal.show_footer.save()">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="alert todevs" ng-class="{'alert-success': alert.type == 'success', 'alert-danger': alert.type == 'error', 'alert-info': alert.type == 'info'}" ng-show="!alert.hidden" ng-cloak>
        <a class="close" data-dismiss="alert">×</a>
        <div ng-bind-html="alert.message | sanitize"></div>
    </div>

  <!-- In production use:
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/x.x.x/angular.min.js"></script>
  -->
    <script src="assets/bower_components/jquery/dist/jquery.min.js"></script>
    <script src="assets/bower_components/jquery-ui/jquery-ui.min.js"></script>
    <script src="assets/bower_components/jquery-slimscroll/jquery.slimscroll.min.js"></script>
    <script src="assets/bower_components/jquery-backstretch/jquery.backstretch.min.js"></script>
    <script src="assets/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
    <script src="assets/bower_components/iCheck/icheck.min.js" type="text/javascript"></script>
    <script src="assets/bower_components/angular/angular.js"></script>
    <script src="assets/bower_components/angular-animate/angular-animate.min.js"></script>
    <script src="assets/bower_components/angular-route/angular-route.min.js"></script>
    <script src="assets/bower_components/satellizer/satellizer.min.js"></script>
    <script src="assets/bower_components/sweetalert/dist/sweetalert.min.js"></script>
    <script>
        window.paceOptions = {
            document: true,
            eventLag: true,
            restartOnPushState: true,
            restartOnRequestAfter: true,
            ajax: {
                trackMethods: ['POST', 'GET', 'PUT', 'DELETE']
            }
        };
    </script>
    <script src="assets/js/pace.min.js"></script>
    <script src="app.js"></script>
    <script src="root/root.js"></script>
    <script src="auth/auth.js"></script>
    <script src="root/header/header.js"></script>
    <script src="root/side-bar/side-bar.js"></script>
    <script src="assets/bower_components/d3/d3.min.js"></script>
    <script src="assets/bower_components/c3/c3.min.js"></script>
    <script src="dashboard/dashboard.js"></script>
    <script src="manage-institutes/manage-institutes.js"></script>
    <script src="manage-staff/manage-staff.js"></script>
    <script src="manage-members/manage-members.js"></script>
    <script src="manage-notifications/manage-notifications.js"></script>
    <script src="notifications/notifications.js"></script>

</body>
</html>
