<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class SellerController extends Controller
{
    // READ ALL SELLER
    public function index()
    {
        return response()->json(
            User::where('role_id', 2)->get()
        );
    }

    // CREATE SELLER
    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6'
        ]);

        $seller = User::create([
            'role_id'   => 2, // ROLE SELLER
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'is_active' => true,
            'is_online' => false
        ]);

        return response()->json($seller);
    }

    // UPDATE SELLER
    public function update(Request $request, $id)
    {
        $seller = User::where('role_id', 2)->findOrFail($id);

        $seller->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        return response()->json(['success' => true]);
    }

    // DELETE SELLER
    public function destroy($id)
    {
        User::where('role_id', 2)->findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}
