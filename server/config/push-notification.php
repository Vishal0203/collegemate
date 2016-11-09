<?php

return array(

    'todevsIOS' => array(
        'environment' => 'development',
        'certificate' => '/path/to/certificate.pem',
        'passPhrase' => 'password',
        'service' => 'apns'
    ),
    'todevsAndroid' => array(
        'environment' => 'production',
        'apiKey' => env('GCM_KEY'),
        'service' => 'gcm'
    )

);