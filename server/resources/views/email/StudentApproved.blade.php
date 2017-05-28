@extends('email.MainTemplate')

@section('content')
<pre style="margin: 10px 50px;padding: 0;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color: #808080;font-family: Helvetica;font-size: 16px;line-height: 150%;text-align: left;">
Hi {{ucfirst($userName)}},

Welcome to collegemate.
These are the trending categories of your institute.

@foreach ($categories as $category)
    {{ $category->category_type }}
@endforeach
</pre>
@endsection
