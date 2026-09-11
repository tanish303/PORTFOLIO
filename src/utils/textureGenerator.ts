import * as THREE from 'three';

const textureCache: Record<string, THREE.CanvasTexture> = {};

export function getProceduralTexture(type: string): THREE.CanvasTexture {
  if (textureCache[type]) {
    return textureCache[type];
  }

  const canvas = document.createElement('canvas');
  if (type === 'saturn_rings') {
    canvas.width = 1024;
    canvas.height = 1024;
  } else {
    // High-definition 2048x1024 texture map for crisp, recognizable planetary surface details
    canvas.width = 2048;
    canvas.height = 1024;
  }
  const ctx = canvas.getContext('2d')!;

  switch (type) {
    case 'sun':
      drawRealisticSun(ctx, canvas.width, canvas.height);
      break;
    case 'mercury':
      drawRealisticMercury(ctx, canvas.width, canvas.height);
      break;
    case 'venus':
      drawRealisticVenus(ctx, canvas.width, canvas.height);
      break;
    case 'earth':
      drawRealisticEarth(ctx, canvas.width, canvas.height);
      break;
    case 'earth_specular':
      drawEarthSpecular(ctx, canvas.width, canvas.height);
      break;
    case 'clouds':
      drawRealisticClouds(ctx, canvas.width, canvas.height);
      break;
    case 'mars':
      drawRealisticMars(ctx, canvas.width, canvas.height);
      break;
    case 'jupiter':
      drawRealisticJupiter(ctx, canvas.width, canvas.height);
      break;
    case 'saturn':
      drawRealisticSaturn(ctx, canvas.width, canvas.height);
      break;
    case 'saturn_rings':
      drawRealisticSaturnRings(ctx, canvas.width, canvas.height);
      break;
    case 'uranus':
      drawRealisticUranus(ctx, canvas.width, canvas.height);
      break;
    case 'neptune':
      drawRealisticNeptune(ctx, canvas.width, canvas.height);
      break;
    default:
      drawDefaultTexture(ctx, canvas.width, canvas.height);
      break;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  textureCache[type] = texture;
  return texture;
}

// ☀️ REALISTIC SUN: Convective granulation cells, solar flare filaments, and sunspot magnetic complexes
function drawRealisticSun(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Radiant fiery gradient
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#ea580c');
  bg.addColorStop(0.2, '#f97316');
  bg.addColorStop(0.5, '#fb923c');
  bg.addColorStop(0.8, '#f97316');
  bg.addColorStop(1, '#ea580c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // High-density solar granulation network (photosphere convection cells)
  for (let i = 0; i < 400; i++) {
    const cx = (i * 137.5) % w;
    const cy = (i * 79.7) % h;
    const rad = 10 + (i % 9) * 8;

    const g = ctx.createRadialGradient(cx, cy, 1, cx, cy, rad);
    g.addColorStop(0, '#fef9c3'); // Brilliant incandescent white/yellow
    g.addColorStop(0.4, '#fde047');
    g.addColorStop(0.8, '#f97316');
    g.addColorStop(1, 'rgba(234, 88, 12, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Solar magnetic filaments and prominence arches
  ctx.strokeStyle = '#fdba74';
  ctx.lineWidth = 2.5;
  for (let f = 0; f < 30; f++) {
    const fx = (f * 149) % w;
    const fy = 150 + (f * 43) % (h - 300);
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.quadraticCurveTo(fx + 60, fy - 35, fx + 120, fy);
    ctx.stroke();
  }

  // Active sunspot clusters with dark umbra and cooler penumbra
  for (let s = 0; s < 16; s++) {
    const sx = ((s * 211) % (w * 0.85)) + w * 0.08;
    const sy = ((s * 101) % (h * 0.5)) + h * 0.25;
    const spotRadius = 12 + (s % 4) * 6;

    // Penumbra (brownish halo)
    const penGrad = ctx.createRadialGradient(sx, sy, 3, sx, sy, spotRadius);
    penGrad.addColorStop(0, '#78350f');
    penGrad.addColorStop(0.7, '#9a3412');
    penGrad.addColorStop(1, 'rgba(154, 52, 18, 0)');
    ctx.fillStyle = penGrad;
    ctx.beginPath();
    ctx.arc(sx, sy, spotRadius, 0, Math.PI * 2);
    ctx.fill();

    // Deep black-brown umbra core
    ctx.fillStyle = '#290f05';
    ctx.beginPath();
    ctx.arc(sx, sy, spotRadius * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 🟤 REALISTIC MERCURY: Airless basalt rock, impact basins, and crater rays
function drawRealisticMercury(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#334155');
  bg.addColorStop(0.5, '#475569');
  bg.addColorStop(1, '#1e293b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Large smooth volcanic plains (inter-crater basalt plains)
  ctx.fillStyle = '#1e293b';
  for (let b = 0; b < 24; b++) {
    const bx = (b * 193) % w;
    const by = (b * 107) % h;
    ctx.beginPath();
    ctx.arc(bx, by, 70 + (b % 4) * 45, 0, Math.PI * 2);
    ctx.fill();
  }

  // Caloris Basin style concentric multi-ring impact
  const basinX = w * 0.35;
  const basinY = h * 0.45;
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(basinX, basinY, 110, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(basinX, basinY, 65, 0, Math.PI * 2);
  ctx.stroke();

  // Dense distribution of impact craters across the globe
  for (let i = 0; i < 220; i++) {
    const cx = (i * 127) % w;
    const cy = (i * 73) % h;
    const r = 5 + (i % 10) * 5;

    // Dark crater bowl shadow
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Illuminated crater rim (sunlight coming from left)
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI * 0.35, Math.PI * 0.65);
    ctx.stroke();

    // High-albedo ray systems for prominent young craters
    if (i % 9 === 0) {
      ctx.strokeStyle = 'rgba(241, 245, 249, 0.45)';
      ctx.lineWidth = 1.2;
      for (let ray = 0; ray < 8; ray++) {
        const angle = ray * (Math.PI / 4) + (i * 0.2);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
        ctx.lineTo(cx + Math.cos(angle) * (r * 4.5), cy + Math.sin(angle) * (r * 4.5));
        ctx.stroke();
      }
    }
  }
}

// 🟡 REALISTIC VENUS: Dense, opaque swirling sulfuric acid clouds with chevron atmospheric wave patterns
function drawRealisticVenus(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#fef9c3'); // Pale creamy butter yellow
  bg.addColorStop(0.3, '#fef08a');
  bg.addColorStop(0.5, '#facc15'); // Warm sulfuric ochre
  bg.addColorStop(0.7, '#fef08a');
  bg.addColorStop(1, '#fef9c3');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Planetary chevron UV wave bands (flowing from equator toward poles)
  for (let y = 0; y < h; y += 12) {
    const opacity = (Math.sin(y * 0.04) + 1) * 0.15;
    ctx.fillStyle = `rgba(180, 120, 20, ${opacity})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= w; x += 30) {
      // V-shaped chevron wave distortion
      const distFromCenter = Math.abs(x - w * 0.5) / (w * 0.5);
      const wave = Math.sin(x * 0.015) * 14 + (distFromCenter * 20);
      ctx.lineTo(x, y + wave);
    }
    ctx.lineTo(w, y + 15);
    ctx.lineTo(0, y + 15);
    ctx.closePath();
    ctx.fill();
  }

  // Smooth atmospheric cloud swirls
  for (let s = 0; s < 60; s++) {
    const cx = (s * 163) % w;
    const cy = 60 + (s * 41) % (h - 120);
    const rad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 90);
    rad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    rad.addColorStop(0.6, 'rgba(234, 179, 8, 0.2)');
    rad.addColorStop(1, 'rgba(234, 179, 8, 0)');
    ctx.fillStyle = rad;
    ctx.beginPath();
    ctx.arc(cx, cy, 90, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 🌍 REALISTIC EARTH: Recognizable Americas, Eurasia, Africa, Australia continents + deep oceans
function drawRealisticEarth(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Deep ocean gradient with continental shelf shallows
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
  oceanGrad.addColorStop(0, '#0a2342'); // Arctic Ocean
  oceanGrad.addColorStop(0.45, '#0c4a6e'); // Mid-Atlantic Blue
  oceanGrad.addColorStop(0.55, '#0369a1');
  oceanGrad.addColorStop(1, '#082f49'); // Southern Ocean
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, w, h);

  // Shallow turquoise continental shelves (Caribbean, South China Sea, Mediterranean)
  ctx.fillStyle = '#0284c7';
  for (let s = 0; s < 70; s++) {
    const sx = (s * 131) % w;
    const sy = ((s * 89) % (h * 0.7)) + h * 0.15;
    ctx.beginPath();
    ctx.arc(sx, sy, 45 + (s % 5) * 20, 0, Math.PI * 2);
    ctx.fill();
  }

  // Landmasses: Detailed continent shapes
  // 1. North & South America (Left hemisphere: X ~ 0.15 to 0.45)
  ctx.fillStyle = '#166534'; // Lush green forest/grassland
  drawContinentMass(ctx, w * 0.26, h * 0.32, 110, 80); // North America
  drawContinentMass(ctx, w * 0.34, h * 0.65, 80, 110);  // South America
  drawContinentMass(ctx, w * 0.28, h * 0.48, 30, 20);   // Central America isthmus

  // 2. Eurasia & Africa (Center/Right hemisphere: X ~ 0.50 to 0.85)
  drawContinentMass(ctx, w * 0.56, h * 0.28, 85, 60);  // Europe
  drawContinentMass(ctx, w * 0.72, h * 0.30, 140, 90); // Asia / Siberia
  drawContinentMass(ctx, w * 0.78, h * 0.44, 70, 50);  // India & Southeast Asia
  drawContinentMass(ctx, w * 0.58, h * 0.55, 100, 120);// Africa
  drawContinentMass(ctx, w * 0.84, h * 0.72, 75, 55);  // Australia

  // Deserts & arid terrain (Sahara, Arabian Peninsula, Australian Outback, Gobi)
  ctx.fillStyle = '#b45309';
  drawContinentMass(ctx, w * 0.57, h * 0.45, 80, 45); // Sahara Desert
  drawContinentMass(ctx, w * 0.64, h * 0.42, 45, 30); // Arabian Desert
  drawContinentMass(ctx, w * 0.74, h * 0.33, 60, 30); // Gobi Desert
  drawContinentMass(ctx, w * 0.83, h * 0.72, 50, 35); // Australian Outback

  // Mountain ranges (Rockies, Andes, Alps, Himalayas)
  ctx.fillStyle = '#78350f';
  for (let m = 0; m < 35; m++) {
    const mx = ((m * 181) % (w * 0.8)) + w * 0.1;
    const my = ((m * 97) % (h * 0.5)) + h * 0.25;
    ctx.beginPath();
    ctx.arc(mx, my, 16 + (m % 4) * 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Polar Ice Caps (Greenland, Arctic, Antarctica)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, w, h * 0.09); // North Polar Sea Ice
  ctx.fillRect(0, h * 0.90, w, h * 0.10); // Antarctica

  // Greenland
  drawContinentMass(ctx, w * 0.38, h * 0.16, 50, 40);

  // Jagged ice coastline
  for (let x = 0; x < w; x += 16) {
    const topH = h * 0.09 + Math.sin(x * 0.05) * 12;
    const botH = h * 0.90 - Math.cos(x * 0.04) * 14;
    ctx.fillRect(x, 0, 18, topH);
    ctx.fillRect(x, botH, 18, h - botH);
  }
}

function drawContinentMass(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Secondary organic sub-lobes for realistic jagged coastlines
  for (let i = 0; i < 6; i++) {
    const angle = i * 1.05;
    const ox = cx + Math.cos(angle) * (rx * 0.7);
    const oy = cy + Math.sin(angle) * (ry * 0.7);
    ctx.beginPath();
    ctx.ellipse(ox, oy, rx * 0.5, ry * 0.5, angle, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 🌍 EARTH SPECULAR MASK (Oceans are glossy reflective, land is matte)
function drawEarthSpecular(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // White for shiny oceans
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  // Black for non-reflective landmasses
  ctx.fillStyle = '#000000';
  for (let i = 0; i < 70; i++) {
    const cx = (i * 127) % w;
    const cy = ((i * 83) % (h * 0.7)) + h * 0.15;
    ctx.beginPath();
    ctx.arc(cx, cy, 45 + (i % 6) * 20, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ☁️ REALISTIC EARTH CLOUDS: Cyclonic storm swirls, trade-wind cloud bands, ITCZ
function drawRealisticClouds(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';

  // Intertropical Convergence Zone (ITCZ) equatorial cloud belt
  for (let x = 0; x < w; x += 40) {
    const y = h * 0.5 + Math.sin(x * 0.02) * 20;
    ctx.beginPath();
    ctx.ellipse(x, y, 50, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Mid-latitude swirling storm systems (cyclones)
  for (let c = 0; c < 35; c++) {
    const cx = (c * 179) % w;
    const cy = ((c * 97) % (h * 0.65)) + h * 0.15;
    const r = 40 + (c % 5) * 25;

    // Spiral cloud arms
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 1.5);
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.7, r * 0.35, Math.sin(c) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 🔴 REALISTIC MARS: Dusty reddish/orange oxidized iron surface, dark basalt maria, white polar ice cap
function drawRealisticMars(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#991b1b');
  bg.addColorStop(0.3, '#c2410c'); // Classic oxidized ferric rust
  bg.addColorStop(0.7, '#ea580c');
  bg.addColorStop(1, '#7f1d1d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Dark volcanic basalt regions (Syrtis Major, Acidalia Planitia, Mare Erythraeum)
  ctx.fillStyle = '#431407'; // Deep dark basalt brown
  // Syrtis Major triangle
  ctx.beginPath();
  ctx.moveTo(w * 0.45, h * 0.38);
  ctx.lineTo(w * 0.55, h * 0.52);
  ctx.lineTo(w * 0.40, h * 0.60);
  ctx.closePath();
  ctx.fill();

  // Acidalia & Southern Maria
  for (let m = 0; m < 25; m++) {
    const mx = (m * 167) % w;
    const my = ((m * 89) % (h * 0.6)) + h * 0.2;
    ctx.beginPath();
    ctx.ellipse(mx, my, 50 + (m % 4) * 25, 30 + (m % 3) * 15, Math.sin(m) * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Valles Marineris canyon grand rift
  ctx.strokeStyle = '#270804';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(w * 0.18, h * 0.53);
  ctx.bezierCurveTo(w * 0.35, h * 0.56, w * 0.50, h * 0.51, w * 0.68, h * 0.55);
  ctx.stroke();

  // Olympus Mons & Tharsis volcanic shields
  ctx.fillStyle = '#7c2d12';
  ctx.beginPath();
  ctx.arc(w * 0.22, h * 0.42, 35, 0, Math.PI * 2); // Olympus Mons
  ctx.fill();
  ctx.fillStyle = '#fca5a5'; // Caldera summit
  ctx.beginPath();
  ctx.arc(w * 0.22, h * 0.42, 8, 0, Math.PI * 2);
  ctx.fill();

  // Brilliant North & South Polar Ice Caps (CO2 dry ice & water frost)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(w * 0.5, 0, w * 0.22, h * 0.08, 0, 0, Math.PI * 2); // North Polar Cap
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h, w * 0.17, h * 0.07, 0, 0, Math.PI * 2); // South Polar Cap
  ctx.fill();
}

// 🟠 REALISTIC JUPITER: Distinct horizontal atmospheric belts, zones, vortices & Great Red Spot
function drawRealisticJupiter(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Scientific Jupiter latitudinal belt / zone colors
  const belts = [
    '#e2d7c5', // North Polar Region (creamy gray)
    '#c27838', // North North Temperate Belt (amber brown)
    '#f5ecd7', // North Temperate Zone (cream white)
    '#96481b', // North Temperate Belt (rich mahogany)
    '#fed7aa', // North Tropical Zone (light salmon)
    '#7c2d12', // North Equatorial Belt (deep brick red-brown)
    '#fff1db', // Equatorial Zone (bright creamy white)
    '#853315', // South Equatorial Belt (deep dark red-brown)
    '#fde68a', // South Tropical Zone (warm cream)
    '#b45309', // South Temperate Belt (amber)
    '#fef3c7', // South South Temperate Zone (pale cream)
    '#d6c7b2', // South Polar Region
  ];

  const bandH = h / belts.length;
  belts.forEach((col, idx) => {
    ctx.fillStyle = col;
    ctx.fillRect(0, idx * bandH, w, bandH + 2);

    // Turbulence wave ripples on belt interfaces
    ctx.strokeStyle = 'rgba(60, 20, 10, 0.18)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, idx * bandH);
    for (let x = 0; x <= w; x += 40) {
      const y = idx * bandH + Math.sin(x * 0.02 + idx) * 5;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  });

  // Jovian atmospheric festoons and white storm ovals
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  for (let o = 0; o < 24; o++) {
    const ox = (o * 173) % w;
    const oy = ((o * 79) % (h * 0.7)) + h * 0.15;
    ctx.beginPath();
    ctx.ellipse(ox, oy, 16, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 🔴 THE GREAT RED SPOT (Iconic anticyclonic storm in South Tropical Zone)
  const grsX = w * 0.58;
  const grsY = h * 0.65;
  const grsW = 85;
  const grsH = 46;

  // Outer red halo
  const grsGrad = ctx.createRadialGradient(grsX, grsY, 5, grsX, grsY, grsW);
  grsGrad.addColorStop(0, '#991b1b'); // Dark crimson core
  grsGrad.addColorStop(0.5, '#ea580c'); // Bright orange-red
  grsGrad.addColorStop(0.85, '#fdba74'); // Pale cream storm margin
  grsGrad.addColorStop(1, 'rgba(253, 186, 116, 0)');
  ctx.fillStyle = grsGrad;
  ctx.beginPath();
  ctx.ellipse(grsX, grsY, grsW, grsH, 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Swirling internal eye ring
  ctx.strokeStyle = '#7f1d1d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(grsX, grsY, grsW * 0.55, grsH * 0.5, 0.05, 0, Math.PI * 2);
  ctx.stroke();
}

// 🪐 REALISTIC SATURN: Pale butterscotch / warm creamy horizontal atmospheric bands
function drawRealisticSaturn(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const bands = [
    '#fef08a', // North Polar Hexagon area
    '#fde047',
    '#fef9c3',
    '#eab308', // North Temperate Belt
    '#fef08a',
    '#fef9c3', // Equatorial Zone (brightest)
    '#ca8a04', // South Equatorial Belt
    '#fde047',
    '#fef08a',
    '#d97706',
    '#fef9c3',
  ];

  const bandH = h / bands.length;
  bands.forEach((col, idx) => {
    ctx.fillStyle = col;
    ctx.fillRect(0, idx * bandH, w, bandH + 2);
  });

  // Soft longitudinal haze
  const haze = ctx.createLinearGradient(0, 0, 0, h);
  haze.addColorStop(0, 'rgba(180, 100, 20, 0.25)');
  haze.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
  haze.addColorStop(1, 'rgba(180, 100, 20, 0.3)');
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, w, h);
}

// 🪐 REALISTIC SATURN RINGS: Concentric bands with authentic Cassini Division, C, B, A rings
function drawRealisticSaturnRings(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);

  const cx = w * 0.5;
  const cy = h * 0.5;
  const maxR = w * 0.5;

  // High-precision radial gradient matching Saturn's real ring system (innerRadius / outerRadius = 4.8 / 8.8 = 0.545)
  const grad = ctx.createRadialGradient(cx, cy, maxR * 0.52, cx, cy, maxR * 0.99);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)'); // Inner transparent gap
  grad.addColorStop(0.04, 'rgba(217, 119, 6, 0.35)'); // C Ring (crepe ring)
  grad.addColorStop(0.18, 'rgba(254, 240, 138, 0.88)'); // B Ring inner edge
  grad.addColorStop(0.48, 'rgba(253, 224, 71, 0.98)'); // B Ring dense core (brightest gold)
  grad.addColorStop(0.56, 'rgba(254, 240, 138, 0.92)');
  grad.addColorStop(0.59, 'rgba(0, 0, 0, 0.02)'); // CASSINI DIVISION! (clear dark gap)
  grad.addColorStop(0.66, 'rgba(0, 0, 0, 0.02)'); // CASSINI DIVISION
  grad.addColorStop(0.69, 'rgba(253, 224, 71, 0.85)'); // A Ring inner
  grad.addColorStop(0.85, 'rgba(254, 240, 138, 0.75)'); // Encke division area
  grad.addColorStop(0.95, 'rgba(250, 204, 21, 0.55)'); // Outer boundary
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)'); // Outer space boundary

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
  ctx.fill();
}

// 🟦 REALISTIC URANUS: Pale cyan/blue-green calm atmosphere with subtle polar brightening
function drawRealisticUranus(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#cffafe'); // Pale cyan polar region
  bg.addColorStop(0.35, '#a5f3fc');
  bg.addColorStop(0.5, '#67e8f9'); // Aquamarine equator
  bg.addColorStop(0.65, '#a5f3fc');
  bg.addColorStop(1, '#cffafe');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Subtle serene methane haze bands
  for (let y = 0; y < h; y += 18) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.fillRect(0, y, w, 7);
  }
}

// 🔵 REALISTIC NEPTUNE: Deep rich cobalt/royal blue, supersonic storm bands, white cirrus streaks
function drawRealisticNeptune(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#172554'); // Deep midnight navy
  bg.addColorStop(0.3, '#1e3a8a');
  bg.addColorStop(0.5, '#2563eb'); // Brilliant royal cobalt
  bg.addColorStop(0.7, '#1d4ed8');
  bg.addColorStop(1, '#172554');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Great Dark Spot storm (cyclone)
  const dsX = w * 0.42;
  const dsY = h * 0.52;
  const dsGrad = ctx.createRadialGradient(dsX, dsY, 5, dsX, dsY, 65);
  dsGrad.addColorStop(0, '#0f172a');
  dsGrad.addColorStop(0.65, '#1e3a8a');
  dsGrad.addColorStop(1, 'rgba(30, 58, 138, 0)');
  ctx.fillStyle = dsGrad;
  ctx.beginPath();
  ctx.ellipse(dsX, dsY, 65, 34, -0.08, 0, Math.PI * 2);
  ctx.fill();

  // Brilliant white methane ice cirrus clouds ("Scooter")
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 22; i++) {
    const x = (i * 139) % w;
    const y = 100 + (i * 37) % (h - 200);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 30, y + 4, x + 60, y - 4, x + 90, y + 2);
    ctx.stroke();
  }
}

function drawDefaultTexture(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 0, w, h);
}
