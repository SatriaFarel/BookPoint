<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        /* ================= ROLES ================= */
        DB::table('roles')->insert([
            ['id' => 1, 'role' => 'super_admin'],
            ['id' => 2, 'role' => 'seller'],
            ['id' => 3, 'role' => 'customer'],
        ]);

        /* ================= USERS ================= */
        DB::table('users')->insert([
            [
                'nik' => '1111111111111111',
                'name' => 'Super Admin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('password'),
                'role_id' => 1,
                'alamat' => 'Jakarta',
                'foto' => 'profile/pfp.jpeg',
                'no_rekening' => null,
                'qris' => null,
                'is_active' => 1,
                'is_online' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nik' => '2222222222222222',
                'name' => 'Seller Buku',
                'email' => 'seller@gmail.com',
                'password' => Hash::make('password'),
                'role_id' => 2,
                'alamat' => 'Bandung',
                'foto' => 'profile/pfp.jpeg',
                'no_rekening' => '1234567890',
                'qris' => null,
                'is_active' => 1,
                'is_online' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nik' => '3333333333333333',
                'name' => 'Customer Satu',
                'email' => 'customer@gmail.com',
                'password' => Hash::make('password'),
                'role_id' => 3,
                'alamat' => 'Surabaya',
                'foto' => 'profile/pfp.jpeg',
                'no_rekening' => null,
                'qris' => null,
                'is_active' => 1,
                'is_online' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);


        /* ================= CATEGORIES ================= */
        DB::table('categories')->insert([
            [
                'id'         => 1,
                'name'       => 'Buku Pemrograman',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => 2,
                'name'       => 'Novel',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id'         => 3,
                'name'       => 'Alat Tulis',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        /* ================= PRODUCTS ================= */
        DB::table('products')->insert([
            [
                'seller_id'   => 2, // ID user seller
                'category_id' => 1,
                'image'       => 'products/placeholder.webp',
                'name'        => 'Buku Laravel Dasar',
                'stock'       => 50,
                'price'       => 75000,
                'discount_percent' => 10,
                'description' => 'Buku pembelajaran Laravel untuk pemula',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'seller_id'   => 2,
                'category_id' => 1,
                'image'       => 'products/placeholder.webp',
                'name'        => 'Buku React Modern',
                'stock'       => 30,
                'price'       => 90000,
                'discount_percent' => 15,
                'description' => 'Panduan React modern dengan hooks',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);
    }
}
