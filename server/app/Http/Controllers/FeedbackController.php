<?php

namespace App\Http\Controllers;

use App\Feedback;
use Illuminate\Http\Request;
use AWS;

class FeedbackController extends Controller
{
    private $s3;

    public function __construct()
    {
        $this->middleware(['auth']);
        $this->s3 = AWS::createClient('s3');
    }

    public function create(Request $request)
    {
        $user = \Auth::user();

        if ($request->hasFile('feedback_attachment')) {
            $file = $request->file('feedback_attachment');
            $filename = uniqid() . '_' . $file->getClientOriginalName();

            $feedback = new Feedback([
                'type' => $request->get('type'),
                'message' => $request->get('feedback_message'),
                'file' => $filename
            ]);

            $object_key = 'feedbacks/' . $filename;

            $s3 = AWS::createClient('s3');
            $s3->putObject(array(
                'Bucket'     => 'collegemate',
                'Key'        => $object_key,
                'Body' => file_get_contents($file->getRealPath()),
            ));
        } else {
            $feedback = new Feedback([
                'type' => $request->get('type'),
                'message' => $request->get('feedback_message'),
            ]);
        }

        $user->feedbacks()->save($feedback);
        return response()->json(["success" => "Your feedback is submitted"]);
    }
}
