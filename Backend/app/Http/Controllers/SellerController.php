<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\Products;
use App\Models\Order_Items;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;;

use Carbon\Carbon;

class SellerController extends Controller
{
    public function dashboard($sellerId)
    {
        // total pendapatan
        $totalSales = Order::where('seller_id', $sellerId)
            ->where('status', 'disetujui')
            ->sum('total_price');

        // pesanan pending
        $pendingCount = Order::where('seller_id', $sellerId)
            ->where('status', 'diperiksa')
            ->count();

        // total produk
        $productsCount = Products::where('seller_id', $sellerId)->count();

        // pesanan terbaru
        $latestOrders = Order::with('customer')
            ->where('seller_id', $sellerId)
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id'     => $order->id,
                    'buyer'  => $order->customer->name ?? '-',
                    'status' => $order->status,
                    optional($order->created_at)->format('d M Y'),
                ];
            });

        // stok menipis (ambil nama category)
        $lowStock = Products::with('category')
            ->where('seller_id', $sellerId)
            ->where('stock', '<=', 5)
            ->get()
            ->map(function ($product) {
                return [
                    'id'       => $product->id,
                    'name'     => $product->name,
                    'stock'    => $product->stock,
                    'category' => optional($product->category)->name ?? '-',
                ];
            });

        return response()->json([
            'total_sales'    => $totalSales,
            'pending_count'  => $pendingCount,
            'products_count' => $productsCount,
            'latest_orders'  => $latestOrders,
            'low_stock'      => $lowStock,
        ]);
    }

    public function sales($sellerId)
    {
        // hanya order yang disetujui
        $orders = Order::with('items')
            ->where('seller_id', $sellerId)
            ->whereIn('status', ['disetujui', 'dikirim', 'selesai'])
            ->get();

        /* ================= SUMMARY PER BULAN ================= */
        $chart = $orders
            ->groupBy(fn($o) => Carbon::parse($o->created_at)->format('Y-m'))
            ->map(function ($group, $month) {
                return [
                    'month'  => Carbon::parse($month)->translatedFormat('M Y'),
                    'margin' => $group->sum('total_price'),
                    'profit' => $group->sum('total_price') * 0.9, // contoh bersih
                ];
            })
            ->values();

        /* ================= TABLE DETAIL ================= */
        $table = $orders->map(function ($order) {
            return [
                'id'     => $order->id,
                'date'   => $order->created_at->format('d M Y'),
                'total'  => $order->total_price,
                'status' => $order->status,
            ];
        });

        return response()->json([
            'chart' => $chart,
            'table' => $table,
        ]);
    }

    // READ ALL SELLER
    public function index()
    {
        return response()->json(
            User::where('role_id', 2)
                ->select(
                    'id',
                    'nik',
                    'name',
                    'email',
                    'alamat',
                    'no_rekening',
                    'foto',
                    'qris',
                    'is_active',
                    'is_online'
                )
                ->get()
        );
    }

    public function show($id)
    {
        $seller = User::where('role_id', 2)
            ->where('id', $id)
            ->select(
                'id',
                'nik',
                'name',
                'email',
                'alamat',
                'foto',
                'is_active',
                'is_online',
                'no_rekening',
                'qris'
            )
            ->first();

        if (!$seller) {
            return response()->json([
                'message' => 'Seller tidak ditemukan'
            ], 404);
        }

        return response()->json($seller);
    }

    // CREATE SELLER
    public function store(Request $request)
    {
        $request->validate([
            'nik'         => 'required|string|unique:users,nik',
            'name'        => 'required|string',
            'email'       => 'required|email|unique:users,email',
            'password'    => 'required|min:6',
            'alamat'      => 'required|string',
            'no_rekening' => 'nullable|string',
            'foto'        => 'nullable|image|max:2048',
            'qris'        => 'nullable|image|max:2048',
        ]);

        $foto = $request->file('foto')?->store('profile', 'public');
        $qris = $request->file('qris')?->store('qris', 'public');

        $seller = User::create([
            'role_id'     => 2,
            'nik'         => $request->nik,
            'name'        => $request->name,
            'email'       => $request->email,
            'password'    => Hash::make($request->password),
            'alamat'      => $request->alamat,
            'no_rekening' => $request->no_rekening,
            'foto'        => $foto,
            'qris'        => $qris,
            'is_active'   => true,
            'is_online'   => false,
        ]);

        return response()->json($seller, 201);
    }

    public function storeResi(Request $request, Order $order)
    {
        // ✅ VALIDASI
        $request->validate([
            'expedition' => 'required|string|max:50',
            'resi'       => 'required|string|max:100',
        ]);

        // ❌ CEGAH SALAH ALUR
        if ($order->status !== 'disetujui') {
            return response()->json([
                'message' => 'Resi hanya bisa diinput untuk pesanan approved'
            ], 422);
        }

        // ✅ SIMPAN RESI
        $order->update([
            'expedition' => $request->expedition,
            'resi'       => $request->resi,
            'status'     => 'dikirim',
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Resi berhasil disimpan',
            'data'    => $order,
        ]);
    }

    // UPDATE SELLER
    public function update(Request $request, $id)
    {
        $seller = User::where('role_id', 2)->findOrFail($id);

        $request->validate([
            'name'   => 'required|string',
            'email'  => 'required|email|unique:users,email,' . $id,
            'alamat' => 'required|string',
            'foto'  => 'nullable|image'
        ]);

        // foto opsional
        if ($request->hasFile('foto')) {
            if ($seller->foto) {
                Storage::disk('public')->delete($seller->foto);
            }

            $seller->foto = $request->file('foto')
                ->store('profile', 'public');
        }

        $seller->update([
            'name'   => $request->name,
            'email'  => $request->email,
            'alamat' => $request->alamat,
        ]);

        return response()->json($seller);
    }

    // DELETE SELLER
    public function destroy($id)
    {
        User::where('role_id', 2)->findOrFail($id)->delete();

        return response()->json(['success' => true]);
    }

    public function detail($id)
    {
        $seller = User::with([
            'products:id,seller_id,name'
        ])->findOrFail($id);

        // ambil order seller yang valid
        $orders = Order::where('seller_id', $id)
            ->whereIn('status', ['dikirim', 'selesai'])
            ->pluck('id');

        // ambil order items terkait
        $orderItems = Order_Items::whereIn('order_id', $orders)->get();

        $totalProduk = $seller->products->count();

        $totalTerjual = $orderItems->sum('quantity');

        $totalPendapatan = $orderItems->sum(function ($item) {
            return $item->quantity * $item->price;
        });

        return response()->json([
            'id' => $seller->id,
            'name' => $seller->name,
            'email' => $seller->email,
            'foto' => $seller->foto,
            'total_produk' => $totalProduk,
            'total_terjual' => $totalTerjual,
            'total_pendapatan' => $totalPendapatan,
            'products' => $seller->products,
        ]);
    }
}
