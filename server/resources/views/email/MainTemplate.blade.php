
<!doctype html>
<html>
<head>
        <meta charset="UTF-8">
</head>

<body>
<table>
    <tr>
        <td>
             <img align="center" alt="" src="{{ $message->embed(public_path().'/Header.jpg') }}" style="padding-bottom: 0;display: inline !important;vertical-align: bottom;border: 0;height: 200;outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;">
        </td>
    </tr>
    <tr>
        <td style="background-color: #ebeae7;border-top: 0;border-bottom: 0;padding-top: 36px;">
        <table>
            <tr>
                <td>
                    @yield('content')
                </td>
            </tr>
             <tr>
                <td align="left" style="padding-left: 46px">
                    <img align="center" src="{{ $message->embed(public_path().'/todevs_sign_small.png') }}">
                </td>
            </tr>
        </table>
        </td>
    </tr>
</table>
</body>
</html>