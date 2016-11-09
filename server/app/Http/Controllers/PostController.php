<?php

namespace App\Http\Controllers;

use App\Institute;
use App\Post;
use Illuminate\Http\Request;
use Faker;
use App\Http\Requests;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param string $institute_guid
     * @return \Illuminate\Http\Response
     */
    public function index($institute_guid)
    {
        $posts = Institute::where('inst_profile_guid', '=', $institute_guid)->first()->posts();
        return response()->json(compact('posts'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param string $institute_guid
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($institute_guid, Request $request)
    {
        $internals = Faker\Factory::create('en_US');
        $institute = Institute::where('inst_profile_guid', '=', $institute_guid)->first();
        $post = Post::create([
            'post_guid' => $internals->uuid,
            'user_id' => \Auth::user()->id,
            'visibility' => $request['visibility'],
            'is_anonymous' => $request['is_anonymous'],
            'post_heading' => $request['post_heading'],
            'post_description' => $request['post_description'],
            'institute_id' => $institute->id
        ]);
        foreach ($request['tags'] as $tag_guid) {
            $tag = Tag::where('tag_guid', '=', $tag_guid)->first();
            $post->tags()->attach($tag);
        }
        return response()->json(compact('post'), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param string $institute_guid
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($institute_guid, $id)
    {
        $post = Post::where('post_guid', '=', $id)->first()->with('comments')->get();
        return response()->json(compact('post'), 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param string $institute_guid
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $institute_guid, $id)
    {
        $post = Post::where('post_guid', '=', $id)->first();
        $postUser=$post->user()->get();
        $user = \Auth::user();
        if ($user->id == $postUser->id) {
            $post->update([
                'visibility' => $request['visibility'],
                'is_anonymous' => $request['is_anonymous'],
                'post_heading' => $request['post_heading'],
                'post_description' => $request['post_description'],
            ]);
            return response()->json(compact('job'), 202);
        }
        return response()->json(['Error' => 'Not Authorized.'], 403);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param string $institute_guid
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($institute_guid, $id)
    {
        $post = Post::where('post_guid', '=', $id)->first();
        $postUser=$post->user()->get();
        $user = \Auth::user();

        $staffInstitute = Institute::where('inst_profile_guid', $institute_guid)
            ->wherehas('users', function ($q) use ($user) {
                $q->where('role', '!=', 'inst_student')->where('id', $user->id);
            })->get();

        if (!$staffInstitute->isEmpty() || $user->id == $postUser->id) {
            $post->tags()->detach();
            $post->upvotes()->detach();
            $post->comments()->delete();
            $post->delete();
            return response()->json(['success' => 'post removed successfully'], 201);
        }
        return response()->json(['Error' => 'Not Authorized.'], 403);
    }

    public function upvote($institute_guid, $post_guid)
    {
        Post::where('post_guid', '=', $post_guid)->upvotes()->create([
            'user_id' => \Auth::user()->id
        ]);
    }
}
