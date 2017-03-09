<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{{ $app_name }}</title>
  <link rel="shortcut icon" type="image/png" href="/favicon.png"/>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
<div id="root"></div>
<script>
  var WebFontConfig = {
    google: { families: [ 'Roboto:100,200,400,300,500:latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();
</script>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-93347832-1', 'auto');
  ga('send', 'pageview');

</script>
<script src="./dist/bundle.js?{{ $version }}"></script>
</body>
</html>
