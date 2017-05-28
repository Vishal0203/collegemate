@extends('email.MainTemplate')

@section('content')
<pre style="margin: 10px 50px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #808080;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left;">
Hi {{ucfirst($username)}},

A new announcement, <b><em>{{ $heading }}</em></b> has been made in category <b>{{ucfirst($categoryType)}}</b> by <b>{{ucfirst($announcer)}}</b>.

<a href="{{getenv('APP_URL')}}"
   style="display: inline-block;width: 115px;height: 20px;background: #89C05C;padding: 4px 10px;text-align: center;border-radius: 5px;color: white;font-weight: bold;text-decoration: none;">View on portal</a>
</pre>
@endsection
