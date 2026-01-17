<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order_Items extends Model
{
    use HasFactory;

    protected $table = 'order_items';
    protected $fillable = [
        'id',
        'order_id',
        'product_id',
        'quantity',
        'price',
    ];
}

