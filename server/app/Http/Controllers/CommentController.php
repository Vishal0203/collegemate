<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Events\CommentUpdates;
use App\Notifications\CommentUpvoteNotification;
use App\Reply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use App\Notifications\PostCommentNotification;
use App\Notifications\CommentReplyNotification;
use Event;
use App\Http\Requests;
use Faker;
use App\Post;
use App\Upvote;

class CommentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('belongs_to_institute');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param string $post_guid
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $post_guid)
    {
        $internals = Faker\Factory::create('en_US');
        $user = \Auth::user();
        $post = Post::where('post_guid', $post_guid)->first();
        if (!$post) {
            return response()->json(['Error' => 'Post not found.'], 400);
        }
        $comment = Comment::create([
            'comment_guid' => $internals->uuid,
            'user_id' => $user['id'],
            'post_id' => $post['id'],
            'comment' => $request['comment'],
        ]);

        $comment->load('user.userProfile');
        $comment['upvotes_count'] = $comment->upvotesCount();
        Event::fire(new CommentUpdates(
            $post['post_guid'],
            $comment['comment_guid'],
            $request['institute_guid'],
            'new-comment'
        ));

        if ($post->user['id'] != $user['id']) {
            Notification::send($post->user, new PostCommentNotification($post));
        }

        return response()->json(compact('comment'), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param string $post_guid
     * @param string $comment_guid
     * @return \Illuminate\Http\Response
     * @internal param int $id
     */
    public function show($post_guid, $comment_guid)
    {
        $user = \Auth::user();
        $comment = Comment::where('comment_guid', $comment_guid)
            ->with('user', 'user.userProfile', 'replies.user')->withCount('upvotes')->first();
        $post = Post::where('post_guid', $post_guid)->with('user')->first();
        $comment->canEdit = $comment->user['id'] == \Auth::user()['id'];

        foreach ($comment->replies as $reply) {
            $reply->canEdit = $reply->user['id'] == $user['id'];
            if ($reply->user['id'] == $post->user['id'] && $post['is_anonymous']) {
                unset($reply['user']);
            }
        }

        if (!$comment) {
            return response()->json(['Error' => 'Comment not found.'], 400);
        }
        if ($post['is_anonymous'] && $comment->user['id'] === $post->user['id']) {
            unset($comment->user);
        }
        return response()->json(compact('comment'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param string $post_guid
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $post_guid, $id)
    {
        $comment = Comment::where('comment_guid', '=', $id)->first();
        $post = $comment->post()->first();
        if (!$comment) {
            return response()->json(['Error' => 'Comment not found.'], 400);
        }
        $commentUser = $comment->user()->first();
        $user = \Auth::user();
        if ($user->id == $commentUser->id) {
            $comment->update([
                'comment' => $request['comment'],
            ]);
            Event::fire(new CommentUpdates(
                $post['post_guid'],
                $comment['comment_guid'],
                $request['institute_guid'],
                'updated-comment'
            ));
            return response()->json(compact('comment'), 202);
        }
        return response()->json(['Error' => 'Not Authorized.'], 403);
    }

    /**
     * Remove the specified resource from storage.
     * @param Request $request
     * @param string $post_guid
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $post_guid, $id)
    {
        $comment = Comment::where('comment_guid', $id)->first();
        if (!$comment) {
            return response()->json(['Error' => 'Comment not found.'], 400);
        }
        $post = $comment->post()->first();
        $commentUser = $comment->user()->get()->first();
        $user = \Auth::user();
        if ($request->attributes->get('auth_user_role') != 'inst_student' || $user['id'] == $commentUser['id']) {
            $comment->delete();
            Event::fire(new CommentUpdates(
                $post['post_guid'],
                $comment['comment_guid'],
                $request['institute_guid'],
                'deleted-comment'
            ));
            return response()->json(['success' => 'Answer removed successfully'], 201);
        }
        return response()->json(['Error' => 'Not Authorized.'], 403);
    }

    public function upvote($post_guid, $comment_guid)
    {
        $comment = Comment::where('comment_guid', $comment_guid)->first();
        $user = \Auth::user();
        if (!$comment) {
            return response()->json(['Error' => 'Comment not found.'], 400);
        }
        if ($comment['user_id'] == $user['id']) {
            return response()->json(['error' => 'You cannot upvote your own comment']);
        }

        $upvote = $comment->upvotes()->where('user_id', $user['id'])->first();
        if ($upvote) {
            $upvote->delete();
        } else {
            $comment->upvotes()->create([
                'user_id' => \Auth::user()['id']
            ]);
        }

        if (!$upvote) {
            Notification::send($comment->user, new CommentUpvoteNotification($comment));
        }

        return response()->json(['upvotes_count' => $comment->upvotesCount(), 'upvoted' => !$upvote]);
    }

    public function addReply($post_guid, $comment_guid, Request $request)
    {
        $internals = Faker\Factory::create('en_US');
        $post = Post::where('post_guid', $post_guid)->first();
        $comment = Comment::where('comment_guid', $comment_guid)->first();
        if ($request->has('reply_guid')) {
            $reply = Reply::where('reply_guid', $request->get('reply_guid'))->first();
            $reply->reply_body = $request->get('reply');
            $reply->save();
        } else {
            $reply = $comment->replies()->create([
                'reply_guid' => $internals->uuid,
                'user_id' => \Auth::user()['id'],
                'reply_body' => $request->get('reply')
            ]);
        }

        Event::fire(new CommentUpdates(
            $post['post_guid'],
            $comment['comment_guid'],
            $request['institute_guid'],
            'updated-comment'
        ));

        if (\Auth::user()->id != $comment->user->id) {
            Notification::send($comment->user, new CommentReplyNotification($comment));
        }
        return response()->json(compact('reply'));
    }
}
