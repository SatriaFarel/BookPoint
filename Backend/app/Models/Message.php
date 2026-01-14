<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Message extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'message';

    protected $fillable = [
        'sender_id',
        'message',
        'created_at'
    ];
}

