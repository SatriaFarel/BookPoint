<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /* ===== GET PROFILE ===== */
    public function show($id)
    {
        $user = User::findOrFail($id);

        return response()->json([
            'user' => $user
        ]);
    }

    /* ===== UPDATE PROFILE ===== */
    public function update(Request $request)
    {
        $user = User::findOrFail($request->id);

        /* ===== VALIDASI DASAR ===== */
        $rules = [
            'name'  => 'required',
            'email' => 'required|email',
        ];

        if ($user->role !== 'SUPER_ADMIN') {
            $rules['nik'] = 'required';
            $rules['alamat'] = 'required';
        }

        if ($user->role === 'SELLER') {
            $rules['no_rekening'] = 'required';
        }

        $request->validate($rules);

        /* ===== UPDATE DATA ===== */
        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        if ($request->hasFile('foto')) {
            $user->foto = $request->file('foto')->store('profile', 'public');
        }

        if ($user->role !== 'SUPER_ADMIN') {
            $user->nik = $request->nik;
            $user->alamat = $request->alamat;
        }

        if ($user->role === 'SELLER') {
            $user->no_rekening = $request->no_rekening;

            if ($request->hasFile('qris')) {
                $user->qris = $request->file('qris')->store('qris', 'public');
            }
        }

        $user->save();

        return response()->json([
            'user' => $user
        ]);
    }
}
