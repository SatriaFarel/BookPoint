<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    protected $fillable = ['user_1', 'user_2'];

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}

?>