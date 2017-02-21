<?php

namespace App\Http\Controllers;

use App\Events\NewPost;
use App\Institute;
use App\Notifications\PostUpvoteNotification;
use Illuminate\Support\Facades\Notification;
use App\Post;
use App\Tag;
use App\Upvote;
use Event;
use App\Events\PostUpdate;
use Illuminate\Http\Request;
use Faker;
use Input;

class PostController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('belongs_to_institute');
    }

    /**
     * Display a listing of the resource.
     *
     * @param string $institute_guid
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function index($institute_guid, Request $request)
    {
        $posts_query = Institute::where('inst_profile_guid', $institute_guid)->first()->posts();
        $page = $request->get('page', 1);
        $skip = ($page - 1) * 10 + $request->get('skip', 0);
        $tags_guid = $request['tags_guid'];
        if (!$tags_guid) {
            $posts = $posts_query->with(['user', 'tags'])->withCount(['upvotes', 'comments'])
                ->orderBy('created_at', 'DESC')->skip($skip)->take(10)->get();

            $total = Institute::where('inst_profile_guid', $institute_guid)->first()->posts()->count();
        } else {
            $tags_guid = explode(',', $tags_guid);
            $posts = $posts_query->whereHas('tags', function ($tags) use ($tags_guid) {
                $tags->whereIn('tag_guid', $tags_guid);
            }, '=', count($tags_guid))
                ->with(['user', 'tags'])->withCount(['upvotes', 'comments'])
                ->orderBy('created_at', 'DESC')->skip($skip)->take(10)->get();

            $total = Institute::where('inst_profile_guid', $institute_guid)->first()
                ->posts()->whereHas('tags', function ($tags) use ($tags_guid) {
                    $tags->whereIn('tag_guid', $tags_guid);
                }, '=', count($tags_guid))
                ->count();
        }

        foreach ($posts as $post) {
            if ($post['is_anonymous']) {
                unset($post['user']);
            }
        }

        $nextPage = $page + 1;
        $query_params = array_merge(Input::except(['page', 'skip']), ['page' => $nextPage]);
        $next_page_url = ($nextPage - 1) * 10 < $total ?
            $request->url() . "?" . http_build_query($query_params) : null;

        return response()->json(compact('total', 'next_page_url', 'posts'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param string $institute_guid
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store($institute_guid, Request $request)
    {
        $internals = Faker\Factory::create('en_US');
        $institute = Institute::where('inst_profile_guid', '=', $institute_guid)->first();
        $post = Post::create([
            'post_guid' => $internals->uuid,
            'user_id' => \Auth::user()['id'],
            'is_anonymous' => $request['is_anonymous'],
            'post_heading' => $request['post_heading'],
            'post_description' => $request['post_description'],
            'institute_id' => $institute->id
        ]);
        foreach ($request['tags'] as $tag_guid) {
            $tag = Tag::where('tag_guid', $tag_guid)->where('type', 'posts')->first();
            $post->tags()->attach($tag);
        }

        Event::fire(new NewPost($post, $institute_guid));
        return response()->json(['message' => 'Question was asked in your institute'], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param string $institute_guid
     * @param $post_guid
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function show($institute_guid, $post_guid)
    {
        $user = \Auth::user();
        $post = Post::where('post_guid', $post_guid)
            ->with(['comments' => function ($comment) {
                $comment->withCount('upvotes');
                $comment->with('user', 'user.userProfile');
                $comment->orderBy('created_at', 'DESC');
            }, 'tags', 'user', 'user.userProfile'])->withCount(['comments', 'upvotes'])->get()->first();
        if (!$post) {
            return response()->json(['Error' => 'Post not found.'], 400);
        }
        $post->isEditable = ($post->user->user_guid == $user->user_guid);

        foreach ($post->comments as $comment) {
            $upvote = Upvote::where('upvotable_id', $comment['id'])->where('user_id', $user['id'])->first();
            $comment->upvoted = $upvote ? true: false;
        }
        $upvote = Upvote::where('upvotable_id', $post['id'])->where('user_id', $user['id'])->first();
        $post->upvoted = $upvote ? true: false;

        if ($post['is_anonymous']) {
            unset($post['user']);
        }
        return response()->json(compact('post'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param string $institute_guid
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $institute_guid, $id)
    {
        //ToDo Need to add tags and send user
        $post = Post::where('post_guid', '=', $id)->first();
        $postUser = $post->user()->first();
        $user = \Auth::user();
        if ($user->id == $postUser->id) {
            $post->tags()->detach();
            $post->update([
                'is_anonymous' => $request['is_anonymous'],
                'post_heading' => $request['post_heading'],
                'post_description' => $request['post_description'],
            ]);
            foreach ($request['tags'] as $tag_guid) {
                $tag = Tag::where('tag_guid', $tag_guid)->where('type', 'posts')->first();
                $post->tags()->attach($tag);
            }
            $post->load('tags', 'user', 'user.userProfile');
            if ($post['is_anonymous']) {
                unset($post['user']);
            }
            Event::fire(new PostUpdate($post));
            return response()->json(compact('post'), 202);
        }
        return response()->json(['Error' => 'Not Authorized.'], 403);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $institute_quid
     * @param $post_guid
     * @param Request $request
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function destroy($institute_quid, $post_guid, Request $request)
    {
        $post = Post::where('post_guid', $post_guid)->first();
        $postUser = $post->user()->get()->first();
        $user = \Auth::user();

        if ($request->attributes->get('auth_user_role') != 'inst_student' || $user['id'] == $postUser['id']) {
            $post->tags()->detach();
            $post->upvotes()->delete();
            $post->comments()->delete();
            $post->delete();
            return response()->json(['success' => 'Post removed successfully'], 201);
        }
        return response()->json(['Error' => 'Not Authorized.'], 403);
    }

    public function upvote($institute_guid, $post_guid)
    {
        $post = Post::where('post_guid', $post_guid)->first();
        $user = \Auth::user();

        if ($post['user_id'] == $user['id']) {
            return response()->json(['error' => 'You cannot upvote your own question']);
        }

        $upvote = Upvote::where('upvotable_id', $post['id'])->where('user_id', $user['id'])->first();
        if ($upvote) {
            $upvote->delete();
        } else {
            $post->upvotes()->create([
                'user_id' => \Auth::user()['id']
            ]);
        }

        if (!$upvote) {
            Notification::send($post->user, new PostUpvoteNotification($post, $user));
        }

        return response()->json(['upvotes_count' => $post->upvotesCount(), 'upvoted' => !$upvote]);
    }
}
