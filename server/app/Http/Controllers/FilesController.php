<?php

namespace App\Http\Controllers;

use App\Category;
use App\NotificationFiles;
use Illuminate\Http\Request;
use App\Http\Requests;
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
            storage_path().
            '/app/notification_files/'.
            $notification_file['notification']['notification_guid'].
            '/'.
            $notification_file['file'];

        return response()->download($file_uri);
    }
}
