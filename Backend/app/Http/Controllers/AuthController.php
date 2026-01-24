<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * SIGN UP / REGISTER
     */
    public function register(Request $request)
    {
        // ===== VALIDASI DASAR =====
        $request->validate([
            'role'     => 'required|in:customer,seller',
            'nik'      => 'required|string|unique:users,nik',
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users,email',
            'alamat'   => 'required|string|max:255',
            'password' => 'required|min:6|confirmed',
            'foto'     => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // ===== VALIDASI KHUSUS SELLER =====
        if ($request->role === 'seller') {
            $request->validate([
                'no_rekening' => 'required|string',
                'qris_image'  => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);
        }

        // ===== TENTUKAN ROLE ID =====
        $roleId = $request->role === 'seller' ? 2 : 3;

        // ===== UPLOAD QRIS (OPTIONAL) =====
        $qrisPath = null;
        if ($request->hasFile('qris_image')) {
            $qrisPath = $request->file('qris_image')
                ->store('qris', 'public');
        }

        // ==== UPLOAD FOTO PROFIL =====
        $fotoPath = $request->file('foto')
            ->store('profile', 'public');

        // ===== CREATE USER =====
        $user = User::create([
            'role_id'     => $roleId,
            'nik'         => $request->nik,
            'name'        => $request->name,
            'email'       => $request->email,
            'password'    => Hash::make($request->password),
            'foto'        => $fotoPath,
            'alamat'      => $request->alamat,
            'no_rekening' => $request->role === 'seller'
                ? $request->no_rekening
                : null,
            'qris'  => $qrisPath,
            'is_active'   => true,
            'is_online'   => false,
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil',
            'user'    => $user,
        ], 201);
    }

    /**
     * SIGN IN / LOGIN
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }

        $user = Auth::user();

        if (!$user->is_active) {
            Auth::logout();
            return response()->json([
                'message' => 'Akun tidak aktif'
            ], 403);
        }

        $user->update(['is_online' => true]);

        return response()->json([
            'message' => 'Login berhasil',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => match ($user->role_id) {
                    1 => 'SUPER_ADMIN',
                    2 => 'SELLER',
                    3 => 'CUSTOMER',
                    default => 'CUSTOMER',
                },
            ],
        ]);
    }

    /**
     * LOGOUT
     */

    public function logout(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:users,id',
        ]);

        User::where('id', $request->id)
            ->update(['is_online' => 0]);

        return response()->json([
            'message' => 'Logout sukses'
        ]);
    }
}
