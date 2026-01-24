<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';
    protected $fillable = [
        'id',
        'seller_id',
        'customer_id',
        'total_price',
        'status',
        'expedition',
        'resi',
        'payment_method',
        'bukti_pembayaran',
    ];

    // ✅ RELASI KE ORDER ITEMS
    public function items()
    {
        return $this->hasMany(Order_Items::class, 'order_id');
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
}
