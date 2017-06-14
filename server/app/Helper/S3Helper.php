<?php

namespace App\Helper;

use AWS;

class S3Helper
{
    public static function deleteAllFiles($folder, $files)
    {
        foreach ($files as $file) {
            self::deleteFile($folder, $file);
        }
        self::deleteFile($folder);
    }

    public static function deleteFile($folder, $file = null)
    {
        $s3 = AWS::createClient('s3');
        $object_key = $file ?
            'notification_files/' . $folder . '/' . $file['file'] : 'notification_files/' . $folder;

        $s3->deleteObject(array(
            'Bucket'     => 'collegemate',
            'Key'        => $object_key,
        ));
    }

    public static function uploadFile($folder, $file)
    {
        $object_key = 'notification_files/' . $folder . '/' . $file->getClientOriginalName();

        $s3 = AWS::createClient('s3');
        $s3->putObject(array(
            'Bucket'     => 'collegemate',
            'Key'        => $object_key,
            'Body' => file_get_contents($file->getRealPath()),
        ));
    }
}
