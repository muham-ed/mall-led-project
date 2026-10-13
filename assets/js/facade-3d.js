/**
 * Mall LED Facade 3D Engine — Powered by Three.js & OrbitControls
 * Real-time WebGL 3D Simulation with ACESFilmic Tone Mapping & Multi-Light Scene Setup
 */

window.Facade3D = (function () {
  let scene, camera, renderer, controls;
  let buildingMesh, glassMesh, ledMesh, screenCanvas, screenCtx, screenTexture;
  let dirLight, ambientLight, hemiLight, fillLight, ledGlow, spotLights = [];
  let isNight = true;
  let isLedOn = true;
  let brightness = 100;
  let showAnnotations = true;
  let animFrameId = null;
  let time = 0;
  let portfolioData = [];

  function init(containerId, projectData) {
    ensureThree(() => {
      startEngine(containerId, projectData);
    });
  }

  function ensureThree(cb) {
    if (window.THREE && (THREE.OrbitControls || window.OrbitControls)) return cb();
    if (!window.THREE) {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
      s.onload = () => {
        const s2 = document.createElement("script");
        s2.src = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js";
        s2.onload = cb;
        s2.onerror = cb; // fallback gracefully
        document.head.appendChild(s2);
      };
      document.head.appendChild(s);
    } else {
      const s2 = document.createElement("script");
      s2.src = "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js";
      s2.onload = cb;
      s2.onerror = cb;
      document.head.appendChild(s2);
    }
  }

  function startEngine(containerId, projectData) {
    let container = typeof containerId === "string" ? document.getElementById(containerId) : containerId;
    if (!container) {
      container = document.getElementById("facade3dContainer") ||
                  document.getElementById("facade3d") ||
                  document.getElementById("facade-canvas") ||
                  document.querySelector("[data-facade-3d]") ||
                  document.querySelector(".facade-canvas");
    }

    if (!container) {
      console.warn("[Facade3D] لم يتم العثور على حاوية العرض 3D.");
      return;
    }

    if (projectData && projectData.portfolio_demos && projectData.portfolio_demos.length > 0) {
      portfolioData = projectData.portfolio_demos;
    } else {
      portfolioData = [
        {
          id: 1,
          title: "نموذج تصوري A — واجهة زجاجية متعددة الطوابق",
          year: "2025 (نموذج)",
          description: "تصميم واجهة زجاجية شفافة P3.9 مدمجة مع الهيكل المعماري الخارجي بسطوع 6,500 Nit.",
          image_gradient: "linear-gradient(135deg, #1e1b4b, #0284c7, #38bdf8)"
        },
        {
          id: 2,
          title: "نموذج تصوري B — شاشة LED منحنية معمارية",
          year: "2025 (نموذج)",
          description: "دمج شاشة LED منحنية بدقة 4K بالواجهة مع نظام تحكم سحابي ومحاكاة نهارية/ليلية.",
          image_gradient: "linear-gradient(135deg, #0f172a, #0369a1, #38bdf8)"
        },
        {
          id: 3,
          title: "نموذج تصوري C — تكامل زجاج + LED شفاف",
          year: "2025 (نموذج)",
          description: "واجهة معمارية عصرية هجينة تجمع بين الألومنيوم وشاشات LED الشفافة التفاعلية.",
          image_gradient: "linear-gradient(135deg, #312e81, #0284c7, #06b6d4)"
        }
      ];
    }

    // Build DOM Structure
    container.innerHTML = `
      <div class="facade-3d-card card">
        <div class="facade-header">
          <div class="facade-title">
            <h2>🏢 التصور ثلاثي الأبعاد (3D WebGL) ومحاكاة الواجهة الخارجية</h2>
            <p>محاكاة تفاعلية حية بـ Three.js لواجهة المول التجاري مع شاشة LED الشفافة المدمجة</p>
          </div>
          <div class="facade-controls-top">
            <button class="btn-toggle-daynight ${isNight ? 'night' : 'day'}" id="btnDayNight">
              ${isNight ? '🌙 المشهد الليلي' : '🌞 المشهد النهاري'}
            </button>
            <button class="btn-toggle-led ${isLedOn ? 'on' : 'off'}" id="btnLedToggle">
              ${isLedOn ? '📺 الشاشة تشغيل' : '📺 الشاشة إيقاف'}
            </button>
            <button class="secondary" id="btnAnnotations">
              ${showAnnotations ? '📐 إخفاء المخطط' : '📐 إظهار المخطط'}
            </button>
          </div>
        </div>

        <div class="facade-stage-wrapper" id="facade3dStage" style="width:100%; height:520px; position:relative; background:#020617; border-radius:12px; overflow:hidden;">
          <div class="facade-overlay-specs" id="facadeOverlaySpecs">
            <div class="spec-tag"><span class="icon">✨</span> السطوع: <b>6,500 Nit</b></div>
            <div class="spec-tag"><span class="icon">⚡</span> معدل التحديث: <b>3,840 Hz</b></div>
            <div class="spec-tag"><span class="icon">🛡️</span> الحماية: <b>IP65 Outdoor</b></div>
            <div class="spec-tag"><span class="icon">🏙️</span> نفاذية الضوء: <b>72% Transparent</b></div>
            <div class="spec-tag"><span class="icon">📐</span> الأبعاد: <b>34m × 20m × 15m</b></div>
          </div>
        </div>

        <div class="facade-controls-bottom">
          <div class="control-group">
            <label>🎚️ مستوى سطوع الشاشة:</label>
            <input type="range" id="brightnessSlider" min="20" max="100" value="${brightness}">
            <span id="brightnessVal">${brightness}%</span>
          </div>
          <div class="control-group">
            <label>🔄 تدوير المنظور 3D:</label>
            <button class="small-btn" id="btnRotLeft">↺ يسار</button>
            <button class="small-btn" id="btnRotReset">⌂ إعادة ضبط</button>
            <button class="small-btn" id="btnRotRight">↻ يمين</button>
          </div>
        </div>

        <!-- Portfolio Section -->
        <div class="portfolio-section">
          <h3>💼 النماذج التصورية والمعمارية للواجهات والشاشات</h3>
          <span class="portfolio-demo-badge">⚠️ نماذج تصورية للعرض المقترح — غير منفذة</span>
          <div class="portfolio-grid" id="portfolioGrid">
            ${portfolioData.map(item => `
              <div class="portfolio-card">
                <div class="p-img" style="background: ${item.image_gradient || 'linear-gradient(135deg, #1e1b4b, #0284c7)'}">
                  <span class="p-badge">${item.year || '2025'}</span>
                </div>
                <h4>${item.title}</h4>
                <p>${item.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Initialize WebGL Scene
    initThreeJS();

    // Event Listeners
    document.getElementById("btnDayNight").onclick = function () {
      isNight = !isNight;
      this.className = `btn-toggle-daynight ${isNight ? 'night' : 'day'}`;
      this.textContent = isNight ? '🌙 المشهد الليلي' : '🌞 المشهد النهاري';
      updateEnvironment();
    };

    document.getElementById("btnLedToggle").onclick = function () {
      isLedOn = !isLedOn;
      this.className = `btn-toggle-led ${isLedOn ? 'on' : 'off'}`;
      this.textContent = isLedOn ? '📺 الشاشة تشغيل' : '📺 الشاشة إيقاف';
      if (ledMesh) ledMesh.visible = isLedOn;
      if (ledGlow) ledGlow.visible = isLedOn;
    };

    document.getElementById("btnAnnotations").onclick = function () {
      showAnnotations = !showAnnotations;
      this.textContent = showAnnotations ? '📐 إخفاء المخطط' : '📐 إظهار المخطط';
      document.getElementById("facadeOverlaySpecs").style.display = showAnnotations ? 'flex' : 'none';
    };

    document.getElementById("brightnessSlider").oninput = function () {
      brightness = parseInt(this.value, 10);
      document.getElementById("brightnessVal").textContent = brightness + "%";
      if (ledGlow) {
        ledGlow.intensity = (brightness / 100) * (isNight ? 2.5 : 0.8);
      }
    };

    document.getElementById("btnRotLeft").onclick = () => rotateCamera(-0.35);
    document.getElementById("btnRotRight").onclick = () => rotateCamera(0.35);
    document.getElementById("btnRotReset").onclick = () => resetCamera();
  }

  function createScreenTexture() {
    screenCanvas = document.createElement("canvas");
    screenCanvas.width = 1024;
    screenCanvas.height = 512;
    screenCtx = screenCanvas.getContext("2d");
    screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.anisotropy = 4;
    return screenTexture;
  }

  function updateScreenCanvas() {
    if (!screenCtx) return;
    const W = screenCanvas.width;
    const H = screenCanvas.height;

    screenCtx.clearRect(0, 0, W, H);

    if (isLedOn) {
      const bRatio = brightness / 100;
      let hue1 = (time * 50) % 360;
      let hue2 = (hue1 + 120) % 360;

      let grad = screenCtx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, `hsla(${hue1}, 95%, 55%, ${0.95 * bRatio})`);
      grad.addColorStop(0.5, `hsla(${hue2}, 90%, 60%, ${0.9 * bRatio})`);
      grad.addColorStop(1, `hsla(${(hue1 + 240) % 360}, 95%, 50%, ${0.95 * bRatio})`);

      screenCtx.fillStyle = grad;
      screenCtx.fillRect(0, 0, W, H);

      // Waves
      screenCtx.strokeStyle = `rgba(255, 255, 255, ${0.85 * bRatio})`;
      screenCtx.lineWidth = 6;
      for (let i = 0; i < 4; i++) {
        screenCtx.beginPath();
        for (let x = 0; x <= W; x += 20) {
          let y = H * 0.5 + Math.sin(time * 3 + x * 0.01 + i) * (35 + i * 15);
          if (x === 0) screenCtx.moveTo(x, y);
          else screenCtx.lineTo(x, y);
        }
        screenCtx.stroke();
      }

      // Title Text
      screenCtx.fillStyle = `rgba(255, 255, 255, ${bRatio})`;
      screenCtx.font = "bold 54px system-ui, sans-serif";
      screenCtx.textAlign = "center";
      screenCtx.shadowColor = "rgba(0, 0, 0, 0.5)";
      screenCtx.shadowBlur = 12;
      screenCtx.fillText("MALL OF FUTURE — RIYADH", W / 2, H * 0.42);

      screenCtx.font = "bold 34px system-ui, sans-serif";
      screenCtx.fillStyle = `rgba(254, 240, 138, ${bRatio})`;
      screenCtx.fillText("✨ LED Transparent Outdoor Facade P3.9 ✨", W / 2, H * 0.65);

      // Transparent Mesh Grid Overlay
      screenCtx.shadowBlur = 0;
      screenCtx.strokeStyle = "rgba(0, 0, 0, 0.25)";
      screenCtx.lineWidth = 2;
      for (let y = 0; y < H; y += 12) {
        screenCtx.beginPath();
        screenCtx.moveTo(0, y);
        screenCtx.lineTo(W, y);
        screenCtx.stroke();
      }
    } else {
      screenCtx.fillStyle = "#0f172a";
      screenCtx.fillRect(0, 0, W, H);
      screenCtx.fillStyle = "#64748b";
      screenCtx.font = "bold 38px system-ui";
      screenCtx.textAlign = "center";
      screenCtx.fillText("[ الشاشة في وضع الاستعداد / OFF ]", W / 2, H / 2);
    }

    if (screenTexture) screenTexture.needsUpdate = true;
  }

  function initThreeJS() {
    const stage = document.getElementById("facade3dStage");
    if (!stage) return;

    const width = stage.clientWidth || 1100;
    const height = 520;

    // Scene & Fog
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050b1a);
    scene.fog = new THREE.FogExp2(0x050b1a, 0.008);

    // Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
    camera.position.set(45, 30, 55);
    camera.lookAt(0, 10, 0);

    // Renderer with ACESFilmic Tone Mapping for bright vivid output
    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

    // Append Canvas
    const oldCanvas = stage.querySelector("canvas");
    if (oldCanvas) oldCanvas.remove();
    stage.appendChild(renderer.domElement);

    // Orbit Controls or Fallback
    const Orbit = window.OrbitControls || (window.THREE ? THREE.OrbitControls : null);
    if (Orbit) {
      controls = new Orbit(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.maxPolarAngle = Math.PI / 2 - 0.02;
      controls.minDistance = 25;
      controls.maxDistance = 140;
      controls.target.set(0, 10, 0);
      controls.update();
    } else {
      // Custom Smooth Mouse Rotation Fallback
      let isDragging = false, lastX = 0, lastY = 0;
      renderer.domElement.addEventListener("mousedown", (e) => { isDragging = true; lastX = e.clientX; lastY = e.clientY; });
      window.addEventListener("mouseup", () => { isDragging = false; });
      window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastX;
        rotateCamera(-dx * 0.005);
        lastX = e.clientX;
        lastY = e.clientY;
      });
    }

    // LIGHTING SYSTEM (Fixes darkness issues)
    // 1) Ambient Light
    ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    // 2) Hemisphere Light
    hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 0.8);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    // 3) Directional Sun Light (Positioned in front-right)
    dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(40, 60, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    scene.add(dirLight);

    // 4) Front-Left Fill Light
    fillLight = new THREE.DirectionalLight(0xaaccff, 0.45);
    fillLight.position.set(-40, 30, 30);
    scene.add(fillLight);

    // 5) LED Screen Glow Light
    ledGlow = new THREE.PointLight(0x38bdf8, 2.2, 45);
    ledGlow.position.set(0, 12, 10);
    scene.add(ledGlow);

    // 6) Architectural Spotlights for Night
    const spotPos = [-14, -7, 0, 7, 14];
    spotLights = [];
    spotPos.forEach(x => {
      const spot = new THREE.SpotLight(0x38bdf8, 0);
      spot.position.set(x, 0.5, 10);
      spot.target.position.set(x, 15, 7.5);
      spot.angle = Math.PI / 5;
      spot.penumbra = 0.5;
      scene.add(spot);
      scene.add(spot.target);
      spotLights.push(spot);
    });

    // Ground Plaza
    const groundGeo = new THREE.PlaneGeometry(250, 250);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid Helper on Plaza
    const grid = new THREE.GridHelper(250, 50, 0x38bdf8, 0x334155);
    grid.position.y = 0.02;
    grid.material.opacity = 0.25;
    grid.material.transparent = true;
    scene.add(grid);

    // MALL BUILDING STRUCTURE (34m width x 20m height x 15m depth)
    const bW = 34, bH = 20, bD = 15;

    // Building Solid Frame
    const bGeo = new THREE.BoxGeometry(bW, bH, bD);
    const bMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.5,
      metalness: 0.3
    });
    buildingMesh = new THREE.Mesh(bGeo, bMat);
    buildingMesh.position.set(0, bH / 2, 0);
    buildingMesh.castShadow = true;
    buildingMesh.receiveShadow = true;
    scene.add(buildingMesh);

    // Transparent Glass Curtain Wall Facade
    const glassGeo = new THREE.BoxGeometry(bW - 0.4, bH - 0.4, 0.2);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.8,
      transmission: 0.65,
      ior: 1.5,
      side: THREE.DoubleSide
    });
    glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(0, bH / 2, bD / 2 + 0.12);
    scene.add(glassMesh);

    // Structural Frame & Mullions
    const gridGroup = new THREE.Group();
    const cols = 10;
    for (let c = 0; c <= cols; c++) {
      const gx = -bW / 2 + (bW / cols) * c;
      const mGeo = new THREE.BoxGeometry(0.18, bH, 0.35);
      const mMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
      const mullion = new THREE.Mesh(mGeo, mMat);
      mullion.position.set(gx, bH / 2, bD / 2 + 0.22);
      gridGroup.add(mullion);
    }
    const rows = 5;
    for (let r = 0; r <= rows; r++) {
      const gy = (bH / rows) * r;
      const mGeo = new THREE.BoxGeometry(bW, 0.18, 0.35);
      const mMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
      const mullion = new THREE.Mesh(mGeo, mMat);
      mullion.position.set(0, gy, bD / 2 + 0.22);
      gridGroup.add(mullion);
    }
    scene.add(gridGroup);

    // Entrance Canopy
    const canopyGeo = new THREE.BoxGeometry(14, 1.2, 6);
    const canopyMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, 4.5, bD / 2 + 3);
    canopy.castShadow = true;
    scene.add(canopy);

    // LED SCREEN EMBEDDED IN FRONT FACADE
    const ledTexture = createScreenTexture();
    const ledGeo = new THREE.PlaneGeometry(26, 11.5);
    const ledMat = new THREE.MeshBasicMaterial({
      map: ledTexture,
      transparent: true,
      opacity: 0.98,
      toneMapped: false
    });
    ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(0, 12.5, bD / 2 + 0.28);
    scene.add(ledMesh);

    // LED Outer Frame
    const frameGeo = new THREE.BoxGeometry(26.5, 12, 0.15);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(0, 12.5, bD / 2 + 0.21);
    scene.add(frame);

    // Neighboring Ambient Buildings for Scale Depth
    const neighborMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 });
    [
      [-55, 12, -20, 22, 24, 18],
      [55, 14, -15, 26, 28, 20],
      [-42, 9, 38, 20, 18, 16],
      [48, 10, 35, 24, 20, 18]
    ].forEach(([x, y, z, w, h, d]) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), neighborMat);
      b.position.set(x, h / 2, z);
      b.castShadow = true;
      b.receiveShadow = true;
      scene.add(b);
    });

    // Apply Environment Lighting
    updateEnvironment();

    // Window Resize Handler
    window.addEventListener("resize", onWindowResize);

    // Start Main Render Animation Loop
    startLoop();
    console.log("[Facade3D] ✅ تم تشغيل محرك 3D WebGL بنجاح");
  }

  function updateEnvironment() {
    if (!scene) return;

    if (isNight) {
      scene.background = new THREE.Color(0x050b1a);
      if (scene.fog) scene.fog.color.set(0x050b1a);
      if (ambientLight) ambientLight.intensity = 0.25;
      if (hemiLight) hemiLight.intensity = 0.15;
      if (dirLight) dirLight.intensity = 0.15;
      if (fillLight) fillLight.intensity = 0.05;
      if (ledGlow) ledGlow.intensity = (brightness / 100) * 2.5;

      spotLights.forEach(spot => {
        spot.intensity = 3.5;
      });
    } else {
      scene.background = new THREE.Color(0x87ceeb); // Bright Daytime Sky
      if (scene.fog) scene.fog.color.set(0x87ceeb);
      if (ambientLight) ambientLight.intensity = 0.7;
      if (hemiLight) hemiLight.intensity = 0.9;
      if (dirLight) dirLight.intensity = 1.3;
      if (fillLight) fillLight.intensity = 0.45;
      if (ledGlow) ledGlow.intensity = (brightness / 100) * 0.8;

      spotLights.forEach(spot => {
        spot.intensity = 0;
      });
    }
  }

  function rotateCamera(deltaAngle) {
    if (!camera) return;
    const x = camera.position.x;
    const z = camera.position.z;
    const cos = Math.cos(deltaAngle);
    const sin = Math.sin(deltaAngle);
    camera.position.x = x * cos - z * sin;
    camera.position.z = x * sin + z * cos;
    if (controls) controls.update();
  }

  function resetCamera() {
    if (!camera) return;
    camera.position.set(45, 30, 55);
    if (controls) {
      controls.target.set(0, 10, 0);
      controls.update();
    } else {
      camera.lookAt(0, 10, 0);
    }
  }

  function onWindowResize() {
    const stage = document.getElementById("facade3dStage");
    if (!stage || !renderer || !camera) return;
    const w = stage.clientWidth || 1100;
    const h = 520;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function startLoop() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    function loop() {
      time += 0.03;
      updateScreenCanvas();

      if (controls) controls.update();
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }

      animFrameId = requestAnimationFrame(loop);
    }
    loop();
  }

  function getCanvas() {
    if (renderer) return renderer.domElement;
    return null;
  }

  return {
    init: init,
    getCanvas: getCanvas
  };
})();