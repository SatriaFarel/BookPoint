<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * URI yang dikecualikan dari verifikasi CSRF.
     */
    protected $except = [
        'api/*',
    ];
}
