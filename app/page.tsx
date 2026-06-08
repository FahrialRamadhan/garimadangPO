'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Lightbulb,
  Package,
  Paperclip,
  CheckCircle,
  CreditCard,
  Banknote,
  ArrowRight,
  Lock,
  CircleCheck,
  Flame,
  CalendarDays,
  MessageCircle,
  Camera,
  X,
} from 'lucide-react';

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
  const [buktiBase64, setBuktiBase64] = useState('');
  const [previewBukti, setPreviewBukti] = useState('');
  const [loadingBukti, setLoadingBukti] = useState(false);
  const [buktiTerkirim, setBuktiTerkirim] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  // PO Closed overlay
  const [showPOClosed, setShowPOClosed] = useState(true);
  const [sparks, setSparks] = useState<
    { id: number; x: number; bottom: number; delay: number; dur: number; size: number; color: string }[]
  >([]);

  const sparkColors = ['#FF6A00', '#FFB347', '#FFE27A', '#C03A00', '#FF8A1E'];

  useEffect(() => {
    const generated = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      bottom: Math.random() * 20,
      delay: Math.random() * 6,
      dur: 5 + Math.random() * 8,
      size: Math.random() * 6 + 2,
      color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
    }));
    setSparks(generated);
  }, []);

  const totalHarga = (jumlahNasi * 16000) + (jumlahTanpa * 14000);
  const totalPorsi = jumlahNasi + jumlahTanpa;
  const showSummary = totalPorsi > 0;

  function handleToast() {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  async function handleKirimBukti() {
    if (!buktiBase64 || !orderId) return;
    setLoadingBukti(true);
    try {
      const res = await fetch('/api/upload-bukti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, bukti_pembayaran: buktiBase64 }),
      });
      const result = await res.json();
      if (result.success) {
        setBuktiTerkirim(true);
      } else {
        alert('Gagal upload bukti, coba lagi.');
      }
    } catch {
      alert('Terjadi kesalahan koneksi!');
    } finally {
      setLoadingBukti(false);
    }
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
      pedas_nasi: fd.get('pedas_nasi'),
      jumlah_tanpa: jumlahTanpa,
      pedas_tanpa: fd.get('pedas_tanpa'),
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
      setOrderId(result.orderId || '');
      setModalMetode(data.pembayaran as string);
      setShowModal(true);

      setBuktiBase64('');
      setPreviewBukti('');
      setBuktiTerkirim(false);

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
        .info-card h4{font-family:'Bowlby One',sans-serif;margin:0 0 10px;font-size:18px;display:flex;align-items:center;gap:8px;}
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
        .toast-bar{position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:var(--green);color:#fff;padding:14px 24px;border-radius:999px;font-weight:700;box-shadow:0 10px 30px rgba(0,0,0,.3);z-index:200;animation:slideUp .3s ease;display:flex;align-items:center;gap:8px;}
        @keyframes slideUp{from{opacity:0;transform:translate(-50%,20px);}to{opacity:1;transform:translateX(-50%);}}
        .icon-label{display:flex;align-items:center;gap:8px;}

        /* ===== PO CLOSED OVERLAY ===== */
        @keyframes poClosed-fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes poClosed-popIn{from{opacity:0;transform:scale(0.82) translateY(24px);}to{opacity:1;transform:scale(1) translateY(0);}}
        @keyframes poClosed-drift{0%{transform:translateY(0) scale(0.9);opacity:0;}20%{opacity:0.9;}100%{transform:translateY(-110vh) scale(0.3);opacity:0;}}
        @keyframes poClosed-pulseRing{0%,100%{box-shadow:0 0 0 6px rgba(255,106,0,.2),0 0 30px rgba(255,106,0,.4);}50%{box-shadow:0 0 0 14px rgba(255,106,0,.05),0 0 52px rgba(255,106,0,.65);}}
        @keyframes poClosed-spinSlow{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes poClosed-blink{50%{opacity:.2;}}

        .poc-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;animation:poClosed-fadeIn .55s ease;background:radial-gradient(ellipse 900px 600px at 50% 40%,rgba(192,58,0,.55) 0%,transparent 70%),linear-gradient(160deg,rgba(30,6,0,.93) 0%,rgba(80,18,0,.88) 50%,rgba(18,4,0,.96) 100%);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);overflow:hidden;}
        .poc-overlay::before{content:"";position:absolute;inset:0;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.15 0 0 0 0 0 0 0 0 0.08 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");pointer-events:none;opacity:.75;mix-blend-mode:overlay;}
        .poc-spark{position:absolute;border-radius:50%;animation:poClosed-drift linear infinite;pointer-events:none;}
        .poc-card{position:relative;z-index:2;background:rgba(255,255,255,.055);border:1.5px solid rgba(255,160,60,.22);border-radius:32px;padding:52px 44px 40px;max-width:500px;width:100%;text-align:center;animation:poClosed-popIn .5s cubic-bezier(.34,1.56,.64,1) .18s both;box-shadow:0 0 0 1px rgba(255,100,0,.1),0 32px 80px -10px rgba(0,0,0,.75),inset 0 1px 0 rgba(255,255,255,.07);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);}
        .poc-card::before{content:"";position:absolute;inset:-1px;border-radius:33px;background:linear-gradient(135deg,rgba(255,106,0,.35),transparent 42%,rgba(255,180,60,.18));z-index:-1;}
        .poc-close{position:absolute;top:14px;right:18px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;color:rgba(255,228,194,.7);cursor:pointer;transition:background .15s ease,color .15s ease;}
        .poc-close:hover{background:rgba(255,106,0,.3);color:#fff;}
        .poc-corner{position:absolute;font-family:'Bowlby One',sans-serif;font-size:10px;letter-spacing:1.5px;color:rgba(255,179,71,.28);text-transform:uppercase;}
        .poc-tl{top:14px;left:18px;}
        .poc-tr{top:14px;right:58px;}
        .poc-icon-wrap{width:88px;height:88px;margin:0 auto 20px;}
        .poc-icon-main{width:88px;height:88px;border-radius:50%;background:linear-gradient(135deg,#FF6A00,#C03A00);display:flex;align-items:center;justify-content:center;animation:poClosed-pulseRing 2.4s ease-in-out infinite;}
        .poc-badge{display:inline-flex;align-items:center;gap:7px;background:rgba(230,57,70,.18);border:1px solid rgba(230,57,70,.45);color:#FF6B6B;padding:5px 16px;border-radius:999px;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;}
        .poc-badge .poc-dot{width:7px;height:7px;border-radius:50%;background:#FF6B6B;box-shadow:0 0 6px #FF6B6B;animation:poClosed-blink 1.4s ease-in-out infinite;}
        .poc-h1{font-family:'Bowlby One',sans-serif;font-size:clamp(36px,8vw,60px);line-height:.93;margin-bottom:8px;color:#fff;text-shadow:0 4px 0 rgba(0,0,0,.38);}
        .poc-em{color:#FFE27A;display:block;}
        .poc-scribble{font-family:'Caveat',cursive;font-size:21px;color:#FFB347;transform:rotate(-2deg);display:inline-block;margin:4px 0 18px;}
        .poc-pills{display:flex;gap:9px;justify-content:center;flex-wrap:wrap;margin-bottom:20px;}
        .poc-pill{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.11);border-radius:999px;padding:7px 14px;font-size:12px;color:#FFE4C2;font-weight:600;}
        .poc-divider{display:flex;align-items:center;gap:10px;margin:14px 0;}
        .poc-divider-line{flex:1;height:1px;background:rgba(255,179,71,.22);}
        .poc-divider-icon{animation:poClosed-spinSlow 8s linear infinite;color:rgba(255,179,71,.5);display:flex;}
        .poc-next{background:linear-gradient(135deg,rgba(255,106,0,.17),rgba(255,183,71,.09));border:1px solid rgba(255,179,71,.28);border-radius:16px;padding:16px 20px;margin-bottom:22px;color:#FFE4C2;font-size:14px;line-height:1.7;text-align:left;}
        .poc-next-title{display:flex;align-items:center;gap:8px;font-family:'Bowlby One',sans-serif;font-size:15px;color:#FFD47A;margin-bottom:6px;letter-spacing:.4px;}
        .poc-wa-btn{display:flex;align-items:center;justify-content:center;gap:10px;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;text-decoration:none;padding:14px 26px;border-radius:13px;font-weight:800;font-size:14px;box-shadow:0 6px 20px rgba(37,211,102,.28);transition:transform .15s ease,box-shadow .15s ease;margin-bottom:11px;}
        .poc-wa-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(37,211,102,.45);}
        .poc-wa-icon{width:28px;height:28px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;}
        .poc-ig{display:inline-flex;align-items:center;justify-content:center;gap:6px;font-size:12px;color:rgba(255,228,194,.55);text-decoration:none;transition:color .15s;}
        .poc-ig:hover{color:#FFE27A;}
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Bowlby+One&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Caveat:wght@500;700&display=swap" rel="stylesheet" />

      {/* PO CLOSED OVERLAY */}
      {showPOClosed && (
        <div className="poc-overlay">
          {/* floating sparks */}
          {sparks.map(s => (
            <div
              key={s.id}
              className="poc-spark"
              style={{
                width: s.size,
                height: s.size,
                background: s.color,
                left: `${s.x}%`,
                bottom: `${s.bottom}%`,
                animationDuration: `${s.dur}s`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}

          <div className="poc-card">
            <span className="poc-corner poc-tl">Gari Madang</span>
            <span className="poc-corner poc-tr">2026</span>

            <button className="poc-close" onClick={() => setShowPOClosed(false)} aria-label="Tutup">
              <X size={16} strokeWidth={2.5} />
            </button>

            <div className="poc-icon-wrap">
              <div className="poc-icon-main">
                <Lock size={38} color="#fff" strokeWidth={2} />
              </div>
            </div>

            <div className="poc-badge">
              <span className="poc-dot" />
              Pre-Order Ditutup
            </div>

            <div className="poc-h1">
              PO Sudah
              <span className="poc-em">CLOSED!</span>
            </div>

            <span className="poc-scribble">~ makasih yang udah pesen! ~</span>

            <div className="poc-pills">
              <span className="poc-pill">
                <Package size={13} strokeWidth={2} color="#FFB347" />
                Batch 4 · Selesai
              </span>
              <span className="poc-pill">
                <CircleCheck size={13} strokeWidth={2} color="#2BB673" />
                Pesanan Diproses
              </span>
            </div>

            <div className="poc-divider">
              <div className="poc-divider-line" />
              <span className="poc-divider-icon">
                <Flame size={18} strokeWidth={1.8} color="#FFB347" />
              </span>
              <div className="poc-divider-line" />
            </div>

            <div className="poc-next">
              <div className="poc-next-title">
                <CalendarDays size={16} strokeWidth={2} color="#FFD47A" />
                Kapan Buka Lagi?
              </div>
              Pantau info batch berikutnya lewat Instagram &amp; WhatsApp kami.
              Jangan sampai kehabisan — slot selalu{' '}
              <b style={{ color: '#FFD47A' }}>cepet penuh!</b>
            </div>

            <a
              href="https://wa.me/6285175392584?text=Halo%20Gari%20Madang%2C%20kapan%20buka%20PO%20lagi%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="poc-wa-btn"
            >
              <div className="poc-wa-icon">
                <MessageCircle size={16} strokeWidth={2.2} color="#fff" />
              </div>
              Tanya Kapan Buka PO Lagi
            </a>

            <a
              href="https://instagram.com/garimadang_"
              target="_blank"
              rel="noopener noreferrer"
              className="poc-ig"
            >
              <Camera size={13} strokeWidth={2} />
              @garimadang_ · follow biar nggak ketinggalan!
            </a>
          </div>
        </div>
      )}

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
          <div className="tag"><span className="dot"></span>Open Pre-Order · Batch 4</div>
          <h1>Open<br /><span className="em">Pre-Order!</span></h1>
          <p className="hero-sub">Koe kencot? <b>Gari Madang solusine!</b> Dakbal pedas manis ala Korea, dimasak fresh untuk batch terbatas. Pesen sekarang, ready Sabtu siang.</p>
          <div className="scribble">~ pesenan diantar gratis di sekitar kampus ~</div>
          <div className="cta-row">
            <a href="#order" className="btn btn-primary">
              Pesen Sekarang <ArrowRight size={18} strokeWidth={2.5} />
            </a>
            <a href="#menu" className="btn btn-ghost">Lihat Menu</a>
          </div>
        </div>
        <div className="hero-card">
          <div className="poster-frame">
            <video src="/garimadang.mp4" autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}/>
          </div>
          <div className="stamp">
            <small>CLOSE PO</small>
            <big>SENIN!</big>
          </div>
          <div className="ribbon">Ready Selasa (Siang)</div>
        </div>
      </section>

      {/* MENU */}
      <section className="menu-sec" id="menu">
        <div className="section-head">
          <h2>Menu Batch 4</h2>
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

            {/* ====== JENIS PESANAN ====== */}
            <div className="field">
              <label>Jenis Pesanan <span className="req">*</span></label>

              <div className="options">

                {/* ===== DAKBAL DENGAN NASI ===== */}
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
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '2px solid #EADBC4',
                        borderRadius: 12,
                        fontFamily: 'inherit',
                        fontSize: 15,
                        background: '#FFFBF3'
                      }}
                    />
                    <select
                      name="pedas_nasi"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '2px solid #EADBC4',
                        borderRadius: 12,
                        marginTop: 8,
                        fontFamily: 'inherit',
                        fontSize: 15,
                        background: '#FFFBF3'
                      }}
                    >
                      <option value="">Pilih Level Pedas</option>
                      <option value="Normal">Normal</option>
                      <option value="Pedas">Pedas</option>
                    </select>
                  </div>
                )}

                {/* ===== DAKBAL TANPA NASI ===== */}
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
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '2px solid #EADBC4',
                        borderRadius: 12,
                        fontFamily: 'inherit',
                        fontSize: 15,
                        background: '#FFFBF3'
                      }}
                    />
                    <select
                      name="pedas_tanpa"
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '2px solid #EADBC4',
                        borderRadius: 12,
                        marginTop: 8,
                        fontFamily: 'inherit',
                        fontSize: 15,
                        background: '#FFFBF3'
                      }}
                    >
                      <option value="">Pilih Level Pedas</option>
                      <option value="Normal">Normal</option>
                      <option value="Pedas">Pedas</option>
                    </select>
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
                {['Ambil Sendiri di Market Days TUP', 'Diantar ke tempat'].map(val => (
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
                      {val === 'Diantar ke tempat' && <small style={{ color: '#8a5a2e' }}> (diantar siang 12.00 - 14.00 WIB)</small>}
                      {val === 'Ambil Sendiri di Market Days TUP' && <small style={{ color: '#8a5a2e' }}> (diambil pagi 08.00 - 12.00 WIB)</small>}
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
                <label className={`option${pembayaran === 'QRIS' ? ' selected' : ''}`}>
                  <input
                    type="radio"
                    name="pembayaran"
                    value="QRIS"
                    required
                    onChange={() => setPembayaran('QRIS')}
                  />
                  <span className="icon-label">
                    <CreditCard size={16} strokeWidth={2} />
                    QRIS (Bayar Sekarang)
                  </span>
                </label>
                <label className={`option${pembayaran === 'COD' ? ' selected' : ''}`}>
                  <input
                    type="radio"
                    name="pembayaran"
                    value="COD"
                    required
                    onChange={() => setPembayaran('COD')}
                  />
                  <span className="icon-label">
                    <Banknote size={16} strokeWidth={2} />
                    COD (Bayar Saat Diantar)
                  </span>
                </label>
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
              {loading ? 'Mengirim...' : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  Kirim Pre-Order <ArrowRight size={20} strokeWidth={2.5} />
                </span>
              )}
            </button>
          </form>

          {/* SIDEBAR */}
          <aside className="info-stack" id="info">
            <div className="info-card">
              <h4><Calendar size={18} strokeWidth={2} /> Jadwal Batch 4</h4>
              <ul className="schedule">
                <li><span className="badge">PO</span><div>Buka sampai <b>Senin</b></div></li>
                <li><span className="badge" style={{ background: 'var(--orange-1)' }}>SIAP</span><div>Ready <b>Selasa siang</b></div></li>
              </ul>
            </div>
            <div className="info-card">
              <h4><MapPin size={18} strokeWidth={2} /> Area Pengantaran</h4>
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
              <h4><Lightbulb size={18} strokeWidth={2} /> Cara Order</h4>
              <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7, color: '#6e3b13' }}>
                <li>Isi form di samping</li>
                <li>Pilih QRIS / COD</li>
                <li>Submit &amp; tunggu konfirmasi WA</li>
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

                <p style={{ margin: '14px 0 8px', fontSize: 13, color: '#6e3b13' }}>
                  Setelah bayar, upload bukti pembayaran di bawah ini.
                </p>

                {/* === UPLOAD BUKTI === */}
                <label style={{
                  display: 'block',
                  border: '2px dashed var(--orange-1)',
                  borderRadius: 12,
                  padding: '16px',
                  cursor: 'pointer',
                  background: '#fff',
                  textAlign: 'center',
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        const result = reader.result as string;
                        setBuktiBase64(result);
                        setPreviewBukti(result);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  {previewBukti ? (
                    <img src={previewBukti} alt="Preview bukti" style={{
                      width: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 8
                    }} />
                  ) : (
                    <div style={{ color: '#8a5a2e', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <Paperclip size={16} strokeWidth={2} />
                      Klik untuk pilih foto bukti transfer
                    </div>
                  )}
                </label>

                {buktiBase64 && (
                  <button
                    onClick={handleKirimBukti}
                    disabled={loadingBukti}
                    style={{
                      marginTop: 12, width: '100%', padding: '12px',
                      background: 'var(--orange-1)', color: '#fff', border: 'none',
                      borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                  >
                    {loadingBukti ? 'Mengupload...' : (
                      <>
                        <CheckCircle size={18} strokeWidth={2.5} />
                        Kirim Bukti Pembayaran
                      </>
                    )}
                  </button>
                )}

                {buktiTerkirim && (
                  <p style={{ color: 'var(--green)', fontWeight: 700, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <CheckCircle size={18} strokeWidth={2.5} />
                    Bukti berhasil dikirim!
                  </p>
                )}
              </div>
            ) : (
              <div className="pay-info">
                <p style={{ margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Package size={16} strokeWidth={2} />
                  <b>Pesanan via COD</b>
                </p>
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
        <div className="toast-bar">
          <CheckCircle size={18} strokeWidth={2.5} />
          Pesanan berhasil dikirim!
        </div>
      )}
    </>
  );
}
