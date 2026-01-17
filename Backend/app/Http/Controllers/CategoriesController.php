<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Illuminate\Http\Request;

class CategoriesController extends Controller
{
    /**
     * READ ALL CATEGORIES
     */
    public function index()
    {
        return response()->json(
            Categories::orderBy('id', 'desc')->get()
        );
    }

    /**
     * CREATE CATEGORY
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100|unique:categories,name'
        ]);

        $category = Categories::create([
            'name' => $request->name
        ]);

        return response()->json($category, 201);
    }

    /**
     * UPDATE CATEGORY
     */
    public function update(Request $request, $id)
    {
        $category = Categories::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:100|unique:categories,name,' . $id
        ]);

        $category->update([
            'name' => $request->name
        ]);

        return response()->json($category);
    }

    /**
     * DELETE CATEGORY
     */
    public function destroy($id)
    {
        $category = Categories::findOrFail($id);
        $category->delete();

        return response()->json(['success' => true]);
    }
}
