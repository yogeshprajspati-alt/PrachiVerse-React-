import { useState, useEffect, useRef, useCallback } from "react";

const msgs = [
  { n: "01 / 12", tone: "honest", t: "Dekho mujhe pta h tumko achank se ajeeb lagne laga hoga. Mujhe khud tabse pata nhi kaisa feel ho rha — bechani si bn gai h ab. Na kaam me mn lag rha h, na koi aur cheez me." },
  { n: "02 / 12", tone: "real talk", t: "Tabhi to Arindam se milne chala gaya tha. Wo accha accha bolta h to thoda theek lagne lagta h. Or ha — usne kabhi tumko negative nhi bola. Kabhi nhi." },
  { n: "03 / 12", tone: "clarity", t: "Mera koi mood tha hi nhi tumko propose karne ka ya wo question poochne ka. Kyuki me janta hu tumhe nhi pasand ye sab abhi. Lekin tumne samne se aisa bola to curiosity bn gai — hota h na." },
  { n: "04 / 12", tone: "no pressure", t: "Me nhi chahta tum uncomfortable ho. Mujhe pata h tum us sab me interested nhi ho or ready bhi nhi ho filhal. And it's okay. Sach me okay h." },
  { n: "05 / 12", tone: "truth", t: "Or ye mene kab kaha ki 3 saal baad chala jaunga — mene kaha tha shyd 5 se 6 saal baad ke plans h. Lekin agar choose karna pade us ek cheez aur tumhare beech — it would be you. No doubt." },
  { n: "06 / 12", tone: "wistful", t: "Pta nhi kya ho jata h. Itni acchi bonding chalti h, fir achanak koi kaand ho jata h. Normal wali stage kitni calm or dopamine dene wali hoti h — or ye ladai wali utni hi uncertain." },
  { n: "07 / 12", tone: "promise", t: "Ab me aise time ki guarantee to nhi de sakta — lekin if you trust me, me aisa kuch nhi kahunga jis se tumhara dil dukhe. Avoid karunga wo bolna. Pakka." },
  { n: "08 / 12", tone: "softly", t: "Or tum bholi ho, nadan bhi ho — bohot pyri ho. Or tumhari tareef karne se mujhe koi nhi rok sakta, tum bhi nhi ☹️" },
  { n: "09 / 12", tone: "adoring", t: "Or agar me kabhi kisi ko propose karunga bhi to aise thodi randomly kar dunga, poochne me or propose karne me bohot antar hota h, bahar ki countries me propose bs marriage ke liye karte h, india me abhi bhi log bs massti." },
  { n: "10 / 12", tone: "heart", t: "Process hoti h ek. Or propose ke pahle bhi pata hona chaiye na ki samne wala kya chahta h. Tum to bhondu ho..!!" },
  { n: "11 / 12", tone: "smile?", t: "Last Clearance, me kisi ladki ke pass nhi jane wala jabtak wo proof na karde ki wo worthy h, jo tumne pehle hi prove kr diya h, Or tum to ho hi kamal 😏. Tareef karne me expert ho gaya hu gyus ✌️." },
  { n: "12 / 12", tone: "diamond", t: "Choosing anyone else over you is just like, holding a diamond and then taking a regualr shiny stone in your hand. Got it, tum alah ho...!! Baat khatam. No Behes." },
];

const notes = ["I heard you", "space first", "softly", "no pressure", "carefully", "tiny smile?"];

function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext("2d");
    let W = 0, H = 0;
    let particles = [];
    let animId;

    function resize() {
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = Math.floor(W * scale);
      cv.height = Math.floor(H * scale);
      cv.style.width = W + "px";
      cv.style.height = H + "px";
      cx.setTransform(scale, 0, 0, scale, 0, 0);
    }

    function seedParticles() {
      particles = Array.from({ length: 95 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2.2 + 0.5,
        a: Math.random() * 0.45 + 0.16,
        drift: Math.random() * 0.28 + 0.08,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random(),
      }));
    }

    function draw() {
      cx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        p.phase += 0.012;
        p.y -= p.drift;
        p.x += Math.sin(p.phase) * 0.18;
        if (p.y < -8) { p.y = H + 8; p.x = Math.random() * W; }
        const alpha = p.a * (0.55 + 0.45 * Math.sin(p.phase));
        const color = p.hue < 0.34 ? "255,157,183" : p.hue < 0.67 ? "255,192,138" : "143,214,255";
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fillStyle = `rgba(${color},${alpha})`;
        cx.fill();
      });
      animId = requestAnimationFrame(draw);
    }

    resize();
    seedParticles();
    const handleResize = () => { resize(); seedParticles(); };
    window.addEventListener("resize", handleResize);
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
    />
  );
}

export default function Prachi() {
  const [cur, setCur] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [softNote, setSoftNote] = useState({ text: "", key: 0 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [promise1Lit, setPromise1Lit] = useState(false);
  const [promise2Lit, setPromise2Lit] = useState(false);
  const [promise3Lit, setPromise3Lit] = useState(false);
  const sceneRef = useRef(null);

  const popNote = useCallback((text) => {
    setSoftNote((prev) => ({ text, key: prev.key + 1 }));
  }, []);

  const updatePromises = useCallback((index) => {
    setPromise1Lit(index >= 0);
    setPromise2Lit(index >= 2);
    setPromise3Lit(index >= 4);
  }, []);

  const meterLeft = Math.max(0, 1 - (cur + 1) / msgs.length);
  const meterText = meterLeft <= 0 ? "gone" : meterLeft < 0.35 ? "almost gone" : "melting...";

  const flipCard = () => {
    if (revealed) return;
    setRevealed(true);
    updatePromises(cur);
    popNote("slowly");
  };

  const showDone = () => {
    setDone(true);
    updatePromises(msgs.length);
    popNote("thank you");
  };

  const nextCard = () => {
    if (!revealed) { flipCard(); return; }
    if (cur >= msgs.length - 1) { showDone(); return; }

    setIsTransitioning(true);
    setRevealed(false);
    setTimeout(() => {
      const next = cur + 1;
      setCur(next);
      updatePromises(next);
      setTimeout(() => {
        setRevealed(true);
        setIsTransitioning(false);
        popNote(notes[next] || "");
      }, 80);
    }, 340);
  };

  const prevCard = () => {
    if (!revealed || cur <= 0 || isTransitioning) return;
    setIsTransitioning(true);
    setRevealed(false);
    setTimeout(() => {
      const next = cur - 1;
      setCur(next);
      updatePromises(next);
      setTimeout(() => {
        setRevealed(true);
        setIsTransitioning(false);
        popNote(notes[next] || "");
      }, 80);
    }, 340);
  };

  const restart = () => {
    setCur(0);
    setRevealed(false);
    setDone(false);
    updatePromises(-1);
    popNote("again, gently");
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") { e.preventDefault(); nextCard(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prevCard(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const handlePointerMove = (e) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 6, ry: x * 7 });
  };

  const handlePointerLeave = () => setTilt({ rx: 0, ry: 0 });

  const flipperTransform = revealed
    ? `rotateX(${tilt.rx}deg) rotateY(${180 + tilt.ry}deg)`
    : `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap');

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        :root{
          --ink:#fff8f0;
          --muted:rgba(255,240,224,0.7);
          --soft:rgba(255,232,210,0.42);
          --line:rgba(255,232,210,0.2);
          --rose:#ff9db7;
          --peach:#ffc08a;
          --sky:#8fd6ff;
          --leaf:#91dfbd;
        }

        html,body{
          width:100%;height:100%;overflow:hidden;
          font-family:'Outfit',sans-serif;
          -webkit-tap-highlight-color:transparent;
          background:#130d18;
        }

        body{
          min-height:100vh;
          display:flex;align-items:center;justify-content:center;
          padding:18px;color:var(--ink);
          background:
            radial-gradient(circle at 20% 18%,rgba(255,157,183,0.26),transparent 30%),
            radial-gradient(circle at 80% 14%,rgba(143,214,255,0.2),transparent 28%),
            radial-gradient(circle at 50% 92%,rgba(255,192,138,0.24),transparent 34%),
            linear-gradient(145deg,#130d18 0%,#241427 45%,#332019 100%);
        }

        @keyframes fadeDown{from{opacity:0;transform:translateY(-10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes rise{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
        @keyframes breathe{0%,100%{transform:scale(1);filter:saturate(1);}50%{transform:scale(1.05);filter:saturate(1.16);}}
        @keyframes pop{from{opacity:0;transform:scale(.55);}to{opacity:1;transform:scale(1);}}
        @keyframes shine{0%,45%{transform:translateX(-45%) rotate(8deg);}65%,100%{transform:translateX(45%) rotate(8deg);}}
        @keyframes softNoteAnim{0%{opacity:0;transform:translate(-50%,-35%) scale(.92);}18%{opacity:1;}100%{opacity:0;transform:translate(-50%,-92%) scale(1.08);}}

        .prachi-wrap{
          position:relative;z-index:2;
          width:min(100%,390px);
          display:flex;flex-direction:column;align-items:center;text-align:center;
        }

        .prachi-label{
          font-size:10px;letter-spacing:0.28em;text-transform:uppercase;
          color:rgba(255,232,210,0.58);margin-bottom:18px;font-weight:400;
          animation:fadeDown .8s ease both;
        }

        .prachi-mini{
          margin-bottom:10px;font-size:12px;letter-spacing:.08em;
          color:rgba(255,232,210,0.52);animation:fadeDown .8s .04s ease both;
        }

        .prachi-meter{width:min(100%,330px);margin-bottom:14px;animation:fadeDown .8s .08s ease both;}

        .meter-row{
          display:flex;justify-content:space-between;align-items:center;
          margin-bottom:8px;font-size:11px;letter-spacing:.12em;
          color:rgba(255,232,210,0.56);
        }

        .meter-track{
          height:8px;border-radius:999px;
          border:1px solid rgba(255,232,210,0.17);
          background:rgba(255,255,255,0.07);overflow:hidden;
          box-shadow:inset 0 0 18px rgba(0,0,0,0.18);
        }

        .meter-fill{
          width:100%;height:100%;border-radius:inherit;
          background:linear-gradient(90deg,var(--rose),var(--peach),var(--leaf));
          transform-origin:left center;
          transition:transform .65s cubic-bezier(.22,1,.36,1);
        }

        .prachi-promises{
          width:min(100%,330px);
          display:grid;grid-template-columns:repeat(3,1fr);gap:7px;
          margin-bottom:14px;animation:fadeDown .8s .12s ease both;
        }

        .promise-pill{
          min-height:30px;display:grid;place-items:center;
          border:1px solid rgba(255,232,210,0.15);border-radius:999px;
          background:rgba(255,255,255,0.055);color:rgba(255,232,210,0.48);
          font-size:10px;letter-spacing:.11em;text-transform:uppercase;
          transition:background .35s,border-color .35s,color .35s,transform .35s;
        }
        .promise-pill.lit{
          background:rgba(255,232,210,0.14);border-color:rgba(255,232,210,0.3);
          color:rgba(255,248,240,0.84);transform:translateY(-1px);
        }

        .prachi-counter{
          min-height:16px;margin-bottom:14px;font-size:11px;
          letter-spacing:.15em;color:rgba(255,232,210,0.5);transition:opacity .35s;
        }

        .prachi-scene{
          width:min(100%,330px);height:390px;perspective:1000px;
          margin-bottom:18px;animation:rise .9s .16s ease both;
        }

        .prachi-flipper{
          position:relative;width:100%;height:100%;
          transform-style:preserve-3d;
          transition:transform .72s cubic-bezier(.4,.2,.2,1),filter .45s;
        }

        .face{
          position:absolute;inset:0;border-radius:26px;
          -webkit-backface-visibility:hidden;backface-visibility:hidden;
          overflow:hidden;display:flex;flex-direction:column;
          border:1px solid var(--line);box-shadow:0 24px 70px rgba(0,0,0,0.28);
        }

        .face-front{
          justify-content:center;align-items:center;padding:34px 28px;cursor:pointer;
          background:
            linear-gradient(145deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04)),
            radial-gradient(circle at 25% 18%,rgba(255,157,183,0.25),transparent 36%),
            radial-gradient(circle at 76% 82%,rgba(143,214,255,0.16),transparent 34%);
          -webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);
        }

        .face-front::before,.face-back::before{
          content:'';position:absolute;inset:1px;border-radius:25px;
          background:linear-gradient(135deg,rgba(255,255,255,0.22),transparent 42%);
          pointer-events:none;
        }

        .face-front::after,.face-back::after{
          content:'';position:absolute;inset:-40% -60%;
          background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,0.16),transparent 58%);
          transform:translateX(-45%) rotate(8deg);opacity:.52;pointer-events:none;
          animation:shine 5.5s ease-in-out infinite;
        }

        .face-front > *,.face-back > *{position:relative;z-index:1;}

        .prachi-moon{
          width:88px;height:88px;border-radius:50%;margin-bottom:24px;
          background:
            radial-gradient(circle at 36% 31%,rgba(255,255,255,0.9) 0 4px,transparent 5px),
            radial-gradient(circle at 61% 57%,rgba(255,255,255,0.45) 0 6px,transparent 7px),
            linear-gradient(145deg,#fff3cf,#ffb7c9 58%,#9bdcff);
          box-shadow:0 0 28px rgba(255,183,201,0.42),0 0 80px rgba(143,214,255,0.25);
          animation:breathe 3s ease-in-out infinite;
        }

        .front-title{
          font-family:'Playfair Display',serif;font-size:31px;line-height:1.16;
          font-weight:600;color:rgba(255,248,240,0.96);margin-bottom:12px;
        }

        .front-hint{
          font-size:12px;letter-spacing:.14em;color:rgba(255,232,210,0.6);text-transform:uppercase;
        }

        .prachi-seal{
          position:absolute;right:23px;bottom:22px;width:38px;height:38px;
          border-radius:50%;display:grid;place-items:center;
          border:1px solid rgba(255,232,210,0.28);color:rgba(255,248,240,0.74);
          font-family:'Playfair Display',serif;font-size:18px;
          background:rgba(255,255,255,0.08);
        }

        .face-back{
          padding:28px 25px 22px;text-align:left;
          transform:rotateY(180deg);
          background:
            linear-gradient(145deg,rgba(255,255,255,0.13),rgba(255,255,255,0.045)),
            radial-gradient(circle at 70% 8%,rgba(255,192,138,0.22),transparent 36%),
            rgba(31,20,33,0.72);
          -webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);
        }

        .card-num{
          position:relative;z-index:1;font-size:10px;letter-spacing:.22em;
          color:rgba(255,232,210,0.52);text-transform:uppercase;
        }

        .card-body{
          position:relative;z-index:1;flex:1;display:flex;align-items:center;padding:20px 0 14px;
        }

        .card-text{
          font-family:'Playfair Display',serif;font-size:18px;line-height:1.82;
          color:rgba(255,248,240,0.94);font-weight:400;
        }

        .card-text::before{
          content:'"';display:block;height:26px;margin-bottom:4px;
          font-size:48px;line-height:.7;color:rgba(255,192,138,0.38);
        }

        .card-foot{
          position:relative;z-index:1;
          display:flex;justify-content:space-between;gap:12px;align-items:center;
          font-size:10px;letter-spacing:.12em;
          color:rgba(255,232,210,0.43);text-transform:uppercase;
        }

        .prachi-btns{
          display:flex;align-items:center;justify-content:center;gap:15px;
          margin-bottom:14px;animation:rise .8s .28s ease both;
        }

        .p-btn{
          border:1px solid rgba(255,232,210,0.24);border-radius:50%;
          background:rgba(255,255,255,0.08);color:var(--ink);
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;outline:none;
          transition:transform .14s,background .18s,border-color .18s;
          -webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);
        }
        .p-btn:hover{background:rgba(255,255,255,0.14);border-color:rgba(255,232,210,0.38);}
        .p-btn:active{transform:scale(.9);}
        .p-btn-sm{width:46px;height:46px;}
        .p-btn-lg{width:62px;height:62px;}
        .p-btn-lg.ready{box-shadow:0 0 0 8px rgba(255,192,138,0.08),0 0 34px rgba(255,192,138,0.18);}

        .btn-label{
          margin-bottom:15px;font-size:10px;letter-spacing:.12em;
          color:rgba(255,232,210,0.42);animation:rise .8s .34s ease both;
        }

        .prachi-dots{display:flex;gap:8px;justify-content:center;animation:rise .8s .4s ease both;}
        .dot{
          width:6px;height:6px;border-radius:50%;
          background:rgba(255,232,210,0.2);
          transition:background .35s,transform .35s,width .35s;
        }
        .dot.done{background:rgba(145,223,189,0.86);transform:scale(1.18);}
        .dot.current{width:18px;border-radius:999px;background:rgba(255,192,138,0.82);}

        .prachi-done{
          display:none;min-height:390px;width:min(100%,330px);
          flex-direction:column;justify-content:center;align-items:center;
          text-align:center;padding:16px;
        }
        .prachi-done.show{display:flex;animation:rise .8s ease both;}

        .done-ring{
          width:92px;height:92px;border-radius:50%;display:grid;place-items:center;
          margin-bottom:22px;border:1px solid rgba(255,232,210,0.25);
          background:radial-gradient(circle,rgba(255,255,255,0.16),rgba(255,255,255,0.06));
          box-shadow:0 0 42px rgba(145,223,189,0.24);
          animation:pop .65s cubic-bezier(.34,1.56,.64,1) both;
        }

        .done-title{
          font-family:'Playfair Display',serif;font-size:27px;line-height:1.18;
          color:rgba(255,248,240,0.96);margin-bottom:12px;
        }

        .done-sub{
          font-family:'Playfair Display',serif;font-size:15px;font-style:italic;
          line-height:1.9;color:rgba(255,232,210,0.72);margin-bottom:18px;
        }

        .after-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;}

        .ghost-btn{
          min-height:42px;padding:0 16px;
          border:1px solid rgba(255,232,210,0.2);border-radius:999px;
          color:rgba(255,248,240,0.72);background:rgba(255,255,255,0.05);
          font:500 12px 'Outfit',sans-serif;letter-spacing:.12em;text-transform:uppercase;
          cursor:pointer;
        }

        .soft-note-el{
          position:fixed;left:50%;top:50%;z-index:4;
          color:rgba(255,248,240,0.92);
          font-family:'Playfair Display',serif;font-size:18px;
          pointer-events:none;opacity:0;
          transform:translate(-50%,-50%) scale(.92);
          animation:softNoteAnim .9s ease both;
        }

        .prachi-glow{
          position:fixed;inset:auto auto -16vh 50%;
          width:92vw;height:38vh;transform:translateX(-50%);
          background:radial-gradient(ellipse,rgba(255,192,138,0.25),transparent 68%);
          filter:blur(18px);pointer-events:none;z-index:0;
        }

        @media (max-height:720px){
          body{padding:12px;}
          .prachi-label{margin-bottom:10px;}
          .prachi-meter{margin-bottom:10px;}
          .prachi-promises{margin-bottom:10px;}
          .prachi-counter{margin-bottom:10px;}
          .prachi-scene,.prachi-done{height:340px;min-height:340px;}
          .front-title{font-size:27px;}
          .card-text{font-size:16px;line-height:1.72;}
          .prachi-btns{margin-bottom:10px;}
        }

        @media (prefers-reduced-motion:reduce){
          *,*::before,*::after{animation:none!important;transition:none!important;}
        }
      `}</style>

      <div style={{
        position: "fixed", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "18px",
        background: `
          radial-gradient(circle at 20% 18%,rgba(255,157,183,0.26),transparent 30%),
          radial-gradient(circle at 80% 14%,rgba(143,214,255,0.2),transparent 28%),
          radial-gradient(circle at 50% 92%,rgba(255,192,138,0.24),transparent 34%),
          linear-gradient(145deg,#130d18 0%,#241427 45%,#332019 100%)
        `,
        color: "#fff8f0",
        fontFamily: "'Outfit',sans-serif",
        overflowY: "auto",
      }}>
        <ParticleCanvas />
        <div className="prachi-glow" />

        <main className="prachi-wrap">
          <p className="prachi-label">gussa halka karne wali jagah</p>
          <p className="prachi-mini">a tiny repair attempt</p>

          {/* Meter */}
          <div className="prachi-meter" aria-hidden="true">
            <div className="meter-row">
              <span>discomfort</span>
              <span>{meterText}</span>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ transform: `scaleX(${meterLeft})` }} />
            </div>
          </div>

          {/* Promises */}
          <div className="prachi-promises" aria-hidden="true">
            <span className={`promise-pill${promise1Lit ? " lit" : ""}`}>sorry</span>
            <span className={`promise-pill${promise2Lit ? " lit" : ""}`}>space</span>
            <span className={`promise-pill${promise3Lit ? " lit" : ""}`}>care</span>
          </div>

          {/* Counter */}
          <p className="prachi-counter" style={{ opacity: done ? 0 : 1 }}>
            {revealed ? `${cur + 1} / ${msgs.length}` : "tap the moon"}
          </p>

          {/* Card scene */}
          {!done && (
            <section
              className="prachi-scene"
              ref={sceneRef}
              aria-live="polite"
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            >
              <div
                className="prachi-flipper"
                style={{ transform: flipperTransform }}
              >
                {/* Front */}
                <button
                  className="face face-front"
                  type="button"
                  onClick={flipCard}
                  aria-label="open message"
                >
                  <span className="prachi-moon" aria-hidden="true" />
                  <span className="front-title">Prachi,<br />thoda sa sunogi?</span>
                  <span className="front-hint">tap the moon</span>
                  <span className="prachi-seal" aria-hidden="true">P</span>
                </button>

                {/* Back */}
                <article className="face face-back">
                  <span className="card-num">{msgs[cur].n}</span>
                  <div className="card-body">
                    <p className="card-text">{msgs[cur].t}</p>
                  </div>
                  <div className="card-foot">
                    <span>{msgs[cur].tone}</span>
                    <span>next</span>
                  </div>
                </article>
              </div>
            </section>
          )}

          {/* Done screen */}
          <section className={`prachi-done${done ? " show" : ""}`} aria-live="polite">
            <div className="done-ring" aria-hidden="true">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="rgba(255,248,240,0.92)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-4.35-9.33-8.37C.6 9.05 2.73 5 6.63 5c2.02 0 3.28 1.02 3.99 2.03C11.33 6.02 12.59 5 14.61 5c3.9 0 6.03 4.05 3.96 7.63C16.24 16.65 12 21 12 21z" />
              </svg>
            </div>
            <p className="done-title">Smile ?,<br />Mission Complete.</p>
            <p className="done-sub">Gussa valid tha. Main bas better handle kar sakta tha.<br />No pressure, bas sorry.</p>
            <div className="after-actions">
              <button className="ghost-btn" type="button" onClick={restart}>read again</button>
            </div>
          </section>

          {/* Nav buttons */}
          {!done && (
            <div id="btns-wrap">
              <div className="prachi-btns">
                <button className="p-btn p-btn-sm" onClick={prevCard} aria-label="previous message">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,248,240,0.86)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  className={`p-btn p-btn-lg${revealed ? " ready" : ""}`}
                  onClick={nextCard}
                  aria-label="next message"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,248,240,0.92)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </button>
              </div>
              <p className="btn-label">prev / next</p>
              <div className="prachi-dots">
                {msgs.map((_, i) => (
                  <span
                    key={i}
                    className={`dot${i < cur ? " done" : i === cur ? " current" : ""}`}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Floating soft note */}
        {softNote.text && (
          <div key={softNote.key} className="soft-note-el">
            {softNote.text}
          </div>
        )}
      </div>
    </>
  );
}
