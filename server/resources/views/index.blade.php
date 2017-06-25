<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="author" content="ToDevs">
  <meta name="google-site-verification" content="o1_bHyir_x0M5pDoMTDpc4ZHo2Hl0QXCrv5xNFaZkdw" />
  <meta name="description" content="College Mate provides a platform for educational institutes to easily connect to industries, hence bridging the gap between students and the industries in India." />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="keywords" content="College placements, Fresher jobs, Inter college network, college to company network,
  Connect to companies, College notice board, Subscribed announcements, Private Q&A forum for college, Connect to companies directly, Connect to colleges directly" />

  <title>{{ $app_name }}</title>
  <link rel="shortcut icon" type="image/png" href="/favicon.png"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/highlight.js/latest/styles/github.min.css">
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
<script src="https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js"></script>
<script src="https://cdn.jsdelivr.net/highlight.js/latest/highlight.min.js"></script>
<script src="./dist/bundle.js?{{ $version }}"></script>
</body>
</html>
