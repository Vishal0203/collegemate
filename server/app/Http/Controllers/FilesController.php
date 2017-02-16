<?php

namespace App\Http\Controllers;

use App\Category;
use App\NotificationFiles;
use Illuminate\Http\Request;
use Illuminate\Session\Store;
use ZipArchive;
use Storage;

class FilesController extends Controller
{

    public function __construct()
    {
        $this->middleware(['auth', 'belongs_to_institute']);
    }

    public function getFile(Request $request)
    {
        $short_code = $request->route('short_code');
        $category_id = Category::where('category_guid', $request['category'])
            ->get(['id'])->first();

        $notification_file = NotificationFiles::where('url_code', $short_code)->with(['notification' =>
            function ($query) use ($category_id) {
                $query->where('category_id', $category_id['id']);
            }])->get()->first();

        $file_uri =
            storage_path() .
            '/app/notification_files/' .
            $notification_file['notification']['notification_guid'] .
            '/' .
            $notification_file['file'];

        return response()->download($file_uri);
    }

    public function downloadAll(Request $request)
    {
        $user = \Auth::user();
        $notification_guid = $request['notification_guid'];
        $category = Category::where('category_guid', $request['category_guid'])->with([
            'subscribers' => function ($subscribers) use ($user) {
                $subscribers->where('user_id', $user['id']);
            },
            'notifications' => function ($notification) use ($notification_guid) {
                $notification->where('notification_guid', $notification_guid);
            },
            'notifications.notificationFiles'
        ])->get()->first();

        if (is_null($category)) {
            return view('errors.404');
        }

        if (!count($category->subscribers)) {
            return response()->json(['error' => 'You are not authorized'], 403);
        }

        $filePath = 'notification_files/' . $notification_guid . '/attachments.zip';
        if (!Storage::exists($filePath)) {
            $this->createZip($notification_guid, $category->notifications[0]->notificationFiles);
        }

        $response = response(Storage::get($filePath), 200, [
            'Content-Type' => 'application/zip',
            'Content-Length' => Storage::size($filePath),
            'Content-Description' => 'File Transfer',
            'Content-Disposition' => "attachment; filename=attachments.zip",
            'Content-Transfer-Encoding' => 'binary',
        ]);

        ob_end_clean();

        return $response;
    }

    private function createZip($notification_guid, $files)
    {
        $zipFilePath = tempnam(storage_path() . '/app', '');
        $zip = new ZipArchive;
        if ($zip->open($zipFilePath, ZipArchive::CREATE) === true) {
            foreach ($files as $file) {
                $zip->addFromString(
                    $file['file'],
                    Storage::get('notification_files/' . $notification_guid . '/' . $file['file'])
                );
            }
            $zip->close();
        }

        // upload zip to s3
        Storage::put(
            'notification_files/' . $notification_guid . '/attachments.zip',
            file_get_contents($zipFilePath)
        );

        // delete the temp zip
        unlink($zipFilePath);
    }
}
