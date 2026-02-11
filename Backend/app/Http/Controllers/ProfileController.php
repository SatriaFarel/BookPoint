<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

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
        try {
           $user = User::findOrFail($request->id);

            $rules = [
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $user->id,
            ];

            if (in_array($user->role_id, [2, 3])) {
            $rules['nik'] = 'required';
            $rules['alamat'] = 'required';
            }

            if ($user->role_id == 2) {
            $rules['no_rekening'] = 'required';
            }

            $request->validate($rules);

            /* ===== UPDATE DATA ===== */
            $user->name  = $request->name;
            $user->email = $request->email;

            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }

            if ($request->hasFile('foto')) {
                if ($user->foto) {
                    Storage::disk('public')->delete($user->foto);
                }
                $user->foto = $request->file('foto')->store('profile', 'public');
            }

            if ($user->role_id === 3) {
                $user->nik = $request->nik;
                $user->alamat = $request->alamat;
            }

            if ($user->role_id === 2) {
                $user->no_rekening = $request->no_rekening;

                if ($request->hasFile('qris')) {
                    if ($user->qris) {
                        Storage::disk('public')->delete($user->qris);
                    }
                    $user->qris = $request->file('qris')->store('qris', 'public');
                }
            }

            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Profil berhasil diperbarui',
                'user'    => $user
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('Update profile error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada server'
            ], 500);
        }
    }
}
