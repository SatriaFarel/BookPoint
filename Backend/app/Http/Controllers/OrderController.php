<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\Order;
use App\Models\Order_Items;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

class OrderController extends Controller
{
    // READ ALL ORDER 
    public function index(Request $request)
    {
        $customerId = $request->customer_id;

        if (!$customerId) {
            return response()->json([
                'message' => 'customer_id wajib dikirim'
            ], 400);
        }

        $orders = Order::with([
            'items.product.category',
            'seller:id,alamat'
        ])
            ->where('customer_id', $customerId)
            ->whereIn('status', [
                'diperiksa',
                'disetujui',
                'ditolak',
                'dikirim',
                'selesai'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(
            $orders->map(function ($order) {
                return [
                    'id'            => $order->id,
                    'status'        => $order->status,
                    'total_price'   => $order->total_price,
                    'seller_id'     => $order->seller_id,
                    'created_at'    => optional($order->created_at)->format('d M Y'),
                    'resi'          => $order->resi,

                    // TAMBAHAN UNTUK REFUND
                    'seller_address' => optional($order->seller)->alamat,
                    'refund_duration' => '3–5 hari kerja',

                    'items' => $order->items->map(function ($item) {
                        return [
                            'product_id' => $item->product_id,
                            'name'       => $item->product->name,
                            'category'   => optional($item->product->category)->name ?? '-',
                            'price'      => $item->price,
                            'quantity'   => $item->quantity,
                            'image'      => $item->product->image,
                        ];
                    })
                ];
            })
        );
    }


    // GET INVOICE ORDER
    public function invoice($id)
    {
        $order = Order::with([
            'items.product',
            'customer'
        ])->find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Order tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'id' => $order->id,
            'status' => $order->status,
            'total' => $order->total_price,
            'date' => optional($order->created_at)->format('d M Y'),
            'buyer' => [
                'name' => $order->customer->name,
            ],
            'items' => $order->items->map(function ($item) {
                return [
                    'name' => $item->product->name,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                ];
            }),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id'    => 'required|exists:users,id',
            'seller_id'      => 'required|exists:users,id',
            'payment_method' => 'required|in:transfer,qris',
            'items'          => 'required',
            'proof'          => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        DB::beginTransaction();

        try {
            $items = json_decode($request->items, true);
            if (!is_array($items) || count($items) === 0) {
                return response()->json(['message' => 'Item tidak valid'], 422);
            }

            $seller = User::findOrFail($request->seller_id);

            if ($request->payment_method === 'transfer' && !$seller->no_rekening) {
                throw new \Exception('Seller tidak menyediakan pembayaran transfer');
            }

            if ($request->payment_method === 'qris' && !$seller->qris) {
                throw new \Exception('Seller tidak menyediakan QRIS');
            }

            $proofPath = $request->file('proof')->store('payments', 'public');

            $order = Order::create([
                'customer_id'      => $request->customer_id,
                'seller_id'        => $request->seller_id,
                'status'           => 'diperiksa',
                'payment_method'   => $request->payment_method,
                'bukti_pembayaran' => $proofPath,
                'total_price'      => 0,
            ]);

            $total = 0;

            foreach ($items as $item) {
                $product = Products::lockForUpdate()->find($item['product_id']);

                if (!$product || $product->stock < $item['quantity']) {
                    throw new \Exception('Stok produk tidak mencukupi');
                }

                Order_Items::create([
                    'order_id'   => $order->id,
                    'product_id' => $product->id,
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                ]);

                $product->decrement('stock', $item['quantity']);
                $total += $item['price'] * $item['quantity'];
            }

            $order->update(['total_price' => $total]);

            DB::commit();

            return response()->json(['success' => true], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }



    // UPDATE ORDER
    public function update(Request $request, $id)
    {
        $product = Products::findOrFail($id);

        $request->validate([
            'category_id'      => 'sometimes|integer',
            'image'            => 'nullable|string',
            'name'             => 'sometimes|string',
            'stock'            => 'sometimes|integer|min:0',
            'price'            => 'sometimes|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'description'      => 'nullable|string',
        ]);

        $product->update($request->all());

        return response()->json(['success' => true]);
    }

    // DELETE ORDER
    public function destroy($id)
    {
        Products::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function sellerOrders($seller_id)
    {
        $orders = Order::query()
            ->where('seller_id', $seller_id)
            ->with(['customer', 'items.product'])
            ->latest()
            ->paginate(10);

        $orders->getCollection()->transform(function ($order) {

            return [
                'id' => $order->id,

                // ✅ WAJIB buat fitur chat
                'buyer_id' => $order->customer->id,
                'buyer_name' => $order->customer->name,

                'product_name' => $order->items
                    ->map(function ($item) {
                        return $item->product->name . ' (x' . $item->quantity . ')';
                    })
                    ->join(', '),

                'quantity' => $order->items->sum('quantity'),
                'total_price' => $order->total_price,
                'status' => $order->status,
                'proof' => $order->bukti_pembayaran,
                'resi' => $order->resi,
                'expedition' => $order->expedition,
            ];
        });

        return response()->json($orders);
    }



    public function approve($id)
    {
        $order = Order::findOrFail($id);

        $order->update([
            'status' => 'disetujui',
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Pesanan disetujui. Estimasi pengiriman 3 hari.'
        ]);
    }

    public function confirm($id)
    {
        $order = Order::findOrFail($id);

        $order->update([
            'status' => 'selesai',
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Pesanan selesai.'
        ]);
    }

    public function reject($id)
    {
        $order = Order::findOrFail($id);

        $order->update([
            'status' => 'ditolak',
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Pesanan ditolak. Refund maksimal 1 bulan.'
        ]);
    }

    public function autoUpdate()
    {
        Artisan::call('orders:auto-update');
        return response()->json(['status' => 'ok']);
    }
}
