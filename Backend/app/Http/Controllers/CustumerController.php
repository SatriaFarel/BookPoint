<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CustumerController extends Controller
{
    // READ ALL CUSTOMER
    public function index()
    {
        return response()->json(
            User::where('role_id', 3)->get()
        );
    }

    // CREATE CUSTOMER
    public function store(Request $request)
    {
        $request->validate([
            'nik'      => 'required|string|unique:users,nik',
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'alamat'   => 'required|string',
        ]);

        $customer = User::create([
            'role_id'   => 3, // ROLE CUSTOMER
            'nik'       => $request->nik,
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'alamat'    => $request->alamat,
            'is_active' => true,
            'is_online' => false
        ]);

        return response()->json($customer);
    }

    // UPDATE CUSTOMER
    public function update(Request $request, $id)
    {
        $customer = User::where('role_id', 3)->findOrFail($id);

        $customer->update([
            'name' => $request->name,
            'email' => $request->email,
            'alamat' => $request->alamat,
            
        ]);

        return response()->json(['success' => true]);
    }

    // DELETE CUSTOMER
    public function destroy($id)
    {
        User::where('role_id', 3)->findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}
