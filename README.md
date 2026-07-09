# 🍚 Garimadang Pre Order

Website resmi **Pre-Order Garimadang** — aplikasi web untuk memesan menu Garimadang (nasi & tanpa nasi) secara online, lengkap dengan pemilihan level pedas, metode pembayaran QRIS, upload bukti transfer, dan pencatatan pesanan otomatis ke Google Spreadsheet.

## ✨ Fitur

- 🧾 **Form Pre-Order** — pesan menu "Nasi" dan/atau "Tanpa Nasi" dengan pilihan level pedas
- 🌶️ Validasi otomatis (minimal 1 porsi, level pedas wajib dipilih, batas jumlah pesanan wajar)
- 💰 Perhitungan total harga otomatis
- 📱 Input nomor WhatsApp & data pengantaran/alamat
- 💳 **Pembayaran QRIS dinamis** — QRIS otomatis dibuat sesuai nominal pesanan
- 📤 **Upload bukti pembayaran** langsung tersimpan ke Google Drive
- 🗂️ Data pesanan otomatis tercatat ke **Google Spreadsheet** melalui Google Apps Script (GAS)
- 🆔 ID pesanan unik untuk setiap transaksi (`order_<timestamp>`)

## 🛠️ Teknologi

- **Framework**: [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- **UI**: React 19, Tailwind CSS 4, [lucide-react](https://lucide.dev) (ikon), [recharts](https://recharts.org)
- **HTTP client**: axios
- **QRIS**: generate QR dinamis via layanan konversi QRIS (`qr.ireng.uk`) + library `qrcode`
- **Penyimpanan bukti pembayaran**: Google Drive API (OAuth2)
- **Database pesanan**: Google Spreadsheet via Google Apps Script (Web App)
- **Auth Google**: `google-auth-library`

## 📁 Struktur Folder

```
garimadangPO/
├── app/
│   ├── page.tsx              # Halaman utama: menu, form pre-order, pembayaran
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Styling global
│   ├── api/
│   │   ├── order/route.ts        # Endpoint POST: kirim data pesanan ke Google Sheet
│   │   ├── qris/route.ts         # Endpoint GET: generate QRIS dinamis sesuai nominal
│   │   └── upload-bukti/route.ts # Endpoint POST: upload bukti transfer ke Google Drive
│   └── services/
│       └── qrisService.js    # Helper untuk proses QRIS
├── public/                   # Gambar produk, logo, QRIS statis, video promosi
├── package.json
└── README.md
```

## 🚀 Instalasi & Menjalankan Project

1. Clone repository
   ```bash
   git clone https://github.com/FahrialRamadhan/garimadangPO.git
   cd garimadangPO
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Buat file `.env.local` di root project, isi dengan variabel berikut:
   ```env
   # URL Web App Google Apps Script (untuk mencatat pesanan ke Spreadsheet)
   GOOGLE_SCRIPT_URL=

   # String QRIS statis milik penerima pembayaran
   QRIS_STATIC=

   # Kredensial OAuth2 Google (untuk upload bukti transfer ke Google Drive)
   GOOGLE_OAUTH_CLIENT_ID=
   GOOGLE_OAUTH_CLIENT_SECRET=
   GOOGLE_OAUTH_REFRESH_TOKEN=

   # ID folder Google Drive tujuan upload bukti pembayaran
   GOOGLE_DRIVE_FOLDER_ID=
   ```

4. Jalankan project secara lokal
   ```bash
   npm run dev
   ```

5. Buka di browser
   ```
   http://localhost:3000
   ```

## 🔌 Alur Sistem Singkat

1. Pengguna mengisi form pre-order (nama, WhatsApp, menu, level pedas, jumlah, alamat/pengantaran, metode pembayaran).
2. Data pesanan dikirim ke `/api/order` → diteruskan ke Google Apps Script → tersimpan sebagai baris baru di Google Spreadsheet dengan status **"Baru"**.
3. Jika metode pembayaran QRIS, sistem memanggil `/api/qris` untuk membuat QR sesuai total harga.
4. Setelah transfer, pengguna mengunggah bukti pembayaran → dikirim ke `/api/upload-bukti` → file disimpan ke Google Drive dan URL-nya dicatat ke Spreadsheet melalui GAS.

## 📦 Build & Deploy

```bash
npm run build
npm run start
```

Direkomendasikan deploy melalui [Vercel](https://vercel.com), pastikan seluruh environment variable di atas sudah diatur di dashboard hosting.

## 🧑‍💻 Kontribusi

1. Fork repository ini
2. Buat branch baru (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m "Menambahkan fitur X"`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## 📄 Lisensi

Seluruh konten, desain, dan kode dalam project ini telah dilindungi **Hak Kekayaan Intelektual (HKI)**. Dilarang menyalin, mendistribusikan, atau menggunakan sebagian maupun seluruh isi project ini tanpa izin tertulis dari pemilik.

© 2026 Garimadang. All Rights Reserved.

## 📞 Kontak

- Instagram: @garimadang
