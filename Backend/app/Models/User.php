<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'role_id',
        'nik',
        'name',
        'email',
        'password',
        'alamat',
        'foto',
        'no_rekening',
        'qris',
        'is_online',
        'is_active',
        'otp',
        'otp_expired',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'is_online' => 'boolean',
        'is_active' => 'boolean',
    ];
}

