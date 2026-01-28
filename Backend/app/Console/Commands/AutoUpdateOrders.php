<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use Carbon\Carbon;

class AutoUpdateOrders extends Command
{
    protected $signature = 'orders:auto-update';
    protected $description = 'Auto update dan hapus order berdasarkan waktu';

    public function handle()
    {
        // auto selesai
        Order::where('status', 'dikirim')
            ->where('updated_at', '<=', Carbon::now()->subDays(3))
            ->update(['status' => 'selesai']);

        // ambil order ditolak > 30 hari
        $orders = Order::where('status', 'ditolak')
            ->where('updated_at', '<=', Carbon::now()->subDays(30))
            ->get();

        foreach ($orders as $order) {
            // hapus item dulu
            $order->items()->delete();
            // baru hapus order
            $order->delete();
        }
    }
}
