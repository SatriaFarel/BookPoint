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
        $request->validate([
            'nik'      => 'required|string|unique:users,nik',
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::create([
            'role_id'  => 3, // misal: 3 = customer
            'nik'      => $request->nik,
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'is_active' => true,
            'is_online' => false,
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
        $user = $request->user();

        if ($user) {
            $user->update(['is_online' => false]);
        }

        Auth::logout();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }
}
