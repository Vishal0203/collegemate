<!DOCTYPE html>
<!--[if lt IE 7]>      <html lang="en"  class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html lang="en"  class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html lang="en" class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>College Mate</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:400,100,300,500">
    <link rel="stylesheet" href="assets/bower_components/bootstrap/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/bower_components/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/css/form-elements.css">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="skin-black">

    <div class="top-content">

        <div class="inner-bg">
            <div class="container">
                <div class="row">
                    <div class="col-sm-8 col-sm-offset-2 text">
                        <h1 class="auth"><strong>ToDevs</strong> College Mate</h1>
                        <lead>
                            A private push notifier for every institute
                        </lead>
                        <br><br>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6 col-sm-offset-3 form-box">
                        @if(!$verified)
                            <div class="form-top">
                                <div class="form-top-left">
                                    <h3 class="auth">Account Verification..</h3>
                                    <p>Please set a password for your account:</p>
                                </div>
                                <div class="form-top-right">
                                    <i class="fa fa-key"></i>
                                </div>
                            </div>
                            <div class="form-bottom">
                                <form method="POST" action="{{ URL::to('verify') }}" class="login-form">
                                    <input type="hidden" name="user_guid" value="{{ $user_guid }}"/>
                                    <input type="hidden" name="hash" value="{{ $hash }}"/>
                                    <div class="form-group">
                                        <label class="sr-only" for="password">Password</label>
                                        <input type="password" name="password" placeholder="Password"
                                               class="form-password form-control auth">
                                    </div>
                                    <div class="form-group">
                                        <label class="sr-only" for="confirm_password">Password Confirm</label>
                                        <input type="password" name="confirm_password" placeholder="Confirm Password"
                                               class="form-password form-control auth">
                                    </div>
                                    <button class="btn auth" type="submit">Set Password</button>
                                </form>
                            </div>
                        @else
                            <div class="form-top">
                                <div class="form-top-left">
                                    <h3 class="auth">Account Verified!</h3>
                                    <p><a href="{{ URL::to('/') }}" style="color: white">Click here</a> to login..</p>
                                </div>
                                <div class="form-top-right">
                                    <i class="fa fa-thumbs-up"></i>
                                </div>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="assets/bower_components/jquery/dist/jquery.min.js"></script>
    <script src="assets/bower_components/jquery-ui/jquery-ui.min.js"></script>
    <script src="assets/bower_components/jquery-backstretch/jquery.backstretch.min.js"></script>
    <script src="assets/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
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

        $.backstretch([
            "assets/img/backgrounds/1.jpg",
            "assets/img/backgrounds/3.jpg",
            "assets/img/backgrounds/5.jpg",
            "assets/img/backgrounds/6.jpg"
        ], {duration: 5000, fade: 750});
    </script>
    <script src="assets/js/pace.min.js"></script>
</body>
</html>
