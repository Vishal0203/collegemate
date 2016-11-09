<?php

namespace App\Http\Controllers;

use App\Institute;
use App\Job;
use App\Tag;
use Illuminate\Http\Request;
use Faker;
use App\Http\Requests;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param string $institute_guid;
     * @return \Illuminate\Http\Response
     */
    public function index($institute_guid)
    {
        $jobs = Institute::where('inst_profile_guid', '=', $institute_guid)->first()->jobs();
        return response()->json(compact('jobs'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param string $institute_guid;
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($institute_guid, Request $request)
    {
        $internals = Faker\Factory::create('en_US');
        $institute = Institute::where('inst_profile_guid', '=', $institute_guid)->first();
        $job = Job::create([
            'job_guid' => $internals->uuid,
            'user_id' => \Auth::user()->id,
            'type' => $request['type'],
            'domain' => $request['domain'],
            'company' => $request['company'],
            'heading' => $request['heading'],
            'description' => $request['description'],
            'location' => $request['location'],
            'institute_id' => $institute->id
        ]);
        foreach ($request['tags'] as $tag_guid) {
            $tag = Tag::where('tag_guid', '=', $tag_guid)->first();
            $job->tags()->attach($tag);
        }
        return response()->json(compact('job'), 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param string $institute_guid;
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $institute_guid, $id)
    {
        $job = Job::where('job_guid', '=', $id)->first()
            ->update([
               'type' => $request['type'],
                'domain' => $request['domain'],
                'company' => $request['company'],
                'heading' => $request['heading'],
                'description' => $request['description'],
                'location' => $request['location']
            ]);
        return response()->json(compact('job'), 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param string $institute_guid;
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($institute_guid, $id)
    {
        $job = Job::where('job_guid', '=', $id)->first();
        $job->tags()->detach();
        $job->delete();
        return response()->json(['success' => 'job removed successfully'], 201);
    }
}
