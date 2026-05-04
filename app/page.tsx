'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [jumlahNasi, setJumlahNasi] = useState(0);
  const [jumlahTanpa, setJumlahTanpa] = useState(0);
  const [checkNasi, setCheckNasi] = useState(false);
  const [checkTanpa, setCheckTanpa] = useState(false);
  const [pengantaran, setPengantaran] = useState('');
  const [pembayaran, setPembayaran] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMetode, setModalMetode] = useState('');
  const [showToast, setShowToast] = useState(false);

  const totalHarga = (jumlahNasi * 16000) + (jumlahTanpa * 14000);
  const totalPorsi = jumlahNasi + jumlahTanpa;
  const showSummary = totalPorsi > 0;

  function handleToast() {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    if (jumlahNasi === 0 && jumlahTanpa === 0) {
      alert('Minimal pesan 1 porsi!');
      return;
    }

    setLoading(true);

    const data = {
      nama: fd.get('nama'),
      whatsapp: fd.get('whatsapp'),
      jumlah_nasi: jumlahNasi,
      jumlah_tanpa: jumlahTanpa,
      total_porsi: totalPorsi,
      total_harga: totalHarga,
      keterangan: fd.get('keterangan'),
      pengantaran: fd.get('pengantaran'),
      alamat: fd.get('alamat') || '-',
      pembayaran: fd.get('pembayaran'),
      status: 'Baru',
    };

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || 'Terjadi kesalahan!');
        return;
      }

      handleToast();
      setModalMetode(data.pembayaran as string);
      setShowModal(true);

      form.reset();
      setCheckNasi(false);
      setCheckTanpa(false);
      setJumlahNasi(0);
      setJumlahTanpa(0);
      setPengantaran('');
      setPembayaran('');
    } catch (err) {
      alert('Terjadi kesalahan koneksi!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        :root {
          --orange-1: #FF6A00;
          --orange-2: #FF8A1E;
          --orange-3: #FFB347;
          --orange-deep: #C03A00;
          --cream: #FFF6E9;
          --ink: #2A1300;
          --red-stamp: #E63946;
          --green: #2BB673;
          --shadow: 0 14px 30px -10px rgba(192,58,0,.35);
        }
        *{box-sizing:border-box;}
        html,body{margin:0;padding:0;}
        body{
          font-family:'Plus Jakarta Sans',sans-serif;
          background:
            radial-gradient(1200px 600px at 80% -10%,#FFD89A 0%,transparent 60%),
            radial-gradient(900px 500px at -10% 30%,#FFB36B 0%,transparent 55%),
            linear-gradient(180deg,#FFE4C2 0%,#FFB677 40%,#FF7A1A 100%);
          min-height:100vh;
          color:var(--ink);
          overflow-x:hidden;
        }
        body::before{
          content:"";position:fixed;inset:0;
          background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.25 0 0 0 0 0 0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
          pointer-events:none;opacity:.7;mix-blend-mode:multiply;z-index:0;
        }
        .nav{position:relative;z-index:5;display:flex;justify-content:space-between;align-items:center;padding:22px 6vw;}
        .logo{display:flex;align-items:center;gap:12px;font-family:'Bowlby One',sans-serif;color:var(--ink);text-decoration:none;}
        .logo-img{width:64px;height:64px;border-radius:50%;object-fit:cover;border:3px solid #fff;box-shadow:0 6px 14px rgba(0,0,0,.18);transform:rotate(-6deg);transition:transform .2s ease;}
        .logo:hover .logo-img{transform:rotate(0deg) scale(1.05);}
        .logo-text{font-size:22px;letter-spacing:.5px;}
        .nav-links{display:flex;gap:28px;font-weight:600;}
        .nav-links a{color:var(--ink);text-decoration:none;position:relative;}
        .nav-links a:hover::after{content:"";position:absolute;left:0;right:0;bottom:-6px;height:3px;background:var(--ink);border-radius:2px;}
        @media(max-width:720px){.nav-links{display:none;}}
        .hero{position:relative;z-index:2;padding:30px 6vw 60px;display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center;}
        @media(max-width:900px){.hero{grid-template-columns:1fr;padding-bottom:30px;}}
        .tag{display:inline-flex;align-items:center;gap:8px;background:#fff;color:var(--orange-deep);padding:8px 16px;border-radius:999px;font-weight:700;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;box-shadow:var(--shadow);}
        .tag .dot{width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 0 4px rgba(43,182,115,.25);animation:pulse 1.6s infinite;}
        @keyframes pulse{50%{box-shadow:0 0 0 8px rgba(43,182,115,0);}}
        h1{font-family:'Bowlby One',sans-serif;font-size:clamp(48px,8vw,110px);line-height:.92;margin:18px 0 14px;color:#fff;text-shadow:0 6px 0 var(--orange-deep),0 14px 30px rgba(192,58,0,.35);letter-spacing:-1px;}
        h1 .em{color:#FFE27A;}
        .hero-sub{font-size:18px;max-width:480px;line-height:1.5;color:#4a1f02;font-weight:500;}
        .scribble{font-family:'Caveat',cursive;font-size:28px;color:var(--orange-deep);transform:rotate(-3deg);display:inline-block;margin-top:6px;}
        .cta-row{display:flex;gap:14px;margin-top:26px;flex-wrap:wrap;}
        .btn{display:inline-flex;align-items:center;gap:10px;padding:16px 26px;border-radius:999px;font-weight:800;font-size:15px;letter-spacing:.3px;text-decoration:none;cursor:pointer;border:none;transition:transform .15s ease,box-shadow .15s ease;}
        .btn-primary{background:var(--ink);color:#FFE27A;box-shadow:6px 6px 0 #fff;}
        .btn-primary:hover{transform:translate(-2px,-2px);box-shadow:8px 8px 0 #fff;}
        .btn-ghost{background:#fff;color:var(--ink);box-shadow:var(--shadow);}
        .btn-ghost:hover{transform:translateY(-2px);}
        .hero-card{position:relative;aspect-ratio:4/5;max-width:420px;margin-left:auto;}
        .poster-frame{width:100%;height:100%;border-radius:24px;background:#fff;box-shadow:14px 14px 0 var(--ink),0 30px 60px -20px rgba(70,20,0,.45);transform:rotate(2deg);transition:transform .3s ease;overflow:hidden;border:4px solid #fff;animation:float 6s ease-in-out infinite;}
        .poster-frame:hover{transform:rotate(0deg) scale(1.02);}
        .poster-frame img{width:100%;height:100%;object-fit:cover;display:block;}
        @keyframes float{50%{transform:rotate(2deg) translateY(-10px);}}
        .stamp{position:absolute;right:-20px;top:-16px;background:var(--red-stamp);color:#fff;font-family:'Bowlby One',sans-serif;padding:16px 20px;border-radius:18px;transform:rotate(8deg);box-shadow:var(--shadow);border:3px dashed #fff;line-height:1;text-align:center;z-index:3;}
        .stamp small{display:block;font-size:11px;letter-spacing:2px;margin-bottom:4px;}
        .stamp big{font-size:22px;}
        .ribbon{position:absolute;left:-20px;bottom:12%;background:var(--ink);color:#FFE27A;padding:10px 16px;border-radius:6px;font-weight:800;font-size:13px;transform:rotate(-6deg);z-index:3;box-shadow:4px 4px 0 var(--orange-deep);}
        .menu-sec{position:relative;z-index:2;padding:60px 6vw;background:var(--cream);border-radius:50px 50px 0 0;margin-top:40px;}
        .section-head{display:flex;justify-content:space-between;align-items:end;flex-wrap:wrap;gap:16px;margin-bottom:36px;}
        .section-head h2{font-family:'Bowlby One',sans-serif;font-size:clamp(34px,5vw,56px);margin:0;color:var(--ink);line-height:1;}
        .section-head .lead{max-width:380px;color:#6e3b13;font-weight:500;}
        .menu-grid{display:grid;gap:24px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));}
        .menu-card{background:#fff;border-radius:28px;padding:28px;border:2px solid var(--ink);box-shadow:8px 8px 0 var(--ink);position:relative;overflow:hidden;transition:transform .2s ease;}
        .menu-card:hover{transform:translate(-4px,-4px);box-shadow:12px 12px 0 var(--ink);}
        .menu-card .price-tag{position:absolute;top:18px;right:-8px;background:var(--orange-1);color:#fff;font-family:'Bowlby One',sans-serif;padding:8px 16px;transform:rotate(4deg);box-shadow:0 4px 0 var(--orange-deep);}
        .menu-card h3{font-family:'Bowlby One',sans-serif;font-size:28px;margin:12px 0 6px;}
        .menu-card p{margin:0 0 16px;color:#6e3b13;}
        .menu-card .meta{display:inline-block;background:#FFE9C7;color:var(--orange-deep);padding:6px 12px;border-radius:999px;font-size:12px;font-weight:700;}
        .menu-card .visual{width:100%;aspect-ratio:16/10;border-radius:18px;margin-bottom:18px;overflow:hidden;border:2px dashed var(--orange-deep);}
        .menu-card .visual img{width:100%;height:100%;object-fit:cover;border-radius:16px;}
        .order-sec{position:relative;z-index:2;background:var(--ink);color:#fff;padding:80px 6vw;}
        .order-sec::before{content:"";position:absolute;top:-1px;left:0;right:0;height:60px;background:var(--cream);clip-path:polygon(0 0,100% 0,100% 100%,0 0);}
        .order-sec h2{font-family:'Bowlby One',sans-serif;font-size:clamp(36px,5vw,64px);margin:0 0 8px;color:#FFE27A;line-height:1;}
        .order-sec .lead{color:#FFD89A;max-width:560px;margin-bottom:36px;}
        .order-wrap{display:grid;grid-template-columns:1.4fr 1fr;gap:32px;}
        @media(max-width:900px){.order-wrap{grid-template-columns:1fr;}}
        form{background:#fff;color:var(--ink);border-radius:28px;padding:32px;box-shadow:12px 12px 0 var(--orange-1);}
        .field{margin-bottom:22px;}
        .field label{display:block;font-weight:700;margin-bottom:8px;font-size:14px;letter-spacing:.2px;}
        .field label .req{color:var(--red-stamp);}
        .field input[type="text"],.field input[type="tel"],.field input[type="number"],.field textarea{width:100%;padding:12px 14px;border:2px solid #EADBC4;border-radius:12px;font-family:inherit;font-size:15px;background:#FFFBF3;transition:border-color .15s ease,box-shadow .15s ease;}
        .field input:focus,.field textarea:focus{outline:none;border-color:var(--orange-1);box-shadow:0 0 0 4px rgba(255,106,0,.15);}
        .field textarea{min-height:88px;resize:vertical;}
        .help{font-size:12px;color:#8a5a2e;margin-top:6px;}
        .options{display:grid;gap:10px;}
        .option{display:flex;align-items:center;gap:12px;padding:14px 16px;background:#FFFBF3;border:2px solid #EADBC4;border-radius:12px;cursor:pointer;transition:all .15s ease;}
        .option:hover{border-color:var(--orange-2);}
        .option input{accent-color:var(--orange-1);width:18px;height:18px;}
        .option.selected{border-color:var(--orange-1);background:#FFEFD8;}
        .option .price{margin-left:auto;font-weight:800;color:var(--orange-deep);}
        .summary{background:linear-gradient(180deg,#FFE9C7,#FFD89A);border-radius:16px;padding:18px;border:2px dashed var(--orange-deep);margin:8px 0 22px;}
        .summary .row{display:flex;justify-content:space-between;padding:4px 0;font-size:15px;}
        .summary .total{font-family:'Bowlby One',sans-serif;font-size:22px;color:var(--orange-deep);border-top:2px dashed var(--orange-deep);margin-top:8px;padding-top:10px;}
        .submit-btn{width:100%;padding:18px;background:var(--orange-1);color:#fff;border:none;border-radius:14px;font-family:'Bowlby One',sans-serif;font-size:18px;letter-spacing:1px;cursor:pointer;box-shadow:0 6px 0 var(--orange-deep);transition:transform .15s ease,box-shadow .15s ease;}
        .submit-btn:hover{transform:translateY(-2px);box-shadow:0 8px 0 var(--orange-deep);}
        .submit-btn:active{transform:translateY(2px);box-shadow:0 2px 0 var(--orange-deep);}
        .submit-btn:disabled{opacity:.6;cursor:not-allowed;}
        .info-stack{display:flex;flex-direction:column;gap:18px;}
        .info-card{background:#fff;color:var(--ink);border-radius:22px;padding:24px;border:2px solid #FFE27A;}
        .info-card h4{font-family:'Bowlby One',sans-serif;margin:0 0 10px;font-size:18px;}
        .info-card .schedule{display:grid;gap:10px;padding:0;margin:0;}
        .info-card .schedule li{list-style:none;display:flex;gap:12px;align-items:center;padding:10px 12px;background:#FFF6E9;border-radius:10px;}
        .info-card .schedule li b{color:var(--orange-deep);}
        .info-card .badge{display:inline-block;background:var(--red-stamp);color:#fff;padding:4px 10px;border-radius:6px;font-size:11px;font-weight:800;letter-spacing:1px;}
        .wa-box{background:var(--green);color:#fff;padding:18px;border-radius:16px;display:flex;align-items:center;gap:12px;text-decoration:none;font-weight:700;}
        .wa-box .icon{width:40px;height:40px;border-radius:50%;background:#fff;color:var(--green);display:grid;place-items:center;font-size:22px;font-weight:900;}
        .modal-overlay{position:fixed;inset:0;background:rgba(20,5,0,.75);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;animation:fade .2s ease;}
        @keyframes fade{from{opacity:0;}to{opacity:1;}}
        .modal-card{background:#fff;border-radius:24px;padding:32px;max-width:460px;width:100%;max-height:90vh;overflow-y:auto;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.4);position:relative;}
        .modal-card h3{font-family:'Bowlby One',sans-serif;font-size:28px;margin:0 0 8px;color:var(--orange-deep);}
        .qris-box{background:#FFF6E9;border-radius:16px;padding:20px;margin:18px 0;border:2px dashed var(--orange-1);}
        .qris-box img{width:240px;height:240px;border-radius:12px;border:2px solid var(--ink);display:block;margin:0 auto;}
        .pay-info{text-align:left;background:#FFF6E9;padding:16px;border-radius:12px;font-size:14px;line-height:1.6;}
        .pay-info b{color:var(--orange-deep);}
        .close-x{position:absolute;top:12px;right:14px;background:none;border:none;font-size:28px;cursor:pointer;color:var(--ink);}
        footer{background:var(--orange-deep);color:#FFE27A;text-align:center;padding:30px 6vw;font-weight:600;}
        footer a{color:#FFE27A;text-decoration:underline;}
        .toast-bar{position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:var(--green);color:#fff;padding:14px 24px;border-radius:999px;font-weight:700;box-shadow:0 10px 30px rgba(0,0,0,.3);z-index:200;animation:slideUp .3s ease;}
        @keyframes slideUp{from{opacity:0;transform:translate(-50%,20px);}to{opacity:1;transform:translateX(-50%);}}
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Bowlby+One&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Caveat:wght@500;700&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav className="nav">
        <a href="#" className="logo">
          <img src="/logo.png" alt="Gari Madang" className="logo-img" />
          <div className="logo-text">Gari Madang</div>
        </a>
        <div className="nav-links">
          <a href="#menu">Menu</a>
          <a href="#order">Pesan</a>
          <a href="#info">Info</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div>
          <div className="tag"><span className="dot"></span>Open Pre-Order · Batch 2</div>
          <h1>Open<br /><span className="em">Pre-Order!</span></h1>
          <p className="hero-sub">Koe kencot? <b>Gari Madang solusine!</b> Dakbal pedas manis ala Korea, dimasak fresh untuk batch terbatas. Pesen sekarang, ready Sabtu siang.</p>
          <div className="scribble">~ pesenan diantar gratis di sekitar kampus ~</div>
          <div className="cta-row">
            <a href="#order" className="btn btn-primary">Pesen Sekarang →</a>
            <a href="#menu" className="btn btn-ghost">Lihat Menu</a>
          </div>
        </div>
        <div className="hero-card">
          <div className="poster-frame">
            <img src="/garimadang.jpeg" alt="Poster Gari Madang Pre-Order" />
          </div>
          <div className="stamp">
            <small>CLOSE PO</small>
            <big>JUM&apos;AT!</big>
          </div>
          <div className="ribbon">Ready Sabtu (Siang)</div>
        </div>
      </section>

      {/* MENU */}
      <section className="menu-sec" id="menu">
        <div className="section-head">
          <h2>Menu Batch 2</h2>
          <p className="lead">Dua varian, satu cita rasa. Pilih yang sesuai sama porsi laparmu.</p>
        </div>
        <div className="menu-grid">
          <div className="menu-card">
            <div className="visual">
              <img src="/tanpanasi.png" alt="Dakbal" />
            </div>
            <div className="price-tag">Rp 14K</div>
            <h3>Dakbal</h3>
            <p>Ceker ayam pedas manis ala Korea, ditabur wijen. Cocok buat snacking pedas.</p>
            <span className="meta">Tanpa Nasi</span>
          </div>
          <div className="menu-card">
            <div className="visual">
              <img src="/pakainasi.png" alt="Dakbal + Nasi" />
            </div>
            <div className="price-tag">Rp 16K</div>
            <h3>Dakbal + Nasi</h3>
            <p>Versi kenyang. Dakbal komplit dengan nasi hangat dan irisan timun segar.</p>
            <span className="meta">Paket Komplit</span>
          </div>
        </div>
      </section>

      {/* ORDER */}
      <section className="order-sec" id="order">
        <h2>Form Pre-Order</h2>
        <p className="lead">Isi data lengkap di bawah, pilih metode pembayaran, lalu submit. Kami akan konfirmasi via WhatsApp.</p>

        <div className="order-wrap">
          <form id="orderForm" onSubmit={handleSubmit}>
            <div className="field">
              <label>Nama <span className="req">*</span></label>
              <input type="text" name="nama" required placeholder="Nama lengkap kamu" />
            </div>

            <div className="field">
              <label>Nomor WhatsApp <span className="req">*</span></label>
              <input type="tel" name="whatsapp" required placeholder="08xxxxxxxxxx" pattern="[0-9+\s\-]{8,}" />
            </div>

            <div className="field">
              <label>Jenis Pesanan <span className="req">*</span></label>
              <div className="options">
                <label className={`option${checkNasi ? ' selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={checkNasi}
                    onChange={e => {
                      setCheckNasi(e.target.checked);
                      if (!e.target.checked) setJumlahNasi(0);
                    }}
                  />
                  <span>Dakbal dengan Nasi</span>
                  <span className="price">Rp 16K</span>
                </label>
                {checkNasi && (
                  <div style={{ marginTop: 8 }}>
                    <input
                      type="number"
                      name="jumlah_nasi"
                      min={1}
                      placeholder="Jumlah Dakbal dengan Nasi"
                      value={jumlahNasi || ''}
                      onChange={e => setJumlahNasi(parseInt(e.target.value) || 0)}
                      required
                      style={{ width: '100%', padding: '12px 14px', border: '2px solid #EADBC4', borderRadius: 12, fontFamily: 'inherit', fontSize: 15, background: '#FFFBF3' }}
                    />
                  </div>
                )}

                <label className={`option${checkTanpa ? ' selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={checkTanpa}
                    onChange={e => {
                      setCheckTanpa(e.target.checked);
                      if (!e.target.checked) setJumlahTanpa(0);
                    }}
                  />
                  <span>Dakbal tanpa Nasi</span>
                  <span className="price">Rp 14K</span>
                </label>
                {checkTanpa && (
                  <div style={{ marginTop: 8 }}>
                    <input
                      type="number"
                      name="jumlah_tanpa"
                      min={1}
                      placeholder="Jumlah Dakbal tanpa Nasi"
                      value={jumlahTanpa || ''}
                      onChange={e => setJumlahTanpa(parseInt(e.target.value) || 0)}
                      required
                      style={{ width: '100%', padding: '12px 14px', border: '2px solid #EADBC4', borderRadius: 12, fontFamily: 'inherit', fontSize: 15, background: '#FFFBF3' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="field">
              <label>Keterangan pesanan <span className="req">*</span></label>
              <textarea name="keterangan" required placeholder="contoh: 2 Dakbal nasi + 1 Dakbal tanpa nasi"></textarea>
              <div className="help">Tuliskan rincian biar kami nggak salah racik.</div>
            </div>

            <div className="field">
              <label>Pilihan pengantaran <span className="req">*</span></label>
              <div className="options">
                {['Telkom University Purwokerto', 'Diantar ke tempat'].map(val => (
                  <label key={val} className={`option${pengantaran === val ? ' selected' : ''}`}>
                    <input
                      type="radio"
                      name="pengantaran"
                      value={val}
                      required
                      onChange={() => setPengantaran(val)}
                    />
                    <span>
                      {val}
                      {val === 'Diantar ke tempat' && <small style={{ color: '#8a5a2e' }}> (free ongkir, maks 5km dari kampus Telkom)</small>}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {pengantaran === 'Diantar ke tempat' && (
              <div className="field">
                <label>Alamat pengantaran</label>
                <textarea name="alamat" required placeholder="Tulis alamat lengkap (nama tempat, jalan, patokan)"></textarea>
              </div>
            )}

            <div className="field">
              <label>Metode Pembayaran <span className="req">*</span></label>
              <div className="options">
                {[{ val: 'QRIS', label: '💳 QRIS (Bayar Sekarang)' }, { val: 'COD', label: '💵 COD (Bayar Saat Diantar)' }].map(({ val, label }) => (
                  <label key={val} className={`option${pembayaran === val ? ' selected' : ''}`}>
                    <input
                      type="radio"
                      name="pembayaran"
                      value={val}
                      required
                      onChange={() => setPembayaran(val)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {showSummary && (
              <div className="summary">
                <div className="row"><span>Jumlah pesanan</span><span>{totalPorsi} porsi</span></div>
                <div className="row"><span>Pengantaran</span><span>{pengantaran || '-'}</span></div>
                <div className="row"><span>Metode bayar</span><span>{pembayaran || '-'}</span></div>
                <div className="row total"><span>Estimasi total</span><span>Rp {totalHarga.toLocaleString('id-ID')}</span></div>
                <div className="help" style={{ marginTop: 8 }}>*Total final akan dikonfirmasi admin via WhatsApp.</div>
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Pre-Order →'}
            </button>
          </form>

          {/* SIDEBAR */}
          <aside className="info-stack" id="info">
            <div className="info-card">
              <h4>📅 Jadwal Batch 2</h4>
              <ul className="schedule">
                <li><span className="badge">PO</span><div>Buka sampai <b>Jum&apos;at</b></div></li>
                <li><span className="badge" style={{ background: 'var(--orange-1)' }}>SIAP</span><div>Ready <b>Sabtu siang</b></div></li>
              </ul>
            </div>
            <div className="info-card">
              <h4>📍 Area Pengantaran</h4>
              <p style={{ margin: 0, color: '#6e3b13' }}>Free ongkir untuk area kampus Telkom University Purwokerto & sekitarnya (maks 5 km).</p>
            </div>
            <a href="https://wa.me/6285175392584" className="wa-box" target="_blank" rel="noopener noreferrer">
              <div className="icon">W</div>
              <div>
                <div style={{ fontSize: 12, opacity: .85 }}>Tanya admin</div>
                <div>0851-7539-2584</div>
              </div>
            </a>
            <div className="info-card">
              <h4>💡 Cara Order</h4>
              <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7, color: '#6e3b13' }}>
                <li>Isi form di samping</li>
                <li>Pilih QRIS / COD</li>
                <li>Submit & tunggu konfirmasi WA</li>
              </ol>
            </div>
          </aside>
        </div>
      </section>

      <footer>
        <div>© 2026 Gari Madang · <a href="https://instagram.com/garimadang_" target="_blank" rel="noopener noreferrer">@garimadang_</a></div>
      </footer>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-card">
            <button className="close-x" onClick={() => setShowModal(false)}>×</button>
            <h3>{modalMetode === 'QRIS' ? 'Pembayaran QRIS' : 'Pesanan Diterima!'}</h3>
            <p>{modalMetode === 'QRIS' ? 'Scan QRIS di bawah ini untuk menyelesaikan pembayaran.' : 'Kamu memilih COD.'}</p>

            {modalMetode === 'QRIS' ? (
              <div className="qris-box">
                <img src="/qris.jpeg" alt="QRIS Gari Madang" />
                <p style={{ margin: '14px 0 0', fontSize: 13, color: '#6e3b13' }}>Setelah bayar, kirim bukti transfer ke WA admin.</p>
              </div>
            ) : (
              <div className="pay-info">
                <p style={{ margin: '0 0 8px' }}><b>📦 Pesanan via COD</b></p>
                <p style={{ margin: 0 }}>Pesananmu akan dicatat. Pembayaran dilakukan saat pesanan diantar/diambil. Admin akan menghubungi via WhatsApp untuk konfirmasi.</p>
              </div>
            )}

            <a
              href="https://wa.me/6285175392584?text=Halo%20Gari%20Madang%2C%20saya%20baru%20saja%20pre-order"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ background: 'var(--green)', color: '#fff', marginTop: 18, width: '100%', justifyContent: 'center', display: 'flex' }}
            >
              Konfirmasi via WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* TOAST */}
      {showToast && (
        <div className="toast-bar">✅ Pesanan berhasil dikirim!</div>
      )}
    </>
  );
}