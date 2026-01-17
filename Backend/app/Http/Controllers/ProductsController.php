<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;

class ProductsController extends Controller
{
    // READ ALL PRODUCT
    public function index()
    {
        return response()->json(
            Products::all()
        );
    }

    // CREATE PRODUCT
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

    // UPDATE PRODUCT
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

    // DELETE PRODUCT
    public function destroy($id)
    {
        Products::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}
