<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Models\Order;
use App\Models\Order_Items;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // READ ALL ORDER
    public function index()
    {
        $orders = DB::table('orders')
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->join('users', 'users.id', '=', 'orders.customer_id')
            ->join('products', 'product.id', '=', 'order.product_id')
            ->select(
                'orders.id as order_id',
                'orders.status',
                'order_items.quantity',
                'products.name as product_name',
                'orders.total_price',
                'users.name'
            );
        return response()->json(
            $orders
        );
    }

    // CREATE ORDER
    public function store(Request $request)
    {
        $request->validate([
            'seller_id'        => 'required|integer',
            'category_id'      => 'required|integer',
            'image'            => 'nullable|string',
            'name'             => 'required|string',
            'stock'            => 'required|integer|min:0',
            'price'            => 'required|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'description'      => 'nullable|string',
        ]);

        $product = Products::create([
            'seller_id'        => $request->seller_id,
            'category_id'      => $request->category_id,
            'image'            => $request->image,
            'name'             => $request->name,
            'stock'            => $request->stock,
            'price'            => $request->price,
            'discount_percent' => $request->discount_percent,
            'description'      => $request->description,
        ]);

        return response()->json($product);
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
}
