# Kasbon App

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Aplikasi manajemen hutang piutang pribadi yang modern, dirancang untuk membantu pengguna melacak, mengelola, dan memantau catatan keuangan pribadi dengan mudah dan efisien.

## Live Demo

- **Repository**: `https://github.com/ibnusetiawan22/Kasbon-App`
- **Demo**: `https://kasbon-app-demo.vercel.app/` (placeholder)

## Ikhtisar Proyek

Kasbon App adalah aplikasi web yang dibangun menggunakan Next.js dan Supabase untuk memfasilitasi pencatatan hutang dan piutang. Aplikasi ini dirancang dengan fokus pada pengalaman pengguna yang bersih, fungsionalitas yang relevan, dan keamanan data yang terjamin. Pengguna dapat dengan cepat melihat ringkasan keuangan, mencari catatan spesifik, dan mengelola semua transaksi dalam satu dasbor terpusat.

## Fitur Unggulan

- **Manajemen Kasbon (CRUD)**: Fungsi penuh untuk membuat, membaca, memperbarui, dan menghapus catatan kasbon.
- **Dasbor Interaktif**: Ringkasan visual total hutang, total piutang, dan *net balance*.
- **Pencarian Cerdas**: Pencarian *real-time* berdasarkan nama rekanan atau isi catatan.
- **Filter & Urutan Data**:
    - Filter berdasarkan **status** (Lunas, Belum Lunas, Semua).
    - Filter berdasarkan **tipe** (Hutang Saya, Piutang Saya, Semua).
    - Urutkan berdasarkan **tanggal** (terbaru, terlama) atau **nominal** (tertinggi, terendah).
- **Format Data Lokal**:
    - **Mata Uang**: Format Rupiah (Rp) sesuai standar `id-ID`.
    - **Waktu Relatif**: Tampilan waktu yang mudah dipahami (contoh: *1 jam lalu*, *kemarin*).
- **Manajemen Status**: Kemampuan untuk menandai kasbon sebagai "Lunas" dengan satu klik.
- **UI State Management**:
    - **Empty State**: Tampilan informatif saat tidak ada data kasbon.
    - **Loading State**: Indikator visual saat data sedang dimuat atau diproses.
    - **Error State**: Pesan kesalahan yang jelas jika terjadi kegagalan.
- **Desain Responsif**: Antarmuka yang dioptimalkan untuk desktop, tablet, dan mobile.
- **Autentikasi Aman**: Sistem login berbasis Supabase Auth untuk melindungi data pengguna.

## Arsitektur Aplikasi

Aplikasi ini mengadopsi arsitektur berlapis (*layered architecture*) untuk memisahkan tanggung jawab (*separation of concerns*) dan meningkatkan modularitas.

```
Client (Next.js - React Server Components & Client Components)
 │
 └───> API Route (Route Handlers)
        │
        └───> Service Layer
               │
               └───> Repository Layer
                      │
                      └───> Supabase (PostgreSQL)
```

- **Client**: Komponen antarmuka pengguna yang dibangun dengan Next.js. Bertanggung jawab untuk presentasi data dan interaksi pengguna.
- **API Route**: *Endpoint* yang menangani permintaan dari klien. Berfungsi sebagai jembatan antara *frontend* dan logika bisnis di *backend*.
- **Service Layer**: Berisi logika bisnis inti aplikasi. Mengorkestrasi data dari berbagai sumber dan menerapkan aturan bisnis sebelum mengirimkannya ke klien.
- **Repository Layer**: Abstraksi untuk akses data. Bertanggung jawab untuk berkomunikasi langsung dengan database (Supabase), mengisolasi logika query dari *service layer*.

## Keputusan Teknis (Technical Decisions)

- **Next.js App Router**: Dipilih karena kemampuannya dalam *server-side rendering* (SSR) dan *React Server Components* (RSC), yang meningkatkan performa SEO dan kecepatan *load* awal. Arsitektur berbasis *file-system routing* juga menyederhanakan pengembangan.
- **Supabase**: Digunakan sebagai solusi *Backend-as-a-Service* (BaaS) yang lengkap. Supabase menyediakan database PostgreSQL, autentikasi, dan API instan dalam satu platform, sehingga mempercepat proses pengembangan tanpa mengorbankan skalabilitas.
- **Repository Pattern**: Pola desain ini diterapkan untuk memisahkan logika akses data dari logika bisnis. Ini membuat kode lebih bersih, lebih mudah diuji (*testable*), dan memungkinkan penggantian sumber data di masa depan tanpa mengubah *service layer*.
- **Row Level Security (RLS)**: Fitur keamanan utama dari PostgreSQL yang diaktifkan di Supabase. RLS memastikan bahwa setiap pengguna hanya dapat mengakses dan memanipulasi data miliknya sendiri, bahkan jika mereka mencoba memanggil API secara langsung. Ini memberikan lapisan keamanan data yang kuat di tingkat database.

## Keamanan

- **Penyimpanan Data**: Semua data aplikasi, termasuk informasi pengguna dan catatan kasbon, disimpan dengan aman di Supabase.
- **Isolasi Data**: **Row Level Security (RLS)** diaktifkan secara default. Kebijakan ini memastikan bahwa setiap query ke database secara otomatis difilter berdasarkan `user_id` dari pengguna yang terautentikasi.
- **Akses Terbatas**: Pengguna dijamin hanya dapat melihat, mengubah, atau menghapus data yang mereka buat. Upaya akses data milik pengguna lain akan digagalkan di tingkat database.
- **Keamanan Endpoint**: Karena RLS, semua *endpoint* API tetap aman. Panggilan langsung ke API (misalnya, menggunakan cURL atau Postman) tanpa token autentikasi yang valid atau dengan token milik pengguna lain tidak akan dapat mengambil data yang tidak sah.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Backend & Database**: [Supabase](https://supabase.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Validasi Skema**: [Zod](https://zod.dev/)
- **Ikon**: [Lucide React](https://lucide.dev/)

## Setup Lokal

1.  **Clone Repositori**
    ```bash
    git clone https://github.com/ibnusetiawan22/Kasbon-App.git
    cd Kasbon-App
    ```

2.  **Install Dependensi**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment Variables**
    Buat file `.env.local` di direktori root dan salin konten dari `.env.example`. Isi variabel sesuai dengan kredensial proyek Supabase Anda.
    ```env
    NEXT_PUBLIC_SUPABASE_URL="https://<project_ref>.supabase.co"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="<your_anon_key>"
    ```

4.  **Jalankan Aplikasi**
    ```bash
    npm run dev
    ```
    Aplikasi akan tersedia di `http://localhost:3000`.

## Screenshots

*(Bagian ini dapat diisi dengan screenshot aplikasi setelah tersedia)*

## Rencana Pengembangan (Future Improvements)

- **Dasbor Analitik**: Visualisasi data kasbon dalam bentuk grafik untuk melacak tren pengeluaran dan pemasukan.
- **Ekspor ke PDF**: Fitur untuk mengunduh ringkasan atau detail kasbon dalam format PDF.
- **Pengingat Jatuh Tempo**: Notifikasi (email atau *push notification*) saat tanggal jatuh tempo mendekat.
- **Grup Kasbon**: Mengelompokkan semua transaksi yang terkait dengan satu orang dalam satu tampilan detail.
- **Peningkatan UX Mobile**: Optimasi lebih lanjut pada alur dan interaksi pengguna di perangkat mobile.