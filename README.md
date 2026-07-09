# Garimadang Pre Order

Aplikasi web pre-order untuk produk Garimadang. Sistem ini menangani pemesanan menu, perhitungan harga, pembayaran melalui QRIS, unggah bukti transfer, serta pencatatan data pesanan secara otomatis ke Google Spreadsheet.

## Deskripsi

Garimadang Pre Order dibangun menggunakan Next.js (App Router) dan berfungsi sebagai front-end sekaligus back-end ringan (melalui API Routes) untuk proses pre-order. Data pesanan diteruskan ke Google Apps Script yang berperan sebagai lapisan penyimpanan berbasis Google Spreadsheet, sementara bukti pembayaran disimpan di Google Drive.

## Fitur

- Form pemesanan menu "Nasi" dan "Tanpa Nasi" dengan pilihan level pedas
- Validasi input pada sisi server (minimal jumlah porsi, level pedas wajib, batas jumlah pesanan)
- Perhitungan total harga secara otomatis berdasarkan jenis dan jumlah menu
- Pembuatan QRIS dinamis sesuai nominal transaksi
- Unggah bukti pembayaran yang tersimpan langsung ke Google Drive
- Pencatatan pesanan otomatis ke Google Spreadsheet melalui Google Apps Script
- ID pesanan unik untuk setiap transaksi

## Teknologi

- Next.js 16 (App Router) dengan TypeScript
- React 19
- Tailwind CSS 4
- Axios untuk komunikasi HTTP
- Google Auth Library untuk autentikasi OAuth2
- Integrasi Google Drive API dan Google Apps Script sebagai backend penyimpanan data

## Struktur Proyek

```
garimadangPO/
├── app/
│   ├── page.tsx                    Halaman utama: menu, form pre-order, pembayaran
│   ├── layout.tsx                  Root layout aplikasi
│   ├── globals.css                 Styling global
│   ├── api/
│   │   ├── order/route.ts          Endpoint pencatatan pesanan ke Google Spreadsheet
│   │   ├── qris/route.ts           Endpoint pembuatan QRIS dinamis
│   │   └── upload-bukti/route.ts   Endpoint unggah bukti pembayaran ke Google Drive
│   └── services/
│       └── qrisService.js          Fungsi pendukung proses QRIS
├── public/                         Aset statis (logo, gambar produk, media promosi)
├── package.json
└── README.md
```

## Instalasi

1. Clone repository

   ```bash
   git clone https://github.com/FahrialRamadhan/garimadangPO.git
   cd garimadangPO
   ```

2. Instal dependensi

   ```bash
   npm install
   ```

3. Buat file `.env.local` di root proyek dan isi variabel berikut:

   ```env
   GOOGLE_SCRIPT_URL=
   QRIS_STATIC=
   GOOGLE_OAUTH_CLIENT_ID=
   GOOGLE_OAUTH_CLIENT_SECRET=
   GOOGLE_OAUTH_REFRESH_TOKEN=
   GOOGLE_DRIVE_FOLDER_ID=
   ```

   Keterangan:
   - `GOOGLE_SCRIPT_URL` — URL Web App Google Apps Script untuk mencatat pesanan ke Spreadsheet
   - `QRIS_STATIC` — string QRIS statis milik penerima pembayaran
   - `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REFRESH_TOKEN` — kredensial OAuth2 untuk mengunggah bukti pembayaran ke Google Drive
   - `GOOGLE_DRIVE_FOLDER_ID` — ID folder tujuan penyimpanan bukti pembayaran

4. Jalankan server pengembangan

   ```bash
   npm run dev
   ```

5. Akses aplikasi melalui browser

   ```
   http://localhost:3000
   ```

## Alur Sistem

1. Pengguna mengisi form pre-order (nama, nomor WhatsApp, menu, level pedas, jumlah, data pengantaran, metode pembayaran).
2. Data dikirim ke endpoint `/api/order`, kemudian diteruskan ke Google Apps Script dan tersimpan sebagai baris baru pada Google Spreadsheet dengan status "Baru".
3. Jika metode pembayaran adalah QRIS, endpoint `/api/qris` menghasilkan kode QR sesuai total harga pesanan.
4. Setelah transfer dilakukan, pengguna mengunggah bukti pembayaran melalui endpoint `/api/upload-bukti`, yang menyimpan berkas ke Google Drive dan memperbarui data pada Spreadsheet melalui Google Apps Script.

## Build dan Deployment

```bash
npm run build
npm run start
```

Disarankan melakukan deployment melalui Vercel. Pastikan seluruh environment variable telah dikonfigurasi pada dashboard hosting sebelum proses build.

## Kontribusi

1. Fork repository ini
2. Buat branch baru untuk perubahan yang diajukan (`git checkout -b nama-fitur`)
3. Commit perubahan dengan pesan yang jelas
4. Push branch ke repository hasil fork
5. Ajukan Pull Request

## Lisensi

Seluruh konten, desain, dan kode pada proyek ini dilindungi Hak Kekayaan Intelektual (HKI). Penyalinan, pendistribusian, atau penggunaan sebagian maupun seluruh bagian proyek ini tanpa izin tertulis dari pemilik tidak diperkenankan.

Hak Cipta © 2026 Garimadang. Seluruh hak dilindungi.

## Kontak

Instagram: @garimadang
