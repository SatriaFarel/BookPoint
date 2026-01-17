<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    use HasFactory;

    protected $table = 'products';

    protected $fillable = [
        'id',
        'seller_id', 
        'category_id', 
        'image', 
        'name', 
        'stock', 
        'price', 
        'discount_percent', 
        'description',
    ];
}

