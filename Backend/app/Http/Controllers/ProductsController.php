<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductsController extends Controller
{
    // READ ALL PRODUCT
    public function index(Request $request)
    {
        $sellerId = $request->seller_id;

        if (!$sellerId) {
            return response()->json(Products::all());
        } else{
            return response()->json(Products::where('seller_id', $sellerId)->get());
        }
    }

    // CREATE PRODUCT
    public function store(Request $request)
    {
        $request->validate([
            'seller_id'        => 'required|integer|exists:users,id',
            'category_id'      => 'required|integer|exists:categories,id',
            'image'            => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'name'             => 'required|string|max:255',
            'stock'            => 'required|integer|min:0',
            'price'            => 'required|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'description'      => 'nullable|string',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product = Products::create([
            'seller_id'        => $request->seller_id, // ✅ dari frontend
            'category_id'      => $request->category_id,
            'image'            => $imagePath,
            'name'             => $request->name,
            'stock'            => $request->stock,
            'price'            => $request->price,
            'discount_percent' => $request->discount_percent,
            'description'      => $request->description,
        ]);

        return response()->json($product, 201);
    }


    // UPDATE PRODUCT
    public function update(Request $request, $id)
    {
        $product = Products::findOrFail($id);

        $request->validate([
            'category_id'      => 'sometimes|integer|exists:categories,id',
            'image'            => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'name'             => 'sometimes|string|max:255',
            'stock'            => 'sometimes|integer|min:0',
            'price'            => 'sometimes|numeric|min:0',
            'discount_percent' => 'nullable|integer|min:0|max:100',
            'description'      => 'nullable|string',
        ]);

        // kalau upload image baru
        if ($request->hasFile('image')) {
            // hapus image lama (kalau ada)
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }

            $product->image = $request->file('image')->store('products', 'public');
        }

        // update field lain (AMAN, bukan all())
        $product->update($request->only([
            'category_id',
            'name',
            'stock',
            'price',
            'discount_percent',
            'description',
        ]));

        return response()->json([
            'message' => 'Produk berhasil diperbarui',
            'data'    => $product
        ]);
    }

    // DELETE PRODUCT
    public function destroy($id)
    {
        $product = Products::findOrFail($id);

        // hapus image kalau ada
        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus'
        ]);
    }
}
