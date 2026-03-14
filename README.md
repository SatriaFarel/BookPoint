# 📚 BookPoint

**BookPoint** adalah aplikasi marketplace buku berbasis web yang memungkinkan penjual dan pembeli melakukan transaksi buku secara online.
Sistem ini dibangun menggunakan **React sebagai frontend** dan **Laravel sebagai backend API**, dengan desain antarmuka menggunakan **Tailwind CSS**.

---

## ✨ Fitur Utama

* Sistem marketplace buku
* Manajemen produk oleh seller
* Sistem transaksi antara seller dan customer
* Fitur chat antara seller dan customer
* Dashboard admin untuk pengelolaan sistem
* Sistem laporan transaksi

---

## 👥 Role Sistem

### 👑 Admin

Admin bertugas mengelola sistem utama.

Fitur:

* Mengelola data **seller**
* Mengelola data **customer**
* Mengelola **kategori buku**

---

### 🛒 Seller

Seller merupakan penjual yang menawarkan produk buku di platform.

Fitur:

* Mengelola **produk buku**
* Mengelola **transaksi penjualan**
* Melihat **laporan penjualan**
* **Chat dengan customer**

---

### 👤 Customer (Buyer)

Customer adalah pengguna yang membeli buku.

Fitur:

* Melihat daftar produk buku
* Melakukan **transaksi pembelian**
* **Chat dengan seller**

---

## 🛠 Teknologi

Project ini dibuat menggunakan:

* **React.js**
* **Laravel**
* **Tailwind CSS**
* **MySQL**
* **JavaScript**

---

## 🚀 Cara Menjalankan Project

### Backend (Laravel)

Clone repository:

```
git clone https://github.com/SatriaFarel/BookPoint.git
```

Masuk ke folder backend:

```
cd backend
```

Install dependency:

```
composer install
```

Copy file environment:

```
cp .env.example .env
```

Generate application key:

```
php artisan key:generate
```

Jalankan migration database:

```
php artisan migrate
```

Jalankan server Laravel:

```
php artisan serve
```

---

### Frontend (React)

Masuk ke folder frontend:

```
cd frontend
```

Install dependency:

```
npm install
```

Jalankan aplikasi:

```
npm run dev
```

---

## 🎯 Tujuan Project

Project ini dibuat untuk mempelajari:

* Integrasi **React dan Laravel**
* Sistem **multi-role marketplace**
* Manajemen produk dan transaksi
* Komunikasi antara penjual dan pembeli

---

## 👨‍💻 Author

**Satria Farel (Kishi)**
*Student & Web Developer*
