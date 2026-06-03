'use client';

import { useState, useEffect } from 'react';
import {
  Lock,
  Package,
  CircleCheck,
  Flame,
  CalendarDays,
  MessageCircle,
  Camera,
  X,
  Bell,
} from 'lucide-react';

export default function POClosedOverlay() {
  const [visible, setVisible] = useState(true);
  const [sparks, setSparks] = useState<
    { id: number; x: number; bottom: number; delay: number; dur: number; size: number; color: string }[]
  >([]);

  const colors = ['#FF6A00', '#FFB347', '#FFE27A', '#C03A00', '#FF8A1E'];

  useEffect(() => {
    const generated = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      bottom: Math.random() * 20,
      delay: Math.random() * 6,
      dur: 5 + Math.random() * 8,
      size: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setSparks(generated);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes poClosed-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes poClosed-popIn {
          from { opacity: 0; transform: scale(0.82) translateY(24px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes poClosed-drift {
          0%   { transform: translateY(0) scale(0.9); opacity: 0; }
          20%  { opacity: 0.9; }
          100% { transform: translateY(-110vh) scale(0.3); opacity: 0; }
        }
        @keyframes poClosed-pulseRing {
          0%,100% { box-shadow: 0 0 0 6px rgba(255,106,0,.2), 0 0 30px rgba(255,106,0,.4); }
          50%      { box-shadow: 0 0 0 14px rgba(255,106,0,.05), 0 0 52px rgba(255,106,0,.65); }
        }
        @keyframes poClosed-spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes poClosed-blink { 50% { opacity: .2; } }

        .poc-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: poClosed-fadeIn .55s ease;
          background:
            radial-gradient(ellipse 900px 600px at 50% 40%, rgba(192,58,0,.55) 0%, transparent 70%),
            linear-gradient(160deg, rgba(30,6,0,.93) 0%, rgba(80,18,0,.88) 50%, rgba(18,4,0,.96) 100%);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          overflow: hidden;
        }
        .poc-overlay::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.15 0 0 0 0 0 0 0 0 0.08 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
          pointer-events: none;
          opacity: .75;
          mix-blend-mode: overlay;
        }

        .poc-spark {
          position: absolute;
          border-radius: 50%;
          animation: poClosed-drift linear infinite;
          pointer-events: none;
        }

        .poc-card {
          position: relative;
          z-index: 2;
          background: rgba(255,255,255,.055);
          border: 1.5px solid rgba(255,160,60,.22);
          border-radius: 32px;
          padding: 52px 44px 40px;
          max-width: 500px;
          width: 100%;
          text-align: center;
          animation: poClosed-popIn .5s cubic-bezier(.34,1.56,.64,1) .18s both;
          box-shadow:
            0 0 0 1px rgba(255,100,0,.1),
            0 32px 80px -10px rgba(0,0,0,.75),
            inset 0 1px 0 rgba(255,255,255,.07);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .poc-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 33px;
          background: linear-gradient(135deg, rgba(255,106,0,.35), transparent 42%, rgba(255,180,60,.18));
          z-index: -1;
        }

        .poc-close {
          position: absolute;
          top: 14px; right: 18px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 50%;
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,228,194,.7);
          cursor: pointer;
          transition: background .15s ease, color .15s ease;
        }
        .poc-close:hover { background: rgba(255,106,0,.3); color: #fff; }

        .poc-corner {
          position: absolute;
          font-family: 'Bowlby One', sans-serif;
          font-size: 10px;
          letter-spacing: 1.5px;
          color: rgba(255,179,71,.28);
          text-transform: uppercase;
        }
        .poc-tl { top: 14px; left: 18px; }
        .poc-tr { top: 14px; right: 58px; }

        .poc-icon-wrap {
          width: 88px; height: 88px;
          margin: 0 auto 20px;
        }
        .poc-icon-main {
          width: 88px; height: 88px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF6A00, #C03A00);
          display: flex; align-items: center; justify-content: center;
          animation: poClosed-pulseRing 2.4s ease-in-out infinite;
        }

        .poc-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(230,57,70,.18);
          border: 1px solid rgba(230,57,70,.45);
          color: #FF6B6B;
          padding: 5px 16px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .poc-badge .poc-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #FF6B6B;
          box-shadow: 0 0 6px #FF6B6B;
          animation: poClosed-blink 1.4s ease-in-out infinite;
        }

        .poc-h1 {
          font-family: 'Bowlby One', sans-serif;
          font-size: clamp(36px, 8vw, 60px);
          line-height: .93;
          margin-bottom: 8px;
          color: #fff;
          text-shadow: 0 4px 0 rgba(0,0,0,.38);
        }
        .poc-em { color: #FFE27A; display: block; }

        .poc-scribble {
          font-family: 'Caveat', cursive;
          font-size: 21px;
          color: #FFB347;
          transform: rotate(-2deg);
          display: inline-block;
          margin: 4px 0 18px;
        }

        .poc-pills {
          display: flex;
          gap: 9px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .poc-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.11);
          border-radius: 999px;
          padding: 7px 14px;
          font-size: 12px;
          color: #FFE4C2;
          font-weight: 600;
        }

        .poc-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 14px 0;
        }
        .poc-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,179,71,.22);
        }
        .poc-divider-icon {
          animation: poClosed-spinSlow 8s linear infinite;
          color: rgba(255,179,71,.5);
          display: flex;
        }

        .poc-next {
          background: linear-gradient(135deg, rgba(255,106,0,.17), rgba(255,183,71,.09));
          border: 1px solid rgba(255,179,71,.28);
          border-radius: 16px;
          padding: 16px 20px;
          margin-bottom: 22px;
          color: #FFE4C2;
          font-size: 14px;
          line-height: 1.7;
          text-align: left;
        }
        .poc-next-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Bowlby One', sans-serif;
          font-size: 15px;
          color: #FFD47A;
          margin-bottom: 6px;
          letter-spacing: .4px;
        }

        .poc-wa-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #25D366, #128C7E);
          color: #fff;
          text-decoration: none;
          padding: 14px 26px;
          border-radius: 13px;
          font-weight: 800;
          font-size: 14px;
          box-shadow: 0 6px 20px rgba(37,211,102,.28);
          transition: transform .15s ease, box-shadow .15s ease;
          margin-bottom: 11px;
        }
        .poc-wa-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(37,211,102,.45); }
        .poc-wa-icon {
          width: 28px; height: 28px;
          background: rgba(255,255,255,.2);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }

        .poc-ig {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255,228,194,.55);
          text-decoration: none;
          transition: color .15s;
        }
        .poc-ig:hover { color: #FFE27A; }
      `}</style>

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
          {/* corners */}
          <span className="poc-corner poc-tl">Gari Madang</span>
          <span className="poc-corner poc-tr">2026</span>

          {/* close */}
          <button className="poc-close" onClick={() => setVisible(false)} aria-label="Tutup">
            <X size={16} strokeWidth={2.5} />
          </button>

          {/* main icon: Lock */}
          <div className="poc-icon-wrap">
            <div className="poc-icon-main">
              <Lock size={38} color="#fff" strokeWidth={2} />
            </div>
          </div>

          {/* badge */}
          <div className="poc-badge">
            <span className="poc-dot" />
            Pre-Order Ditutup
          </div>

          {/* heading */}
          <div className="poc-h1">
            PO Sudah
            <span className="poc-em">CLOSED!</span>
          </div>

          <span className="poc-scribble">~ makasih yang udah pesen! ~</span>

          {/* pills */}
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

          {/* divider with Flame */}
          <div className="poc-divider">
            <div className="poc-divider-line" />
            <span className="poc-divider-icon">
              <Flame size={18} strokeWidth={1.8} color="#FFB347" />
            </span>
            <div className="poc-divider-line" />
          </div>

          {/* next batch info */}
          <div className="poc-next">
            <div className="poc-next-title">
              <CalendarDays size={16} strokeWidth={2} color="#FFD47A" />
              Kapan Buka Lagi?
            </div>
            Pantau info batch berikutnya lewat Instagram &amp; WhatsApp kami.
            Jangan sampai kehabisan — slot selalu{' '}
            <b style={{ color: '#FFD47A' }}>cepet penuh!</b>
          </div>

          {/* WA button */}
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

          {/* Instagram link */}
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
    </>
  );
}
