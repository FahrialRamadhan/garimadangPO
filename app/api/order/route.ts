import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    nama,
    whatsapp,
    jumlah_nasi,
    jumlah_tanpa,
    keterangan,
    pengantaran,
    alamat,
    pembayaran,
  } = body;

  // Validasi field wajib
  if (!nama || !whatsapp || !keterangan || !pengantaran || !pembayaran) {
    return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 });
  }

  const nasi = parseInt(jumlah_nasi || 0);
  const tanpa = parseInt(jumlah_tanpa || 0);

  if (nasi === 0 && tanpa === 0) {
    return NextResponse.json({ message: 'Minimal pesan 1 porsi' }, { status: 400 });
  }

  const total_harga = (nasi * 16000) + (tanpa * 14000);

  // Validasi jumlah wajar (max 50 porsi)
  if (nasi + tanpa > 50) {
    return NextResponse.json({ message: 'Jumlah pesanan tidak wajar' }, { status: 400 });
  }

  const data = {
    token: process.env.SECRET_TOKEN ?? '',       
    timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
    nama,
    whatsapp,
    jumlah_nasi: nasi,
    jumlah_tanpa: tanpa,
    total_porsi: nasi + tanpa,
    total_harga,
    keterangan,
    pengantaran,
    alamat: alamat || '-',
    pembayaran,
    status: 'Baru',
  };

  try {
    await fetch(process.env.GOOGLE_SCRIPT_URL!, {  
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(
        Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)]))
      ),
    });

    return NextResponse.json({ status: 'success' });
  } catch (err) {
    console.error('Error kirim ke Google Script:', err);
    return NextResponse.json({ message: 'Server error, coba lagi' }, { status: 500 });
  }
}