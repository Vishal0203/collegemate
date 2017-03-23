<?php

namespace App\Http\Controllers;

use App\Tag;
use Illuminate\Http\Request;
use Faker;

class TagsController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $tags = Tag::where([['type', $request['type']],['is_approved', true]])->get();
        return response()->json(compact('tags'));
    }

    public static function store(array $data)
    {
        $internals = Faker\Factory::create('en_US');
        $tag = Tag::create([
            'name' => $data['name'],
            'type' => 'posts',
            'is_approved' => false,
            'tag_guid' => $internals->uuid,
        ]);
        
        return $tag;
    }
}
