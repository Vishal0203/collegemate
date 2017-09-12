<?php

namespace App\Http\Controllers;


use App\UserProject;
use Illuminate\Http\Request;

class UserProjectController
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $user = \Auth::user;

        $projects = Institute::where('user_id', $user['id']);
        return response()->json(compact('projects'), 200);
    }

    public function store(Request $request)
    {
        $user = \Auth::user;
        $project = UserProject::create([
            'title' => $request['title'],
            'description' => $request['description'],
            'link' => $request['link'],
            'user_id' => $user['id']
        ]);

        return response()->json(compact('project'), 200);
    }

    public function destroy($id)
    {
        $project = UserProject::where('id', '=', $id)->first();
        $project->delete();
        return response()->json(['success' => 'project removed successfully'], 201);
    }

    public function update(Request $request, $id)
    {
        $project = UserProject::where('id', '=', $id)->first()
            ->update([
                'title' => $request['title'],
                'description' => $request['description'],
                'link' => $request['link']
            ]);
        return response()->json(compact('project'), 200);
    }
}