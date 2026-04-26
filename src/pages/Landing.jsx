import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const h1Ref = useRef(null);
  const canvasRef = useRef(null);

  const goToOnboarding = (e) => {
    if (e) e.preventDefault();
    navigate('/onboarding/1');
  };

  useEffect(() => {
    const root = document.querySelector('.fp-landing');
    if (!root) return;

    const cur = document.getElementById('fp-cur');
    const ring = document.getElementById('fp-cur-ring');
    const prog = document.getElementById('fp-prog');

    let mx = 0, my = 0, rx = 0, ry = 0;
    let raf1 = 0, raf2 = 0;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cur) {
        cur.style.left = mx + 'px';
        cur.style.top = my + 'px';
      }
    };

    const animRing = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      if (ring) {
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
      }
      raf1 = requestAnimationFrame(animRing);
    };

    document.addEventListener('mousemove', onMouseMove);
    raf1 = requestAnimationFrame(animRing);

    // Cursor expand on interactive elements
    const interactive = root.querySelectorAll('a, button');
    const onEnter = () => {
      if (cur) { cur.style.width = '16px'; cur.style.height = '16px'; }
      if (ring) { ring.style.width = '56px'; ring.style.height = '56px'; ring.style.opacity = '.2'; }
    };
    const onLeave = () => {
      if (cur) { cur.style.width = '9px'; cur.style.height = '9px'; }
      if (ring) { ring.style.width = '38px'; ring.style.height = '38px'; ring.style.opacity = '.45'; }
    };
    interactive.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    // Scroll progress bar
    const onScroll = () => {
      if (prog) {
        const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        prog.style.transform = `scaleX(${pct})`;
      }
    };
    window.addEventListener('scroll', onScroll);

    // Word-split hero h1
    const h1 = h1Ref.current;
    if (h1 && !h1.dataset.split) {
      h1.dataset.split = '1';
      let wi = 0;
      const wrapNodes = (node) => {
        if (node.nodeType === 3) {
          const parts = node.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((p) => {
            if (/^\s+$/.test(p)) {
              frag.appendChild(document.createTextNode(p));
            } else if (p) {
              const s = document.createElement('span');
              s.className = 'word';
              s.textContent = p;
              s.style.cssText = `animation: fp-fadeUp .55s cubic-bezier(.16,1,.3,1) ${0.25 + wi * 0.065}s forwards`;
              wi++;
              frag.appendChild(s);
            }
          });
          node.parentNode.replaceChild(frag, node);
        } else if (node.nodeType === 1) {
          Array.from(node.childNodes).forEach(wrapNodes);
        }
      };
      Array.from(h1.childNodes).forEach(wrapNodes);
    }

    // 3D card parallax
    const card = cardRef.current;
    const onCardParallax = (e) => {
      if (!card) return;
      const dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      card.style.transform = `rotateY(${dx * 6}deg) rotateX(${-dy * 3.5}deg)`;
    };
    document.addEventListener('mousemove', onCardParallax);

    // Reveal observer
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in');
        });
      },
      { threshold: 0.12 }
    );
    root.querySelectorAll('.reveal').forEach((el) => obs.observe(el));

    // Particle canvas
    const cv = canvasRef.current;
    let particleStop = false;
    if (cv) {
      const ctx = cv.getContext('2d');
      const resize = () => {
        cv.width = cv.offsetWidth;
        cv.height = cv.offsetHeight;
      };
      resize();
      window.addEventListener('resize', resize);
      const pts = Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100 + 50,
        s: Math.random() * 2.5 + 0.8,
        sp: Math.random() * 0.25 + 0.08,
        op: Math.random() * 0.35 + 0.08,
        dr: (Math.random() - 0.5) * 0.15,
      }));
      const draw = () => {
        if (particleStop) return;
        ctx.clearRect(0, 0, cv.width, cv.height);
        pts.forEach((p) => {
          p.y -= p.sp;
          p.x += p.dr;
          if (p.y < -5) {
            p.y = 105;
            p.x = Math.random() * 100;
          }
          ctx.beginPath();
          ctx.arc((p.x / 100) * cv.width, (p.y / 100) * cv.height, p.s, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 96, 10, ${p.op})`;
          ctx.fill();
        });
        raf2 = requestAnimationFrame(draw);
      };
      raf2 = requestAnimationFrame(draw);
      // Cleanup
      var removeResize = () => window.removeEventListener('resize', resize);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousemove', onCardParallax);
      window.removeEventListener('scroll', onScroll);
      interactive.forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      particleStop = true;
      obs.disconnect();
      if (typeof removeResize === 'function') removeResize();
    };
  }, []);

  const scrollToHash = (e, hash) => {
    e.preventDefault();
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fp-landing">
      <div id="fp-cur"></div>
      <div id="fp-cur-ring"></div>
      <div id="fp-prog"></div>

      {/* NAV */}
      <nav className="fp-nav">
        <div className="fp-logo">Focus<span>Path</span></div>
        <ul className="nav-links">
          <li><a href="#how" onClick={(e) => scrollToHash(e, '#how')}>How it works</a></li>
          <li><a href="#features" onClick={(e) => scrollToHash(e, '#features')}>Features</a></li>
          <li><a href="#research" onClick={(e) => scrollToHash(e, '#research')}>Research</a></li>
          <li>
            <button className="nav-cta" onClick={goToOnboarding}>Get started</button>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-orb"></div>
        <div className="hero-grid"></div>
        <div className="hero-pill"><span className="pill-dot"></span>Science-backed · ADHD-designed · Gemma 4</div>
        <h1 ref={h1Ref}>Your brain isn't <em>broken.</em><br />Your study method is.</h1>
        <p className="hero-sub">
          FocusPath understands how you think, then builds the exact learning path you need — adapting every session around how your brain actually works.
        </p>
        <div className="hero-btns">
          <button className="fp-btn-primary" onClick={goToOnboarding}>Start learning free →</button>
          <a href="#how" className="fp-btn-ghost" onClick={(e) => scrollToHash(e, '#how')}>See how it works ↓</a>
        </div>
        <div className="hero-card-wrap">
          <div className="hero-card" ref={cardRef}>
            <div className="card-top">
              <svg className="card-avatar-svg" viewBox="0 0 42 42" fill="none">
                <circle cx="21" cy="21" r="21" fill="#FFE8D8" />
                <circle cx="21" cy="17" r="7" fill="#FF600A" opacity=".8" />
                <path d="M7 38c0-7.732 6.268-14 14-14h0c7.732 0 14 6.268 14 14" stroke="#FF600A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <circle cx="21" cy="21" r="20" stroke="#FF600A" strokeWidth=".8" opacity=".3" />
              </svg>
              <div>
                <div className="card-name">Arjun's Learning Path</div>
                <div className="card-sub">Electronics &amp; Communication Engineering</div>
              </div>
            </div>
            <div className="card-bar-label">Today's progress · Session 3 of 5</div>
            <div className="card-bar"><div className="card-fill"></div></div>
            <div className="card-session">
              <div className="card-session-tag">Up next · 12 min</div>
              <div className="card-session-title">Signal Modulation — AM &amp; FM</div>
              <div className="card-session-meta">Targeting your gap in Frequency Domain concepts</div>
            </div>
            <div className="card-chips">
              <div className="fp-chip on">📖 Reading</div>
              <div className="fp-chip">🎧 Audio</div>
              <div className="fp-chip">Adaptive</div>
              <div className="fp-chip">ADHD-paced</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        <div className="stats-inner">
          <div className="stat-box reveal">
            <div className="stat-num">366M</div>
            <div className="stat-label">people worldwide live with ADHD</div>
            <div className="stat-source">WHO, 2023</div>
          </div>
          <div className="stat-box reveal d1">
            <div className="stat-num">3×</div>
            <div className="stat-label">more likely to drop out of school with untreated ADHD</div>
            <div className="stat-source">Frolli et al., 2023</div>
          </div>
          <div className="stat-box reveal d2">
            <div className="stat-num">UDL</div>
            <div className="stat-label">Universal Design for Learning — the framework powering FocusPath</div>
            <div className="stat-source">Research-backed methodology</div>
          </div>
          <div className="stat-box reveal d3">
            <div className="stat-num">12min</div>
            <div className="stat-label">optimal session length for ADHD attention windows</div>
            <div className="stat-source">FocusPath session design</div>
          </div>
        </div>
      </div>

      {/* PROBLEM */}
      <section className="problem" id="problem">
        <div className="reveal">
          <div className="sec-label">The real problem</div>
          <h2 className="sec-head">You've tried <em>everything.</em><br />The tools haven't tried you.</h2>
        </div>
        <div className="problem-cards">
          <div className="prob-card reveal d1">
            <div className="prob-svg-wrap">
              <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
                <rect x="20" y="30" width="30" height="50" rx="4" fill="#FF600A" opacity=".2" stroke="#FF600A" strokeWidth="1.5" />
                <rect x="60" y="30" width="30" height="50" rx="4" fill="#FF600A" opacity=".12" stroke="#FF600A" strokeWidth="1" />
                <line x1="26" y1="42" x2="44" y2="42" stroke="#FF600A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="26" y1="50" x2="44" y2="50" stroke="#FF600A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="26" y1="58" x2="38" y2="58" stroke="#FF600A" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="75" cy="38" r="10" fill="rgba(255,96,10,.15)" stroke="#FF600A" strokeWidth="1.2">
                  <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
                </circle>
                <line x1="70" y1="33" x2="80" y2="43" stroke="#FF600A" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="80" y1="33" x2="70" y2="43" stroke="#FF600A" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="55" cy="85" r="12" stroke="rgba(255,96,10,.2)" strokeWidth="2" fill="none" />
                <circle cx="55" cy="85" r="12" stroke="#FF600A" strokeWidth="2" fill="none" strokeDasharray="75" strokeDashoffset="60" strokeLinecap="round">
                  <animateTransform attributeName="transform" type="rotate" values="0 55 85;360 55 85" dur="3s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
            <div className="prob-title">You open it.<br />You close it.</div>
            <div className="prob-desc">Starting a study session with ADHD isn't laziness — it's a neurological barrier. FocusPath removes the start-up friction entirely.</div>
          </div>
          <div className="prob-card reveal d2">
            <div className="prob-svg-wrap">
              <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
                <rect x="18" y="55" width="74" height="42" rx="5" fill="rgba(255,96,10,.08)" stroke="rgba(255,96,10,.2)" strokeWidth="1" />
                <rect x="22" y="48" width="66" height="42" rx="5" fill="rgba(255,96,10,.1)" stroke="rgba(255,96,10,.25)" strokeWidth="1" />
                <rect x="26" y="41" width="58" height="42" rx="5" fill="rgba(255,96,10,.15)" stroke="rgba(255,96,10,.35)" strokeWidth="1.2" />
                <line x1="33" y1="51" x2="77" y2="51" stroke="#FF600A" strokeWidth="1.2" strokeLinecap="round" opacity=".5" />
                <line x1="33" y1="57" x2="65" y2="57" stroke="#FF600A" strokeWidth="1.2" strokeLinecap="round" opacity=".5" />
                <line x1="33" y1="63" x2="72" y2="63" stroke="#FF600A" strokeWidth="1.2" strokeLinecap="round" opacity=".5" />
                <path d="M40 28 Q44 22 48 28 Q52 34 56 28 Q60 22 64 28" stroke="#FF600A" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity=".7">
                  <animate attributeName="opacity" values=".7;1;.7" dur="1.5s" repeatCount="indefinite" />
                </path>
                <path d="M55 10 L55 24" stroke="#FF600A" strokeWidth="1.5" strokeLinecap="round" opacity=".4">
                  <animate attributeName="opacity" values=".4;.9;.4" dur="1.2s" repeatCount="indefinite" />
                </path>
              </svg>
            </div>
            <div className="prob-title">The material<br />is overwhelming.</div>
            <div className="prob-desc">200-page textbooks aren't designed for ADHD minds. FocusPath breaks any syllabus into the minimum viable pieces you actually need.</div>
          </div>
          <div className="prob-card reveal d3">
            <div className="prob-svg-wrap">
              <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
                <path d="M55 25 C38 25 28 36 28 48 C28 56 32 62 38 66 C38 72 42 76 48 76 L62 76 C68 76 72 72 72 66 C78 62 82 56 82 48 C82 36 72 25 55 25Z" stroke="#FF600A" strokeWidth="1.8" fill="rgba(255,96,10,.08)" strokeLinejoin="round" />
                <path d="M42 45 Q48 40 54 45 Q60 50 66 45" stroke="#FF600A" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity=".5" />
                <path d="M36 55 Q42 50 46 55" stroke="#FF600A" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity=".5" />
                <circle r="4" fill="#FF600A" opacity=".9">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M55,55 m-30,0 a30,30 0 1,1 60,0 a30,30 0 1,1 -60,0" />
                </circle>
                <circle r="2.5" fill="#FF600A" opacity=".5">
                  <animateMotion dur="2.5s" begin=".8s" repeatCount="indefinite" path="M55,55 m-22,0 a22,22 0 1,0 44,0 a22,22 0 1,0 -44,0" />
                </circle>
                <path d="M49 88 Q55 82 61 88" stroke="#FF600A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".6" />
                <path d="M45 93 Q55 84 65 93" stroke="#FF600A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity=".4" />
                <circle cx="55" cy="99" r="2" fill="#FF600A" opacity=".6" />
              </svg>
            </div>
            <div className="prob-title">Distraction<br />derails everything.</div>
            <div className="prob-desc">Your focus shifts and hours vanish. FocusPath detects when you're away and meets you with a 90-second recap — no restart, no guilt.</div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="how" id="how">
        <div className="reveal">
          <div className="sec-label">How FocusPath works</div>
          <h2 className="sec-head">Three steps.<br /><em>Zero overwhelm.</em></h2>
        </div>
        <div className="how-steps">
          <div className="step reveal d1">
            <div className="step-num">01</div>
            <div className="step-svg-wrap">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <rect x="10" y="20" width="55" height="30" rx="12" fill="rgba(255,96,10,.12)" stroke="#FF600A" strokeWidth="1.5" />
                <path d="M20 50 L14 62 L30 50" fill="rgba(255,96,10,.12)" stroke="#FF600A" strokeWidth="1.2" strokeLinejoin="round" />
                <line x1="20" y1="31" x2="54" y2="31" stroke="#FF600A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="20" y1="38" x2="44" y2="38" stroke="#FF600A" strokeWidth="1.5" strokeLinecap="round" />
                <rect x="35" y="55" width="52" height="26" rx="10" fill="rgba(255,96,10,.08)" stroke="#FF600A" strokeWidth="1" opacity=".7">
                  <animate attributeName="opacity" values=".4;.9;.4" dur="2s" repeatCount="indefinite" />
                </rect>
                <line x1="44" y1="64" x2="78" y2="64" stroke="#FF600A" strokeWidth="1.2" strokeLinecap="round" opacity=".6" />
                <line x1="44" y1="71" x2="66" y2="71" stroke="#FF600A" strokeWidth="1.2" strokeLinecap="round" opacity=".6" />
                <circle cx="44" cy="67.5" r="2" fill="#FF600A" opacity=".5">
                  <animate attributeName="opacity" values=".5;1;.5" dur=".8s" begin="0s" repeatCount="indefinite" />
                </circle>
                <circle cx="51" cy="67.5" r="2" fill="#FF600A" opacity=".5">
                  <animate attributeName="opacity" values=".5;1;.5" dur=".8s" begin=".25s" repeatCount="indefinite" />
                </circle>
                <circle cx="58" cy="67.5" r="2" fill="#FF600A" opacity=".5">
                  <animate attributeName="opacity" values=".5;1;.5" dur=".8s" begin=".5s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
            <div className="step-title">Tell us what you want to learn</div>
            <div className="step-desc">Enter any subject or upload your syllabus. FocusPath maps every concept that matters in seconds.</div>
          </div>
          <div className="step reveal d2">
            <div className="step-num">02</div>
            <div className="step-svg-wrap">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="36" stroke="#FF600A" strokeWidth=".8" strokeDasharray="4 3" opacity=".2" />
                <circle cx="50" cy="50" r="24" stroke="#FF600A" strokeWidth=".8" strokeDasharray="4 3" opacity=".3" />
                <circle cx="50" cy="50" r="12" stroke="#FF600A" strokeWidth=".8" opacity=".4" />
                <line x1="50" y1="14" x2="50" y2="86" stroke="#FF600A" strokeWidth=".7" opacity=".2" />
                <line x1="14" y1="50" x2="86" y2="50" stroke="#FF600A" strokeWidth=".7" opacity=".2" />
                <line x1="24" y1="24" x2="76" y2="76" stroke="#FF600A" strokeWidth=".7" opacity=".15" />
                <line x1="76" y1="24" x2="24" y2="76" stroke="#FF600A" strokeWidth=".7" opacity=".15" />
                <polygon points="50,28 68,42 62,66 38,66 32,42" fill="rgba(255,96,10,.15)" stroke="#FF600A" strokeWidth="1.8" strokeLinejoin="round">
                  <animateTransform attributeName="transform" type="scale" values="1;1.05;1" additive="sum" dur="2.5s" repeatCount="indefinite" />
                </polygon>
                <circle cx="50" cy="50" r="4" fill="#FF600A" />
                <line x1="50" y1="50" x2="50" y2="14" stroke="#FF600A" strokeWidth="1.5" strokeLinecap="round" opacity=".7">
                  <animateTransform attributeName="transform" type="rotate" values="0 50 50;360 50 50" dur="3s" repeatCount="indefinite" />
                </line>
              </svg>
            </div>
            <div className="step-title">We map your knowledge</div>
            <div className="step-desc">A 5-minute adaptive dialogue — not a quiz — finds exactly where you stand, topic by topic.</div>
          </div>
          <div className="step reveal d3">
            <div className="step-num">03</div>
            <div className="step-svg-wrap">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <path d="M15 75 C20 75 25 55 35 50 C45 45 50 60 60 50 C70 40 75 30 85 25" stroke="#FF600A" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="140" strokeDashoffset="140">
                  <animate attributeName="stroke-dashoffset" values="140;0" dur="2s" repeatCount="indefinite" />
                </path>
                <circle cx="15" cy="75" r="5" fill="#FF600A" />
                <circle cx="35" cy="50" r="4" fill="#FF600A" opacity=".7" />
                <circle cx="60" cy="50" r="4" fill="#FF600A" opacity=".7" />
                <circle cx="85" cy="25" r="5" fill="#FF600A">
                  <animate attributeName="r" values="5;7;5" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;.6;1" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <line x1="85" y1="15" x2="85" y2="20" stroke="#FF600A" strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
                <line x1="85" y1="30" x2="85" y2="35" stroke="#FF600A" strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
                <line x1="75" y1="25" x2="80" y2="25" stroke="#FF600A" strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
                <line x1="90" y1="25" x2="95" y2="25" stroke="#FF600A" strokeWidth="1.5" strokeLinecap="round" opacity=".6" />
              </svg>
            </div>
            <div className="step-title">Your path builds and adapts</div>
            <div className="step-desc">Short focused sessions, automatically reordered after every result. The plan learns as you learn.</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="features-head reveal">
          <div className="sec-label">What makes it different</div>
          <h2 className="sec-head">Built for how your<br />brain <em>actually</em> works.</h2>
        </div>
        <div className="feat-list">
          <div className="feat-row reveal">
            <div className="feat-body">
              <div className="feat-tag">Adaptive Assessment</div>
              <h3 className="feat-title">Not a quiz.<br />A conversation.</h3>
              <p className="feat-desc">FocusPath has a short dialogue to understand your knowledge gaps — then maps a path around what you actually need, not a generic syllabus.</p>
            </div>
            <div className="feat-vis">
              <svg width="220" height="220" viewBox="0 0 220 220" fill="none" style={{ position: 'relative', zIndex: 1 }}>
                <rect x="20" y="40" width="120" height="44" rx="14" fill="rgba(255,96,10,.15)" stroke="#FF600A" strokeWidth="1.5" />
                <text x="80" y="62" textAnchor="middle" fill="#FF600A" fontFamily="DM Sans,sans-serif" fontSize="11" fontWeight="500">Tell me your subject</text>
                <text x="80" y="75" textAnchor="middle" fill="rgba(255,96,10,.6)" fontFamily="DM Sans,sans-serif" fontSize="9">AI question</text>
                <path d="M80 84 L80 100" stroke="#FF600A" strokeWidth="1.5" strokeDasharray="3 2" />

                <rect x="80" y="100" width="120" height="44" rx="14" fill="rgba(255,96,10,.08)" stroke="rgba(255,96,10,.4)" strokeWidth="1" />
                <text x="140" y="122" textAnchor="middle" fill="rgba(255,255,255,.7)" fontFamily="DM Sans,sans-serif" fontSize="11">ECE — Signal Processing</text>
                <text x="140" y="135" textAnchor="middle" fill="rgba(255,255,255,.3)" fontFamily="DM Sans,sans-serif" fontSize="9">Your answer</text>
                <path d="M140 144 L100 160" stroke="#FF600A" strokeWidth="1.5" strokeDasharray="3 2" />

                <rect x="20" y="160" width="140" height="44" rx="14" fill="rgba(255,96,10,.15)" stroke="#FF600A" strokeWidth="1.5" />
                <text x="90" y="182" textAnchor="middle" fill="#FF600A" fontFamily="DM Sans,sans-serif" fontSize="11" fontWeight="500">What do you know about</text>
                <text x="90" y="195" textAnchor="middle" fill="#FF600A" fontFamily="DM Sans,sans-serif" fontSize="11" fontWeight="500">Fourier Transform?</text>

                <circle cx="200" cy="182" r="5" fill="#FF600A">
                  <animate attributeName="opacity" values="1;.3;1" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="r" values="5;8;5" dur="1s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
          </div>

          <div className="feat-row flip reveal">
            <div className="feat-body">
              <div className="feat-tag">Micro-Session Design</div>
              <h3 className="feat-title">12 minutes.<br />Full concepts.</h3>
              <p className="feat-desc">Each session completes one idea — not introduces ten. Research shows ADHD attention windows peak at 10–15 minutes. We design exactly to that.</p>
            </div>
            <div className="feat-vis">
              <svg width="220" height="220" viewBox="0 0 220 220" fill="none" style={{ position: 'relative', zIndex: 1 }}>
                <circle cx="110" cy="100" r="72" stroke="rgba(255,96,10,.1)" strokeWidth="12" />
                <circle cx="110" cy="100" r="72" stroke="#FF600A" strokeWidth="12" strokeDasharray="452" strokeDashoffset="160" strokeLinecap="round" transform="rotate(-90 110 100)">
                  <animate attributeName="stroke-dashoffset" values="452;0;452" dur="6s" repeatCount="indefinite" />
                </circle>
                <circle cx="110" cy="100" r="56" fill="rgba(255,96,10,.06)" stroke="rgba(255,96,10,.2)" strokeWidth=".8" />
                <text x="110" y="93" textAnchor="middle" fill="#FF600A" fontFamily="Playfair Display,serif" fontSize="32" fontWeight="900">12</text>
                <text x="110" y="113" textAnchor="middle" fill="rgba(255,255,255,.4)" fontFamily="DM Sans,sans-serif" fontSize="12">minutes</text>
                <line x1="110" y1="32" x2="110" y2="44" stroke="#FF600A" strokeWidth="2" strokeLinecap="round" opacity=".6" />
                <line x1="168" y1="100" x2="156" y2="100" stroke="#FF600A" strokeWidth="2" strokeLinecap="round" opacity=".3" />
                <line x1="52" y1="100" x2="64" y2="100" stroke="#FF600A" strokeWidth="2" strokeLinecap="round" opacity=".3" />
                <circle cx="110" cy="180" r="20" fill="rgba(255,96,10,.15)" stroke="#FF600A" strokeWidth="1.2">
                  <animate attributeName="opacity" values="1;.5;1" dur="2s" repeatCount="indefinite" />
                </circle>
                <text x="110" y="186" textAnchor="middle" fill="#FF600A" fontFamily="DM Sans,sans-serif" fontSize="18">✓</text>
              </svg>
            </div>
          </div>

          <div className="feat-row reveal">
            <div className="feat-body">
              <div className="feat-tag">Distraction Recovery</div>
              <h3 className="feat-title">Got pulled away?<br />We'll wait.</h3>
              <p className="feat-desc">When you return — 10 minutes or 3 days later — FocusPath shows a 90-second recap and picks up exactly where you left off. No guilt. No restart.</p>
            </div>
            <div className="feat-vis">
              <svg width="220" height="220" viewBox="0 0 220 220" fill="none" style={{ position: 'relative', zIndex: 1 }}>
                <line x1="20" y1="110" x2="80" y2="110" stroke="#FF600A" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M80 110 Q110 80 140 110" stroke="#FF600A" strokeWidth="2" strokeDasharray="4 3" fill="none" strokeLinecap="round" opacity=".5" />
                <rect x="90" y="60" width="40" height="20" rx="8" fill="rgba(255,96,10,.15)" stroke="#FF600A" strokeWidth="1" />
                <text x="110" y="75" textAnchor="middle" fill="#FF600A" fontFamily="DM Sans,sans-serif" fontSize="10">away</text>
                <line x1="140" y1="110" x2="200" y2="110" stroke="#FF600A" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="80" cy="110" r="7" fill="#FF600A" opacity=".5" />
                <circle cx="140" cy="110" r="9" fill="#FF600A">
                  <animate attributeName="r" values="9;13;9" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;.6;1" dur="2s" repeatCount="indefinite" />
                </circle>
                <rect x="55" y="130" width="110" height="42" rx="12" fill="rgba(255,96,10,.1)" stroke="#FF600A" strokeWidth="1.2" />
                <text x="110" y="150" textAnchor="middle" fill="#FF600A" fontFamily="DM Sans,sans-serif" fontSize="11" fontWeight="500">90s recap ready</text>
                <text x="110" y="165" textAnchor="middle" fill="rgba(255,96,10,.6)" fontFamily="DM Sans,sans-serif" fontSize="10">pick up where you left off</text>
                <circle cx="20" cy="110" r="5" fill="#FF600A" opacity=".4" />
                <circle cx="40" cy="110" r="4" fill="#FF600A" opacity=".5" />
                <circle cx="60" cy="110" r="4" fill="#FF600A" opacity=".6" />
                <circle cx="160" cy="110" r="4" fill="#FF600A" opacity=".7" />
                <circle cx="180" cy="110" r="4" fill="#FF600A" opacity=".8" />
                <circle cx="200" cy="110" r="6" fill="#FF600A" />
              </svg>
            </div>
          </div>

          <div className="feat-row flip reveal">
            <div className="feat-body">
              <div className="feat-tag">Multimodal Learning</div>
              <h3 className="feat-title">Text, audio,<br />or both.</h3>
              <p className="feat-desc">Grounded in Universal Design for Learning — the research-backed principle that multiple means of representation is essential for ADHD learners.</p>
            </div>
            <div className="feat-vis">
              <svg width="220" height="220" viewBox="0 0 220 220" fill="none" style={{ position: 'relative', zIndex: 1 }}>
                <circle cx="110" cy="110" r="28" fill="rgba(255,96,10,.15)" stroke="#FF600A" strokeWidth="2" />
                <text x="110" y="107" textAnchor="middle" fill="#FF600A" fontFamily="DM Sans,sans-serif" fontSize="10" fontWeight="500">FocusPath</text>
                <text x="110" y="120" textAnchor="middle" fill="rgba(255,96,10,.7)" fontFamily="DM Sans,sans-serif" fontSize="9">adapts</text>
                <line x1="82" y1="93" x2="46" y2="64" stroke="#FF600A" strokeWidth="1.2" strokeDasharray="3 2" opacity=".6" />
                <rect x="14" y="42" width="50" height="34" rx="10" fill="rgba(255,96,10,.1)" stroke="#FF600A" strokeWidth="1.2" />
                <text x="39" y="56" textAnchor="middle" fill="#FF600A" fontFamily="DM Sans,sans-serif" fontSize="10" fontWeight="500">📖 Text</text>
                <text x="39" y="68" textAnchor="middle" fill="rgba(255,96,10,.5)" fontFamily="DM Sans,sans-serif" fontSize="8">Reading</text>
                <line x1="138" y1="93" x2="170" y2="64" stroke="#FF600A" strokeWidth="1.2" strokeDasharray="3 2" opacity=".6" />
                <rect x="156" y="42" width="50" height="34" rx="10" fill="rgba(255,96,10,.1)" stroke="#FF600A" strokeWidth="1.2" />
                <text x="181" y="56" textAnchor="middle" fill="#FF600A" fontFamily="DM Sans,sans-serif" fontSize="10" fontWeight="500">🎧 Audio</text>
                <text x="181" y="68" textAnchor="middle" fill="rgba(255,96,10,.5)" fontFamily="DM Sans,sans-serif" fontSize="8">Listening</text>
                <line x1="110" y1="138" x2="110" y2="164" stroke="#FF600A" strokeWidth="1.2" strokeDasharray="3 2" opacity=".6" />
                <rect x="75" y="164" width="70" height="34" rx="10" fill="rgba(255,96,10,.1)" stroke="#FF600A" strokeWidth="1.2" />
                <text x="110" y="178" textAnchor="middle" fill="#FF600A" fontFamily="DM Sans,sans-serif" fontSize="10" fontWeight="500">🖼 Visual</text>
                <text x="110" y="190" textAnchor="middle" fill="rgba(255,96,10,.5)" fontFamily="DM Sans,sans-serif" fontSize="8">Diagrams</text>
                <circle cx="110" cy="110" r="58" stroke="#FF600A" strokeWidth=".6" strokeDasharray="2 4" opacity=".2">
                  <animateTransform attributeName="transform" type="rotate" values="0 110 110;360 110 110" dur="12s" repeatCount="indefinite" />
                </circle>
                <circle r="4" fill="#FF600A" opacity=".5">
                  <animateMotion dur="4s" repeatCount="indefinite" path="M110,110 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0" />
                </circle>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* RESEARCH */}
      <section className="research" id="research">
        <div className="reveal">
          <div className="sec-label">Science-backed</div>
          <h2 className="sec-head">Built on <em>peer-reviewed</em><br />research.</h2>
          <p className="research-sub">FocusPath's methodology is grounded in Universal Design for Learning — the most rigorously studied framework for ADHD education.</p>
        </div>
        <div className="research-paper reveal">
          <svg className="paper-svg" viewBox="0 0 56 56" fill="none">
            <rect x="8" y="4" width="36" height="48" rx="5" fill="rgba(255,96,10,.1)" stroke="#FF600A" strokeWidth="1.5" />
            <rect x="14" y="12" width="24" height="3" rx="1.5" fill="#FF600A" opacity=".6" />
            <rect x="14" y="20" width="20" height="2.5" rx="1.25" fill="#FF600A" opacity=".4" />
            <rect x="14" y="27" width="24" height="2.5" rx="1.25" fill="#FF600A" opacity=".4" />
            <rect x="14" y="34" width="16" height="2.5" rx="1.25" fill="#FF600A" opacity=".3" />
            <circle cx="44" cy="44" r="10" fill="#FF600A" />
            <text x="44" y="49" textAnchor="middle" fill="white" fontFamily="DM Sans,sans-serif" fontSize="12" fontWeight="500">✓</text>
          </svg>
          <div>
            <div className="paper-journal">Children (Basel) · NIH PubMed Central · 2023</div>
            <div className="paper-title">Universal Design for Learning for Children with ADHD</div>
            <div className="paper-authors">Frolli A., Cerciello F., Esposito C., Ricci M.C. et al. · Disability Research Centre, Rome University · DOI: 10.3390/children10081350</div>
          </div>
        </div>
        <div className="research-stats">
          <div className="res-stat reveal d1">
            <div className="res-stat-num">UDL</div>
            <div className="res-stat-label">Universal Design for Learning — multiple means of representation, action, and engagement</div>
          </div>
          <div className="res-stat reveal d2">
            <div className="res-stat-num">3×</div>
            <div className="res-stat-label">improvement in engagement when learning is adapted to ADHD-specific presentation styles</div>
          </div>
          <div className="res-stat reveal d3">
            <div className="res-stat-num">2023</div>
            <div className="res-stat-label">peer-reviewed publication validating multimodal, low-friction instruction for ADHD learners</div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="reveal">
          <div className="sec-label">Real learners</div>
          <h2 className="sec-head">The first session<br />that actually <em>ended.</em></h2>
        </div>
        <div className="testi-grid">
          {[
            {
              cls: 'd1',
              quote: "I've never finished a full revision session in my life. FocusPath is the first tool that didn't feel like it was designed for someone else's brain.",
              name: 'Arjun S.',
              meta: 'ECE student · Diagnosed at 17',
            },
            {
              cls: 'd2',
              quote: "The 12-minute sessions sound too short. They're actually perfect. I did four in a row without realising — that's never happened before.",
              name: 'Priya M.',
              meta: 'Medical student · ADHD + anxiety',
            },
            {
              cls: 'd3',
              quote: "It doesn't shame me for disappearing for a week. It just picks up and asks two questions. No restart, no guilt. Just learning.",
              name: 'Rohan K.',
              meta: 'Design student · Self-diagnosed at 21',
            },
          ].map((t) => (
            <div key={t.name} className={`testi-card reveal ${t.cls}`}>
              <div className="testi-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 14 14">
                    <path d="M7 1l1.8 3.6 4 .58-2.9 2.83.68 4L7 10l-3.58 1.88.68-4L1.2 5.18l4-.58z" fill="#FF600A" />
                  </svg>
                ))}
              </div>
              <p className="testi-quote">"{t.quote}"</p>
              <div className="testi-author">
                <div className="testi-avatar">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <circle cx="11" cy="8" r="4" fill="#FF600A" opacity=".8" />
                    <path d="M3 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#FF600A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-meta">{t.meta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TECH */}
      <section className="tech">
        <div className="reveal">
          <div className="tech-badge">
            <div className="tech-badge-dot"></div>
            <span className="tech-badge-text">Powered by Gemma 4 · Google DeepMind · Multimodal + Function Calling</span>
          </div>
          <p style={{ marginTop: '16px' }}>Built on Gemma 4's native multimodal and function calling capabilities — processing text, images, and audio to deliver truly personalised learning paths.</p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final">
        <canvas id="final-canvas" ref={canvasRef}></canvas>
        <div className="reveal" style={{ position: 'relative', zIndex: 2 }}>
          <div className="sec-label">Start today · Free</div>
          <h2 className="sec-head">The first study session<br />that actually <em>ends.</em></h2>
          <p className="final-sub">No setup. No overwhelm. Just your path.</p>
          <button
            className="fp-btn-primary"
            onClick={goToOnboarding}
            style={{ fontSize: '17px', padding: '18px 46px' }}
          >
            Build my learning path →
          </button>
          <p className="final-note">Free to start · No credit card · Backed by peer-reviewed research</p>
        </div>
      </section>

      <footer className="fp-footer">
        <div className="footer-logo">Focus<span>Path</span></div>
        <p>© 2026 FocusPath · Built with Gemma 4 for the Kaggle Good Hackathon · Research: PMC10453933</p>
      </footer>
    </div>
  );
};

export default Landing;
