<?php

namespace App\Http\Controllers;

use App\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth', ['except' => 'index']);
    }

    public function index()
    {
        $testimonials  = Testimonial::where('selected', true)
            ->with(['creator.userProfile', 'creator.defaultInstitute'])->get();

        return response()->json(compact('testimonials'));
    }

    public function store(Request $request)
    {
        $user = \Auth::user();
        $testimonial = new Testimonial([
            'message' => $request->get('message'),
        ]);

        $user->testimonials()->save($testimonial);
        return response()->json(["success" => "Your testimonial is submitted"]);
    }
}
