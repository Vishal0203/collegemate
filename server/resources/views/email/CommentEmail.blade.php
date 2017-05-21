@extends('email.MainTemplate')

@section('content')
                    <pre style="margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #808080;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left;">
            Hi {{ucfirst($userName)}}, 

            You have got a comment on your post {{ucfirst($postHeading)}}.
            <a href="{{getenv('APP_URL')}}/#/interactions/{{$postguid}}" style="display: inline-block;width: 115px;height: 25px;background: #89C05C;padding: 4px 10px;text-align: center;border-radius: 5px;color: white;font-weight: bold;text-decoration: none; ">View on portal</a>
                    </pre>
@endsection
