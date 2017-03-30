
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
                    <pre style="margin: 10px 0;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #808080;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left;">
            Hi {{ucfirst($userName)}}, 

            A new announcement has been made in category {{ucfirst($categoryType)}}.
            <a href="{{getenv('APP_URL')}}" style="display: inline-block;width: 115px;height: 25px;background: #89C05C;padding: 4px 10px;text-align: center;border-radius: 5px;color: white;font-weight: bold;text-decoration: none;">View on portal</a>
                    </pre>
                </td>
            </tr>
             <tr>
                <td align="left" style="padding-left: 10%">
                    <img align="center" src="{{ $message->embed(public_path().'/todevs_sign.png') }}" height=70 width=150>
                </td>
            </tr>
        </table>
        </td>
    </tr>
</table>
</body>
</html>