import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowDownRight,
  BadgeCheck,
  Boxes,
  BriefcaseBusiness,
  Camera,
  ChevronRight,
  Cuboid,
  Mail,
  Menu,
  MapPin,
  Palette,
  Phone,
  Sparkles,
  WandSparkles,
  X,
} from 'lucide-react';
import './styles.css';

const contacts = {
  phone: '13785442216',
  email: '15128932216@163.com',
  location: '河北承德 / 澳门',
};

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

const metrics = [
  { value: '1000+', label: '高精度建模细节元素' },
  { value: '100+', label: '电商产品出图与SKU图' },
  { value: '40%', label: '产品渲染效率提升' },
  { value: '4', label: '沉浸式红色教育场景' },
];

const projects = [
  {
    title: '澳门岭南文化传统信俗 City Temple Walk',
    category: 'Cultural Route / Visual Identity / Landing',
    image: asset('assets/city-temple/cover.webp'),
    summary: '以澳门土地与民间信仰为主线，完成城市导览路线、视觉系统、文创物料、传播影像与活动落地整合。',
    stats: '1.6km 路线 / 70min 导览 / 15人团队落地',
    href: asset('city-temple-project.html'),
  },
  {
    title: '观云非遗神香品牌设计',
    category: 'Brand Identity / Packaging / Motion',
    image: asset('assets/guanyun/cover.webp'),
    summary: '以澳门非遗神香为文化原点，完成品牌标识、包装视觉、插画系统、动态短视频与游戏化互动体验整合。',
    stats: '50P 方案 / 6 步工艺体验 / 2 支动态视频',
    href: asset('guanyun-project.html'),
  },
  {
    title: '领养一株玉米公益项目',
    category: 'Public Welfare / Editorial / Motion',
    image: asset('assets/corn/cover.webp'),
    summary: '围绕 SDG2 零饥饿议题，完成公益概念、信息视觉、章节手册、实体装订与宣传片整合设计。',
    stats: '4 章手册 / 27P 页面 / 2 支影像',
    href: asset('corn-project.html'),
  },
];

const strengths = [
  {
    icon: <Cuboid />,
    title: '三维建模与渲染',
    text: '熟悉产品模型处理、场景搭建、材质灯光、C4D视觉表达与高效电商出图流程。',
  },
  {
    icon: <WandSparkles />,
    title: 'AI 设计工作流',
    text: '能将 AI 辅助概念生成、视觉探索与设计落地结合，用更短周期完成风格提案。',
  },
  {
    icon: <Palette />,
    title: '品牌与视觉系统',
    text: '具备标志与CI、版式、广告创意和视觉符号构建能力，重视一致性与辨识度。',
  },
  {
    icon: <BriefcaseBusiness />,
    title: '项目协作与统筹',
    text: '有跨部门行政、资料规范、流程优化与团队项目管理经验，能稳定推进交付。',
  },
];

function buildGlowVars(glowColor, intensity) {
  const glowRgb = {
    '#2ca9e1': '44, 169, 225',
    '#ffb2b9': '255, 178, 185',
    '#feeee1': '254, 238, 225',
    '#3f3f44': '63, 63, 68',
  }[glowColor.toLowerCase()] || '44, 169, 225';
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
  return opacities.reduce((vars, opacity, index) => {
    vars[`--glow-color${keys[index]}`] = `rgba(${glowRgb}, ${Math.min(opacity * intensity, 100) / 100})`;
    return vars;
  }, {});
}

const gradientPositions = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const gradientKeys = [
  '--gradient-one',
  '--gradient-two',
  '--gradient-three',
  '--gradient-four',
  '--gradient-five',
  '--gradient-six',
  '--gradient-seven',
];
const gradientColorMap = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors) {
  const vars = {};
  gradientKeys.forEach((key, index) => {
    const color = colors[Math.min(gradientColorMap[index], colors.length - 1)];
    vars[key] = `radial-gradient(at ${gradientPositions[index]}, ${color} 0, transparent 50%)`;
  });
  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

function easeOutCubic(x) {
  return 1 - (1 - x) ** 3;
}

function easeInCubic(x) {
  return x ** 3;
}

function animateValue({ start = 0, end = 100, duration = 1000, delay = 0, ease = easeOutCubic, onUpdate, onEnd }) {
  const t0 = performance.now() + delay;

  function tick() {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }

  window.setTimeout(() => requestAnimationFrame(tick), delay);
}

function BorderGlow({
  children,
  className = '',
  edgeSensitivity = 30,
  glowColor = '#2ca9e1',
  backgroundColor = 'rgba(63, 63, 68, 0.6)',
  borderRadius = 8,
  glowRadius = 34,
  glowIntensity = 1,
  coneSpread = 24,
  animated = false,
  colors = ['#2ca9e1', '#ffb2b9', '#feeee1'],
  fillOpacity = 0.3,
}) {
  const cardRef = useRef(null);

  const getCenterOfElement = useCallback((el) => {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }, []);

  const getEdgeProximity = useCallback((el, x, y) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }, [getCenterOfElement]);

  const getCursorAngle = useCallback((el, x, y) => {
    const [cx, cy] = getCenterOfElement(el);
    const dx = x - cx;
    const dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    const degrees = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    return degrees < 0 ? degrees + 360 : degrees;
  }, [getCenterOfElement]);

  const handlePointerMove = useCallback((event) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const edge = getEdgeProximity(card, x, y);
    const angle = getCursorAngle(card, x, y);

    card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
    card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
  }, [getCursorAngle, getEdgeProximity]);

  const handlePointerLeave = useCallback(() => {
    cardRef.current?.style.setProperty('--edge-proximity', '0');
  }, []);

  useEffect(() => {
    if (!animated || !cardRef.current) return undefined;

    const card = cardRef.current;
    const angleStart = 110;
    const angleEnd = 465;
    card.classList.add('sweep-active');
    card.style.setProperty('--cursor-angle', `${angleStart}deg`);

    animateValue({ duration: 500, onUpdate: (value) => card.style.setProperty('--edge-proximity', value) });
    animateValue({
      ease: easeInCubic,
      duration: 1500,
      end: 50,
      onUpdate: (value) => {
        card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`);
      },
    });
    animateValue({
      ease: easeOutCubic,
      delay: 1500,
      duration: 2250,
      start: 50,
      end: 100,
      onUpdate: (value) => {
        card.style.setProperty('--cursor-angle', `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`);
      },
    });
    animateValue({
      ease: easeInCubic,
      delay: 2500,
      duration: 1500,
      start: 100,
      end: 0,
      onUpdate: (value) => card.style.setProperty('--edge-proximity', value),
      onEnd: () => card.classList.remove('sweep-active'),
    });

    return undefined;
  }, [animated]);

  return (
    <div
      ref={cardRef}
      className={`border-glow-card ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        '--card-bg': backgroundColor,
        '--edge-sensitivity': edgeSensitivity,
        '--border-radius': `${borderRadius}px`,
        '--glow-padding': `${glowRadius}px`,
        '--cone-spread': coneSpread,
        '--fill-opacity': fillOpacity,
        ...buildGlowVars(glowColor, glowIntensity),
        ...buildGradientVars(colors),
      }}
    >
      <span className="edge-light" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}

function App() {
  useEffect(() => {
    const getRequestedTargetId = () => {
      const params = new URLSearchParams(window.location.search);
      return params.get('target') || (window.location.hash || '').replace('#', '');
    };

    const targetId = getRequestedTargetId();
    if (!targetId) return undefined;

    const alignRequestedSection = () => {
      const target = document.getElementById(targetId);
      if (!target) return;
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
      if (window.location.search.includes('target=')) {
        window.history.replaceState(null, '', `#${targetId}`);
      }
    };

    const timers = [];
    const scheduleAlignment = () => {
      [0, 120, 520, 1200].forEach((delay) => {
        timers.push(window.setTimeout(alignRequestedSection, delay));
      });
    };

    const frameId = window.requestAnimationFrame(alignRequestedSection);
    if (document.readyState === 'complete') {
      scheduleAlignment();
    } else {
      window.addEventListener('load', scheduleAlignment, { once: true });
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('load', scheduleAlignment);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <>
      <TargetCursor />
      <MotionSystem />
      <main className="site-shell">
        <OpeningCurtain />
        <SiteNav />
        <Hero />
        <div className="post-hero-stage">
          <PixelBlastBackdrop />
          <About />
          <FeaturedProjects />
          <Strengths />
          <ContactClosing />
        </div>
      </main>
    </>
  );
}

function OpeningCurtain() {
  return (
    <div className="opening-curtain" aria-hidden="true">
      <span className="opening-panel" />
      <span className="opening-panel" />
      <span className="opening-panel" />
      <span className="opening-panel" />
    </div>
  );
}

function MotionSystem() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    root.classList.add('motion-enabled');

    if (prefersReducedMotion) {
      root.classList.add('motion-complete');
      return () => {
        root.classList.remove('motion-enabled', 'motion-complete');
      };
    }

    const ctx = gsap.context(() => {
      gsap.defaults({ force3D: true });

      const opening = gsap.timeline({
        defaults: { ease: 'power4.out' },
        onComplete: () => {
          root.classList.add('motion-complete');
          ScrollTrigger.refresh();
        },
      });

      gsap.set('.opening-curtain', { autoAlpha: 1 });
      gsap.set('.opening-panel', { scaleX: 1, transformOrigin: 'left center' });
      gsap.set('.nav', { autoAlpha: 0, y: -28 });
      gsap.set('.hero-title span', {
        clipPath: 'inset(0 100% 0 0)',
        xPercent: -8,
        yPercent: 18,
        scaleX: 0.72,
        transformOrigin: 'left center',
      });
      gsap.set('.hero .eyebrow, .hero-subtitle, .hero-actions, .scroll-indicator', {
        autoAlpha: 0,
        y: 42,
      });
      gsap.set('.rabbit-figure', {
        autoAlpha: 0,
        y: 90,
        rotate: -10,
        scale: 0.86,
      });

      opening
        .to('.opening-panel', {
          scaleX: 0,
          duration: 1.08,
          stagger: { each: 0.13, from: 'end' },
          ease: 'expo.inOut',
        })
        .to('.hero-title span', {
          clipPath: 'inset(0 0% 0 0)',
          xPercent: 0,
          yPercent: 0,
          scaleX: 1,
          duration: 1.42,
          stagger: 0.16,
          ease: 'expo.out',
        }, 0.34)
        .to('.nav', { autoAlpha: 1, y: 0, duration: 0.9 }, 0.72)
        .to('.hero .eyebrow', { autoAlpha: 1, y: 0, duration: 0.85 }, 0.92)
        .to('.hero-subtitle', { autoAlpha: 1, y: 0, duration: 1.05 }, 1.02)
        .to('.hero-actions', { autoAlpha: 1, y: 0, duration: 0.9 }, 1.18)
        .to('.rabbit-figure', {
          autoAlpha: 1,
          y: 0,
          rotate: -2,
          scale: 1,
          duration: 1.35,
          ease: 'expo.out',
        }, 0.98)
        .to('.scroll-indicator', { autoAlpha: 1, y: 0, duration: 0.75 }, 1.74)
        .to('.opening-curtain', { autoAlpha: 0, duration: 0.45, pointerEvents: 'none' }, 1.9);

      const sections = gsap.utils.toArray('.post-hero-stage > .section, .post-hero-stage > .closing');

      sections.forEach((section) => {
        const heading = section.querySelector('.about-copy h2, .section-heading h2, .closing h2');
        const kicker = section.querySelector('.about-copy .section-kicker, .section-heading .section-kicker, .closing-copy .section-kicker');
        const items = section.querySelectorAll([
          '.about-tabs span',
          '.about-copy p:not(.section-kicker)',
          '.about-actions',
          '.portrait-wrap',
          '.contact-lines > *',
          '.metric',
          '.project-glow-card',
          '.strength-glow-card',
          '.contact-blocks > *',
        ].join(','));

        if (kicker) {
          gsap.fromTo(kicker,
            { autoAlpha: 0, y: 26, clipPath: 'inset(0 0 100% 0)' },
            {
              autoAlpha: 1,
              y: 0,
              clipPath: 'inset(0 0 0% 0)',
              duration: 0.95,
              ease: 'power4.out',
              scrollTrigger: { trigger: section, start: 'top 74%', once: true },
            });
        }

        if (heading) {
          gsap.fromTo(heading,
            {
              autoAlpha: 0,
              y: 150,
              scale: 0.86,
              clipPath: 'inset(0 0 100% 0)',
              transformOrigin: 'left bottom',
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clipPath: 'inset(0 0 0% 0)',
              duration: 1.28,
              ease: 'expo.out',
              scrollTrigger: { trigger: section, start: 'top 70%', once: true },
            });
        }

        if (items.length) {
          gsap.fromTo(items,
            {
              autoAlpha: 0,
              y: 78,
              scale: 0.94,
              clipPath: 'inset(14% 0 0 0)',
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clipPath: 'inset(0% 0 0 0)',
              duration: 1.12,
              ease: 'power4.out',
              stagger: { each: 0.12, from: 'start' },
              scrollTrigger: { trigger: section, start: 'top 66%', once: true },
            });
        }
      });

      gsap.utils.toArray('.project-card').forEach((card) => {
        const image = card.querySelector('img');
        const info = card.querySelectorAll('.project-info > *');

        if (image) {
          gsap.fromTo(image,
            {
              scale: 1.22,
              yPercent: -6,
              filter: 'saturate(0.78) contrast(0.92)',
              clipPath: 'inset(0 0 100% 0)',
            },
            {
              scale: 1.05,
              yPercent: 0,
              filter: 'saturate(1) contrast(1)',
              clipPath: 'inset(0 0 0% 0)',
              duration: 1.45,
              ease: 'expo.out',
              scrollTrigger: { trigger: card, start: 'top 82%', once: true },
            });

          gsap.to(image, {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          });
        }

        if (info.length) {
          gsap.fromTo(info,
            { autoAlpha: 0, y: 34, clipPath: 'inset(0 0 100% 0)' },
            {
              autoAlpha: 1,
              y: 0,
              clipPath: 'inset(0 0 0% 0)',
              duration: 0.85,
              ease: 'power4.out',
              stagger: 0.08,
              scrollTrigger: { trigger: card, start: 'top 76%', once: true },
            });
        }
      });

      gsap.utils.toArray('.portrait-wrap img').forEach((image) => {
        const trigger = image.closest('.portrait-wrap');
        gsap.fromTo(image,
          { scale: 1.16, yPercent: -5, clipPath: 'inset(0 0 100% 0)' },
          {
            scale: 1.04,
            yPercent: 0,
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.45,
            ease: 'expo.out',
            scrollTrigger: { trigger, start: 'top 78%', once: true },
          });
        gsap.to(image, {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: {
            trigger,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.35,
          },
        });
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      root.classList.remove('motion-enabled', 'motion-complete');
    };
  }, []);

  return null;
}

function SiteNav() {
  const [isNavFloating, setIsNavFloating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavFloating(window.scrollY >= window.innerHeight - 96);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setIsMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`nav${isNavFloating ? ' is-floating' : ''}${isMenuOpen ? ' is-open' : ''}`}>
      <a className="brand cursor-target" href="#home" aria-label="回到首页" onClick={closeMenu}>
        <span>Yinuo Wang</span>
      </a>
      <button
        className="nav-toggle cursor-target"
        type="button"
        aria-label={isMenuOpen ? '收起导航菜单' : '展开导航菜单'}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <div className="nav-menu">
        <nav className="nav-links" aria-label="页面导航">
          <a className="cursor-target" href="#about" onClick={closeMenu}>关于</a>
          <a className="cursor-target" href="#projects" onClick={closeMenu}>项目</a>
          <a className="cursor-target" href="#strengths" onClick={closeMenu}>优势</a>
          <a className="cursor-target" href="#contact" onClick={closeMenu}>联系</a>
        </nav>
        <a className="nav-contact cursor-target" href={`mailto:${contacts.email}`} onClick={closeMenu}>
          <Mail size={18} />
          联系我
        </a>
      </div>
    </header>
  );
}

function TargetCursor() {
  const cursorRef = useRef(null);
  const cornersRef = useRef([]);

  useEffect(() => {
    const cursor = cursorRef.current;
    const corners = cornersRef.current;
    const isCoarsePointer =
      window.matchMedia?.('(pointer: coarse)').matches ||
      window.matchMedia?.('(hover: none)').matches ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 900;

    if (!cursor || isCoarsePointer) return undefined;

    const defaultColor = '#ffb2b9';
    const targetColor = '#2ca9e1';
    const cornerSize = 12;
    const borderWidth = 3;
    const idlePositions = [
      { x: -18, y: -18 },
      { x: 6, y: -18 },
      { x: 6, y: 6 },
      { x: -18, y: 6 },
    ];

    let activeTarget = null;
    let isPressed = false;
    let idleRotation = 0;
    let lastFrameTime = performance.now();
    let frameId = 0;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const position = { x: mouse.x, y: mouse.y };

    const setCorners = (positions) => {
      corners.forEach((corner, index) => {
        const point = positions[index];
        corner.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;
      });
    };

    const resetTarget = () => {
      activeTarget = null;
      cursor.classList.remove('is-targeting');
      setCorners(idlePositions);
    };

    const syncTargetFromPoint = () => {
      const element = document.elementFromPoint(mouse.x, mouse.y);
      const target = element?.closest?.('.cursor-target') || null;
      if (target === activeTarget) return;

      if (target) {
        activeTarget = target;
        cursor.classList.add('is-targeting');
      } else {
        resetTarget();
      }
    };

    const animate = (timeStamp = performance.now()) => {
      const delta = Math.min(48, timeStamp - lastFrameTime);
      lastFrameTime = timeStamp;
      if (!activeTarget) idleRotation = (idleRotation + delta * 0.18) % 360;

      position.x += (mouse.x - position.x) * 0.22;
      position.y += (mouse.y - position.y) * 0.22;
      const scale = isPressed ? 0.9 : 1;
      const rotation = activeTarget ? 0 : idleRotation;
      cursor.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;

      if (activeTarget && !activeTarget.isConnected) {
        resetTarget();
      }

      if (activeTarget?.isConnected) {
        const rect = activeTarget.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;

        if (isVisible) {
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const parallaxX = (mouse.x - centerX) * 0.035;
          const parallaxY = (mouse.y - centerY) * 0.035;

          setCorners([
            {
              x: rect.left - borderWidth - position.x - parallaxX,
              y: rect.top - borderWidth - position.y - parallaxY,
            },
            {
              x: rect.right + borderWidth - cornerSize - position.x + parallaxX,
              y: rect.top - borderWidth - position.y - parallaxY,
            },
            {
              x: rect.right + borderWidth - cornerSize - position.x + parallaxX,
              y: rect.bottom + borderWidth - cornerSize - position.y + parallaxY,
            },
            {
              x: rect.left - borderWidth - position.x - parallaxX,
              y: rect.bottom + borderWidth - cornerSize - position.y + parallaxY,
            },
          ]);
        }
      }

      frameId = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      syncTargetFromPoint();
    };

    const handlePointerDown = () => {
      isPressed = true;
      cursor.classList.add('is-pressed');
    };

    const handlePointerUp = () => {
      isPressed = false;
      cursor.classList.remove('is-pressed');
    };

    setCorners(idlePositions);
    document.body.classList.add('target-cursor-active');
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('scroll', syncTargetFromPoint, { passive: true });
    window.addEventListener('resize', syncTargetFromPoint);
    window.addEventListener('blur', resetTarget);
    frameId = window.requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove('target-cursor-active');
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('scroll', syncTargetFromPoint);
      window.removeEventListener('resize', syncTargetFromPoint);
      window.removeEventListener('blur', resetTarget);
    };
  }, []);

  return (
    <div className="target-cursor-wrapper" ref={cursorRef} aria-hidden="true">
      <span className="target-cursor-dot" />
      {['tl', 'tr', 'br', 'bl'].map((corner, index) => (
        <span
          className={`target-cursor-corner corner-${corner}`}
          key={corner}
          ref={(element) => {
            if (element) cornersRef.current[index] = element;
          }}
        />
      ))}
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-gradient" aria-hidden="true">
        <span className="cloud cloud-a" />
        <span className="cloud cloud-b" />
        <span className="cloud cloud-c" />
        <span className="hero-orbit orbit-a" />
        <span className="hero-orbit orbit-b" />
      </div>
      <div className="hero-stage">
        <h1 className="hero-title" aria-label="Yinuo Wang">
          <span>YINUO</span>
          <span>WANG</span>
        </h1>

        <div className="hero-lower">
          <div className="hero-content">
            <p className="eyebrow">
              <Sparkles size={18} />
              Visual Designer / AI Designer / C4D Renderer
            </p>
            <p className="hero-subtitle">王熠诺 / 把产品、品牌与数字场景做得更有光感。</p>
            <div className="hero-actions">
              <a className="primary-action cursor-target" href="#projects">
                查看项目
                <ArrowDownRight size={20} />
              </a>
              <a className="secondary-action cursor-target" href={`tel:${contacts.phone}`}>
                <Phone size={18} />
                {contacts.phone}
              </a>
            </div>
          </div>

          <div className="rabbit-figure" aria-hidden="true">
            <span className="rabbit-shadow" />
            <span className="rabbit-ear rabbit-ear-left" />
            <span className="rabbit-ear rabbit-ear-right" />
            <span className="rabbit-head" />
            <span className="rabbit-body" />
            <span className="rabbit-tail" />
            <span className="rabbit-eye" />
            <span className="rabbit-cheek" />
            <span className="rabbit-spark rabbit-spark-a" />
            <span className="rabbit-spark rabbit-spark-b" />
          </div>
        </div>
      </div>

      <a className="scroll-indicator cursor-target" href="#about" aria-label="向下滚动到关于模块">
        <span />
      </a>
    </section>
  );
}

function PixelBlastBackdrop() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.closest('.post-hero-stage');
    const context = canvas?.getContext('2d');

    if (!canvas || !stage || !context) return undefined;

    let frameId = 0;
    let dpr = 1;
    let width = 1;
    let height = 1;
    const ripples = [];
    const colors = ['44, 169, 225'];

    const hash = (x, y) => {
      const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
      return value - Math.floor(value);
    };

    const blob = (x, y, cx, cy, radius) => {
      const dx = x - cx;
      const dy = y - cy;
      return Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / radius);
    };

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.35);
      width = Math.max(1, Math.floor(rect.width * dpr));
      height = Math.max(1, Math.floor(stage.scrollHeight * dpr));
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${stage.scrollHeight}px`;
    };

    const draw = (timeStamp = 0) => {
      const time = timeStamp * 0.001;
      const step = 18 * dpr;
      const cols = Math.ceil(width / step);
      const rows = Math.ceil(height / step);

      context.clearRect(0, 0, width, height);

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          const px = x * step + step * 0.5;
          const py = y * step + step * 0.5;
          const nx = px / width;
          const ny = py / height;
          const drift = Math.sin(time * 0.42 + nx * 9.2 + ny * 15.5) * 0.12;
          const noise = hash(x + Math.floor(time * 0.35), y);
          let field =
            blob(nx, ny, 0.16, 0.09, 0.24) * 0.58 +
            blob(nx, ny, 0.88, 0.18, 0.28) * 0.5 +
            blob(nx, ny, 0.28, 0.45, 0.24) * 0.38 +
            blob(nx, ny, 0.76, 0.64, 0.32) * 0.46 +
            blob(nx, ny, 0.5, 0.88, 0.38) * 0.36 +
            drift;

          for (let i = ripples.length - 1; i >= 0; i -= 1) {
            const ripple = ripples[i];
            const age = time - ripple.start;
            if (age > 2.6) {
              ripples.splice(i, 1);
              continue;
            }

            const distance = Math.hypot(px - ripple.x, py - ripple.y);
            const ring = Math.exp(-((distance - age * 270 * dpr) ** 2) / (1800 * dpr));
            field += ring * (1 - age / 2.6) * 1.12;
          }

          if (field + noise * 0.42 < 0.52) continue;

          const jitter = 0.74 + noise * 0.86;
          const size = Math.max(2.2 * dpr, Math.min(step * 0.64, step * 0.3 * jitter * field));
          const color = colors[Math.floor(noise * colors.length) % colors.length];
          const alpha = Math.min(0.68, 0.16 + field * 0.38 + noise * 0.12);

          context.fillStyle = `rgba(${color}, ${alpha})`;
          context.beginPath();
          context.arc(px, py, size, 0, Math.PI * 2);
          context.fill();
        }
      }

      frameId = window.requestAnimationFrame(draw);
    };

    const addRipple = (event) => {
      const rect = stage.getBoundingClientRect();
      const localY = event.clientY - rect.top;
      const localX = event.clientX - rect.left;

      if (localX < 0 || localX > rect.width || localY < 0 || localY > stage.scrollHeight) return;

      ripples.push({
        x: localX * dpr,
        y: localY * dpr,
        start: performance.now() * 0.001,
      });

      if (ripples.length > 8) ripples.shift();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resize();
    frameId = window.requestAnimationFrame(draw);
    window.addEventListener('pointerdown', addRipple, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('pointerdown', addRipple);
    };
  }, []);

  return (
    <div className="post-hero-pixel-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="pixel-blast-canvas" />
    </div>
  );
}

function About() {
  return (
    <section className="section about-section" id="about">
      <div className="about-tabs" aria-label="个人分类">
        <span>
          Personal <strong>26</strong>
        </span>
        <span>
          AI Visual <strong>40</strong>
        </span>
        <span>
          Commercial <strong>100+</strong>
        </span>
      </div>

      <div className="about-marquee" aria-hidden="true">
        <span>Beyond template. ✦ Born to Render. ✦ Non Conventional. ✦ Brand Visual Approach.</span>
      </div>

      <div className="section-inner about-editorial">
        <div className="about-copy">
          <p className="section-kicker">• Designer Profile</p>
          <h2>
            I bring clarity and glow
            <br />
            to every visual story
          </h2>
          <p>
            我关注产品在数字环境中的质感表达，也关注品牌视觉在不同触点里的统一性。学习和项目经历横跨动画、三维建模、交互场景、电商渲染与行政协作，能从创意、建模、灯光材质到输出规范形成完整交付链路。
          </p>
          <div className="about-actions">
            <a className="primary-action about-cta cursor-target" href="#projects">
              View Project
              <ArrowDownRight size={20} />
            </a>
            <div className="about-meta">
              <span>2026 Portfolio</span>
              <i />
              <span>Visual / AI / Render</span>
            </div>
          </div>
        </div>

        <div className="portrait-wrap">
          <img src={asset('assets/profile-editorial.jpg')} alt="王熠诺个人形象照" />
          <div className="portrait-label">
            <BadgeCheck size={18} />
            澳门理工大学硕士在读
          </div>
          <div className="portrait-badge">Drag to view more</div>
        </div>

        <div className="contact-lines">
          <a className="cursor-target" href={`tel:${contacts.phone}`}>
            <Phone size={18} />
            {contacts.phone}
          </a>
          <a className="cursor-target" href={`mailto:${contacts.email}`}>
            <Mail size={18} />
            {contacts.email}
          </a>
          <span>
            <MapPin size={18} />
            {contacts.location}
          </span>
        </div>

        <div className="metric-panel" aria-label="项目数据">
          {metrics.map((item) => (
            <div className="metric" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProjects() {
  return (
    <section className="section projects-section" id="projects">
      <div className="section-inner">
        <div className="section-heading wide">
          <div>
            <p className="section-kicker">Selected Projects</p>
            <h2>精选项目</h2>
          </div>
          <p>
            首版先以简历中的经历搭建项目叙事和视觉节奏。作品图片当前为可替换占位图，后续可按真实项目截图继续强化。
          </p>
        </div>

        <div className="project-grid">
          {projects.map((project, index) => (
            <BorderGlow
              className="project-glow-card cursor-target"
              key={project.title}
              edgeSensitivity={24}
              glowColor={index === 0 ? '#2ca9e1' : '#ffb2b9'}
              backgroundColor="rgba(63, 63, 68, 0.6)"
              glowRadius={38}
              glowIntensity={0.95}
              coneSpread={24}
              animated={index === 0}
              colors={index === 0 ? ['#2ca9e1', '#ffb2b9', '#feeee1'] : ['#ffb2b9', '#2ca9e1', '#3f3f44']}
              fillOpacity={0.26}
            >
              {project.href ? (
                <a className="project-card project-card-link" href={project.href}>
                  <img src={project.image} alt={project.title} />
                  <div className="project-info">
                    <p>{project.category}</p>
                    <h3>{project.title}</h3>
                    <span>{project.summary}</span>
                    <div className="project-meta">
                      <strong>{project.stats}</strong>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </a>
              ) : (
                <article className="project-card">
                  <img src={project.image} alt={project.title} />
                  <div className="project-info">
                    <p>{project.category}</p>
                    <h3>{project.title}</h3>
                    <span>{project.summary}</span>
                    <div className="project-meta">
                      <strong>{project.stats}</strong>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </article>
              )}
            </BorderGlow>
          ))}
        </div>
        <div className="project-more-row">
          <a className="other-projects-cta cursor-target" href={asset('other-projects.html')}>
            其他项目
            <ChevronRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}

function Strengths() {
  return (
    <section className="section strengths-section" id="strengths">
      <div className="section-inner">
        <div className="section-heading">
          <p className="section-kicker">Capabilities</p>
          <h2>个人优势</h2>
        </div>

        <div className="strength-grid">
          {strengths.map((item, index) => (
            <BorderGlow
              className="strength-glow-card cursor-target"
              key={item.title}
              edgeSensitivity={28}
              glowColor={index % 2 === 0 ? '#2ca9e1' : '#ffb2b9'}
              backgroundColor="rgba(63, 63, 68, 0.6)"
              glowRadius={30}
              glowIntensity={0.8}
              coneSpread={22}
              animated={index === 0}
              colors={index % 2 === 0 ? ['#2ca9e1', '#ffb2b9', '#feeee1'] : ['#ffb2b9', '#3f3f44', '#2ca9e1']}
              fillOpacity={0.3}
            >
              <article className="strength-card">
                <div className="strength-top">
                  <div className="strength-icon">{item.icon}</div>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactClosing() {
  return (
    <section className="closing" id="contact">
      <div className="closing-inner">
        <div className="closing-copy">
          <p className="section-kicker">Contact</p>
          <h2>期待一起完成更明亮、更有质感的视觉项目。</h2>
        </div>
        <div className="contact-blocks">
          <a className="cursor-target" href={`mailto:${contacts.email}`}>
            <Mail size={24} />
            <span>Email</span>
            <strong>{contacts.email}</strong>
          </a>
          <a className="cursor-target" href={`tel:${contacts.phone}`}>
            <Phone size={24} />
            <span>Phone</span>
            <strong>{contacts.phone}</strong>
          </a>
          <div className="cursor-target">
            <Camera size={24} />
            <span>Direction</span>
            <strong>C4D / Visual / AI / Brand</strong>
          </div>
          <div className="cursor-target">
            <Boxes size={24} />
            <span>Base</span>
            <strong>{contacts.location}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
