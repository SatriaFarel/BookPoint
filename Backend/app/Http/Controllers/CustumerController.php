<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;


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
            'foto'     => 'required|image'
        ]);

        $foto = $request->file('foto')?->store('seller/foto', 'public');

        $customer = User::create([
            'role_id'   => 3, // ROLE CUSTOMER
            'nik'       => $request->nik,
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'alamat'    => $request->alamat,
            'foto'      => $foto,
            'is_active' => true,
            'is_online' => false
        ]);

        return response()->json($customer);
    }

   // UPDATE CUSTOMER
public function update(Request $request, $id)
{
    $customer = User::where('role_id', 3)->findOrFail($id);

    $request->validate([
        'nik'      => 'required|string|unique:users,nik,' . $customer->id,
        'name'     => 'required|string',
        'email'    => 'required|email|unique:users,email,' . $customer->id,
        'password' => 'nullable|min:6',
        'alamat'   => 'required|string',
        'foto'     => 'nullable|image'
    ]);

    // update data utama
    $customer->name   = $request->name;
    $customer->email  = $request->email;
    $customer->alamat = $request->alamat;
    $customer->nik    = $request->nik;

    // password opsional
    if ($request->filled('password')) {
        $customer->password = Hash::make($request->password);
    }

    // foto opsional
    if ($request->hasFile('foto')) {
        if ($customer->foto) {
            Storage::disk('public')->delete($customer->foto);
        }

        $customer->foto = $request->file('foto')
            ->store('profile', 'public');
    }

    $customer->save();

    return response()->json([
        'success' => true,
        'message' => 'Data customer berhasil diperbarui'
    ]);
}


    // DELETE CUSTOMER
    public function destroy($id)
    {
       $customer = User::where('role_id', 3)->findOrFail($id);

         // foto opsional
        if ($customer->foto && Storage::disk('public')->exists($customer->foto)) {
            Storage::disk('public')->delete($customer->foto);
        }

         $customer->delete();
        return response()->json(['success' => true]);
    }
}
