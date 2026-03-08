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
                'foto' => 'profile/profile.jpg',
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
                'foto' => 'profile/profile1.jpg',
                'no_rekening' => '1234567890',
                'qris' => null,
                'is_active' => 1,
                'is_online' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nik' => '2222222222222223',
                'name' => 'Seller Buku Dua',
                'email' => 'nurhayatulfadila@gmail.com',
                'password' => Hash::make('password'),
                'role_id' => 2,
                'alamat' => 'Bandung',
                'foto' => 'profile/profile2.jpg',
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
                'foto' => 'profile/profile3.jpg',
                'no_rekening' => null,
                'qris' => null,
                'is_active' => 1,
                'is_online' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nik' => '4444444444444444',
                'name' => 'Customer Dua',
                'email' => 'satriafarel40@gmail.com',
                'password' => Hash::make('password'),
                'role_id' => 3,
                'alamat' => 'Semarang',
                'foto' => 'profile/profile4.jpg',
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
                'seller_id'   => 2,
                'category_id' => 1,
                'image'       => 'products/placeholder.png',
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
                'category_id' => 2,
                'image'       => 'products/placeholder1.png',
                'name'        => 'Buku Novel Aksi',
                'stock'       => 50,
                'price'       => 75000,
                'discount_percent' => 10,
                'description' => 'Buku novel aksi yang seru dan mendebarkan',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'seller_id'   => 3,
                'category_id' => 2,
                'image'       => 'products/placeholder2.png',
                'name'        => 'Buku Novel Romantis',
                'stock'       => 30,
                'price'       => 90000,
                'discount_percent' => 15,
                'description' => 'Novel romantis yang menghibur',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'seller_id'   => 3,
                'category_id' => 1,
                'image'       => 'products/placeholder3.png',
                'name'        => 'Buku React Modern',
                'stock'       => 30,
                'price'       => 90000,
                'discount_percent' => 15,
                'description' => 'Panduan React modern dengan hooks',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);

        /* ================= ORDERS ================= */
        DB::table('orders')->insert([
            [
                'seller_id'        => 2,
                'customer_id'      => 4,
                'total_price'      => 67500,
                'status'           => 'diperiksa',
                'expedition'       => null,
                'resi'             => null,
                'payment_method'   => 'transfer',
                'bukti_pembayaran' => 'payments/sample.jpg',
                'created_at'       => now(),
                'updated_at'       => now(),
            ],
            [
                'seller_id'        => 2,
                'customer_id'      => 4,
                'total_price'      => 76500,
                'status'           => 'selesai',
                'expedition'       => null,
                'resi'             => null,
                'payment_method'   => 'transfer',
                'bukti_pembayaran' => 'payments/sample.jpg',
                'created_at'       => now(),
                'updated_at'       => now(),
            ],
            [
                'seller_id'        => 2,
                'customer_id'      => 5,
                'total_price'      => 67500,
                'status'           => 'ditolak',
                'expedition'       => null,
                'resi'             => null,
                'payment_method'   => 'transfer',
                'bukti_pembayaran' => 'payments/sample.jpg',
                'created_at'       => now(),
                'updated_at'       => now(),
            ],
            [
                'seller_id'        => 2,
                'customer_id'      => 5,
                'total_price'      => 76500,
                'status'           => 'dikirim',
                'expedition'       => 'JNE',
                'resi'             => '1234567890',
                'payment_method'   => 'transfer',
                'bukti_pembayaran' => 'payments/sample.jpg',
                'created_at'       => now(),
                'updated_at'       => now(),
            ],
        ]);


        /* ================= ORDER ITEMS ================= */
        DB::table('order_items')->insert([
            [
                'order_id'   => 1, // pastikan ID order sesuai
                'product_id' => 1,
                'quantity'   => 1,
                'price'      => 67500,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
