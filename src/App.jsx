import { useEffect, useRef } from "react";

export default function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;

    const ext = gl.getExtension("OES_texture_half_float");
    gl.getExtension("OES_texture_half_float_linear");
    const HALF = ext ? ext.HALF_FLOAT_OES : gl.UNSIGNED_BYTE;

    const SIM_RES = 0.55;
    let W, H, SIM_W, SIM_H;
    let vel0, vel1, div0, pres0, pres1;
    let animId;

    /* ── Shader compile ── */
    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    function makeProgram(vs, fs) {
      const p = gl.createProgram();
      gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      return p;
    }

    const baseVS = `attribute vec2 a_pos; varying vec2 v_uv; void main(){ v_uv=a_pos*0.5+0.5; gl_Position=vec4(a_pos,0,1); }`;
    const advectFS = `precision highp float; uniform sampler2D u_vel; uniform vec2 u_px; uniform float u_dt; varying vec2 v_uv; void main(){ vec2 vel=texture2D(u_vel,v_uv).xy; vec2 prev=v_uv-vel*u_dt; gl_FragColor=texture2D(u_vel,prev); }`;
    const forceFS = `precision highp float; uniform sampler2D u_vel; uniform vec2 u_point; uniform vec2 u_force; uniform float u_radius; varying vec2 v_uv; void main(){ vec2 vel=texture2D(u_vel,v_uv).xy; float d=distance(v_uv,u_point); float mask=exp(-d*d/(u_radius*u_radius)); gl_FragColor=vec4(vel+u_force*mask,0.0,1.0); }`;
    const divFS = `precision highp float; uniform sampler2D u_vel; uniform vec2 u_px; varying vec2 v_uv; void main(){ float l=texture2D(u_vel,v_uv-vec2(u_px.x,0)).x; float r=texture2D(u_vel,v_uv+vec2(u_px.x,0)).x; float b=texture2D(u_vel,v_uv-vec2(0,u_px.y)).y; float t=texture2D(u_vel,v_uv+vec2(0,u_px.y)).y; gl_FragColor=vec4((r-l+t-b)*0.5,0,0,1); }`;
    const pressFS = `precision highp float; uniform sampler2D u_pres; uniform sampler2D u_div; uniform vec2 u_px; varying vec2 v_uv; void main(){ float l=texture2D(u_pres,v_uv-vec2(u_px.x,0)).r; float r=texture2D(u_pres,v_uv+vec2(u_px.x,0)).r; float b=texture2D(u_pres,v_uv-vec2(0,u_px.y)).r; float t=texture2D(u_pres,v_uv+vec2(0,u_px.y)).r; float d=texture2D(u_div,v_uv).r; gl_FragColor=vec4((l+r+b+t-d)*0.25,0,0,1); }`;
    const gradFS = `precision highp float; uniform sampler2D u_vel; uniform sampler2D u_pres; uniform vec2 u_px; varying vec2 v_uv; void main(){ float l=texture2D(u_pres,v_uv-vec2(u_px.x,0)).r; float r=texture2D(u_pres,v_uv+vec2(u_px.x,0)).r; float b=texture2D(u_pres,v_uv-vec2(0,u_px.y)).r; float t=texture2D(u_pres,v_uv+vec2(0,u_px.y)).r; vec2 vel=texture2D(u_vel,v_uv).xy; gl_FragColor=vec4(vel-vec2(r-l,t-b)*0.5,0,1); }`;
    // Palette: white bg → #a855f7 → #ec4899 → #f9a8d4
    const renderFS = `
      precision highp float;
      uniform sampler2D u_vel;
      varying vec2 v_uv;
      void main(){
        vec2 vel = texture2D(u_vel, v_uv).xy;
        float spd = clamp(length(vel) * 6.0, 0.0, 1.0);
        vec3 c0 = vec3(1.0, 1.0, 1.0);
        vec3 c1 = vec3(0.659, 0.333, 0.969);
        vec3 c2 = vec3(0.925, 0.286, 0.600);
        vec3 c3 = vec3(0.976, 0.659, 0.831);
        vec3 col;
        if(spd < 0.33)      col = mix(c0, c1, spd / 0.33);
        else if(spd < 0.66) col = mix(c1, c2, (spd - 0.33) / 0.33);
        else                col = mix(c2, c3, (spd - 0.66) / 0.34);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const pAdvect = makeProgram(baseVS, advectFS);
    const pForce = makeProgram(baseVS, forceFS);
    const pDiv = makeProgram(baseVS, divFS);
    const pPress = makeProgram(baseVS, pressFS);
    const pGrad = makeProgram(baseVS, gradFS);
    const pRender = makeProgram(baseVS, renderFS);

    /* ── Quad buffer ── */
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    function bindQuad(p) {
      const loc = gl.getAttribLocation(p, "a_pos");
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    }

    /* ── FBO helpers ── */
    function makeFBO(w, h) {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, HALF, null);
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        tex,
        0,
      );
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { tex, fb, w, h };
    }

    function initFBOs() {
      vel0 = makeFBO(SIM_W, SIM_H);
      vel1 = makeFBO(SIM_W, SIM_H);
      div0 = makeFBO(SIM_W, SIM_H);
      pres0 = makeFBO(SIM_W, SIM_H);
      pres1 = makeFBO(SIM_W, SIM_H);
    }

    function swap(a, b) {
      return [b, a];
    }

    function drawTo(fbo, p, setUniforms) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo ? fbo.fb : null);
      gl.viewport(0, 0, fbo ? fbo.w : W, fbo ? fbo.h : H);
      gl.useProgram(p);
      bindQuad(p);
      setUniforms(p);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function bindTex(p, name, unit, fbo) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, fbo.tex);
      gl.uniform1i(gl.getUniformLocation(p, name), unit);
    }
    function u2f(p, n, v) {
      gl.uniform2f(gl.getUniformLocation(p, n), v[0], v[1]);
    }
    function u1f(p, n, v) {
      gl.uniform1f(gl.getUniformLocation(p, n), v);
    }

    /* ── Resize ── */
    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      SIM_W = Math.max(1, Math.round(W * SIM_RES));
      SIM_H = Math.max(1, Math.round(H * SIM_RES));
      gl.viewport(0, 0, W, H);
      initFBOs();
    }

    /* ── Mouse / Auto-driver ── */
    const mouse = { x: 0.5, y: 0.5, dx: 0, dy: 0 };
    const auto = {
      x: 0.5,
      y: 0.5,
      tx: 0.3,
      ty: 0.6,
      speed: 0.0006,
      active: true,
    };
    let lastInteract = 0;

    function toNorm(cx, cy) {
      return [cx / W, 1 - cy / H];
    }

    function pickAutoTarget() {
      auto.tx = 0.15 + Math.random() * 0.7;
      auto.ty = 0.15 + Math.random() * 0.7;
    }
    pickAutoTarget();

    function onMouseMove(e) {
      const [nx, ny] = toNorm(e.clientX, e.clientY);
      mouse.dx = (nx - mouse.x) * 18;
      mouse.dy = (ny - mouse.y) * 18;
      mouse.x = nx;
      mouse.y = ny;
      lastInteract = Date.now();
      auto.active = false;
    }

    function onTouchMove(e) {
      e.preventDefault();
      const t = e.touches[0];
      const [nx, ny] = toNorm(t.clientX, t.clientY);
      mouse.dx = (nx - mouse.x) * 18;
      mouse.dy = (ny - mouse.y) * 18;
      mouse.x = nx;
      mouse.y = ny;
      lastInteract = Date.now();
      auto.active = false;
    }

    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("resize", resize);

    /* ── Render loop ── */
    function step() {
      const px = [1 / SIM_W, 1 / SIM_H];
      const DT = 0.016,
        RADIUS = 0.04,
        ITERS = 28;

      // Resume auto after 1.2s idle
      if (!auto.active && Date.now() - lastInteract > 1200) {
        auto.active = true;
        auto.x = mouse.x;
        auto.y = mouse.y;
        pickAutoTarget();
      }

      let fx = mouse.dx,
        fy = mouse.dy;
      let pt = [mouse.x, mouse.y];

      if (auto.active) {
        const dx = auto.tx - auto.x,
          dy = auto.ty - auto.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 0.01) pickAutoTarget();
        const s = auto.speed * 60;
        auto.x += (dx / d) * Math.min(s, d);
        auto.y += (dy / d) * Math.min(s, d);
        fx = (auto.tx - auto.x) * 2.5;
        fy = (auto.ty - auto.y) * 2.5;
        pt = [auto.x, auto.y];
      } else {
        mouse.dx *= 0.85;
        mouse.dy *= 0.85;
      }

      // Advect
      drawTo(vel1, pAdvect, (p) => {
        bindTex(p, "u_vel", 0, vel0);
        u2f(p, "u_px", px);
        u1f(p, "u_dt", DT);
      });
      [vel0, vel1] = swap(vel0, vel1);

      // Force
      drawTo(vel1, pForce, (p) => {
        bindTex(p, "u_vel", 0, vel0);
        u2f(p, "u_point", pt);
        u2f(p, "u_force", [fx, fy]);
        u1f(p, "u_radius", RADIUS);
      });
      [vel0, vel1] = swap(vel0, vel1);

      // Divergence
      drawTo(div0, pDiv, (p) => {
        bindTex(p, "u_vel", 0, vel0);
        u2f(p, "u_px", px);
      });

      // Pressure solve
      for (let i = 0; i < ITERS; i++) {
        drawTo(pres1, pPress, (p) => {
          bindTex(p, "u_pres", 0, pres0);
          bindTex(p, "u_div", 1, div0);
          u2f(p, "u_px", px);
        });
        [pres0, pres1] = swap(pres0, pres1);
      }

      // Gradient subtract
      drawTo(vel1, pGrad, (p) => {
        bindTex(p, "u_vel", 0, vel0);
        bindTex(p, "u_pres", 1, pres0);
        u2f(p, "u_px", px);
      });
      [vel0, vel1] = swap(vel0, vel1);

      // Render to screen
      drawTo(null, pRender, (p) => {
        bindTex(p, "u_vel", 0, vel0);
      });

      animId = requestAnimationFrame(step);
    }

    resize();
    step();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "block",
        background: "#ffffff",
      }}
    />
  );
}
