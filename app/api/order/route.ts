import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    nama,
    whatsapp,
    jumlah_nasi,
    pedas_nasi,
    jumlah_tanpa,
    pedas_tanpa,
    keterangan,
    pengantaran,
    alamat,
    pembayaran,
  } = body;

  if (!nama || !whatsapp || !pengantaran || !pembayaran) {
    return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 });
  }

  const nasi = parseInt(jumlah_nasi || 0);
  const tanpa = parseInt(jumlah_tanpa || 0);

  if (nasi === 0 && tanpa === 0) {
    return NextResponse.json({ message: 'Minimal pesan 1 porsi' }, { status: 400 });
  }
  if (nasi > 0 && !pedas_nasi) {
    return NextResponse.json({ message: 'Level pedas nasi wajib dipilih' }, { status: 400 });
  }
  if (tanpa > 0 && !pedas_tanpa) {
    return NextResponse.json({ message: 'Level pedas tanpa nasi wajib dipilih' }, { status: 400 });
  }

  const total_harga = (nasi * 16000) + (tanpa * 14000);

  if (nasi + tanpa > 50) {
    return NextResponse.json({ message: 'Jumlah pesanan tidak wajar' }, { status: 400 });
  }

  const orderId = `order_${Date.now()}`;

  // Kirim ke GAS pakai URLSearchParams (terbukti berhasil untuk order baru)
  const params = new URLSearchParams({
    action: 'order_baru',
    nama,
    whatsapp,
    jumlah_nasi: String(nasi),
    pedas_nasi: pedas_nasi || '-',
    jumlah_tanpa: String(tanpa),
    pedas_tanpa: pedas_tanpa || '-',
    bukti_pembayaran: '-',
    total_porsi: String(nasi + tanpa),
    total_harga: String(total_harga),
    keterangan: keterangan || '-',
    pengantaran,
    alamat: alamat || '-',
    pembayaran,
    status: 'Baru',
    orderId,
  });

  try {
    const res = await fetch(process.env.GOOGLE_SCRIPT_URL!, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const text = await res.text();
    console.log('Response GAS order:', text);

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { success: false };
    }

    if (!result.success) {
      return NextResponse.json({ message: 'Gagal menyimpan order' }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderId });

  } catch (err) {
    console.error('Error kirim ke Google Script:', err);
    return NextResponse.json({ message: 'Server error, coba lagi' }, { status: 500 });
  }
}