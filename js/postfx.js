/* =========================================================================
   Son işlem katmanı.
   Sahne doğrusal (linear) bir hedefe çizilir; ton eşleme, renk düzeltme,
   vinyet, gren ve sRGB kodlaması burada elle yapılır.
   ========================================================================= */

const Efekt = {
  hedef: null, sahne: null, kamera: null, malzeme: null,

  kur(renderer, en, boy) {
    const pr = renderer.getPixelRatio();
    this.hedef = new THREE.WebGLRenderTarget(Math.round(en * pr), Math.round(boy * pr), {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      type: THREE.HalfFloatType,
    });

    this.malzeme = new THREE.ShaderMaterial({
      uniforms: {
        tDoku:   { value: this.hedef.texture },
        zaman:   { value: 0 },
        gerilim: { value: 0 },
        nabiz:   { value: 0 },
        karart:  { value: 0 },
        pozlama: { value: 1.38 },
        varlikYakin: { value: 0 },
        varlikSag:   { value: 0 },
        grenGuc:     { value: 1 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D tDoku;
        uniform float zaman, gerilim, nabiz, karart, pozlama, varlikYakin, varlikSag, grenGuc;
        varying vec2 vUv;

        float rast(vec2 p){
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        // ACES benzeri ton eşleme
        vec3 aces(vec3 x){
          const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
          return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
        }

        vec3 sRGB(vec3 x){
          return mix(x * 12.92,
                     1.055 * pow(max(x, vec3(0.0031308)), vec3(1.0 / 2.4)) - 0.055,
                     step(vec3(0.0031308), x));
        }

        void main(){
          vec2 mrk = vUv - 0.5;
          float r2 = dot(mrk, mrk);

          // mercek bombesi (nabızla hafif nefes)
          vec2 uv = 0.5 + mrk * (1.0 + r2 * (0.030 + nabiz * 0.045));

          // renk sapması
          float sap = (0.0014 + gerilim * 0.0030) * r2 * 6.0;
          vec3 lin;
          lin.r = texture2D(tDoku, uv + mrk * sap).r;
          lin.g = texture2D(tDoku, uv).g;
          lin.b = texture2D(tDoku, uv - mrk * sap).b;

          vec3 renk = sRGB(aces(max(lin, 0.0) * pozlama));

          // renk düzeltme: gölgeler soğuk, ışıklar sıcak
          float par = dot(renk, vec3(0.299, 0.587, 0.114));
          vec3 golge = vec3(0.055, 0.070, 0.105);
          vec3 isik  = vec3(1.05, 0.985, 0.885);
          renk = mix(golge, renk * isik, smoothstep(0.0, 0.40, par + 0.10));

          // gerilimle doygunluk düşer
          float g = dot(renk, vec3(0.299, 0.587, 0.114));
          renk = mix(renk, vec3(g), 0.14 + gerilim * 0.32);

          // vinyet
          renk *= smoothstep(0.95, 0.14, r2 * (1.7 + gerilim * 0.6));

          // VARLIK: yaklaştığı yandan karanlık sızar, nabız gibi atar
          if (varlikYakin > 0.001) {
            float sag = smoothstep(0.26, 1.0, vUv.x);
            float sol = smoothstep(0.26, 1.0, 1.0 - vUv.x);
            float kenar = varlikSag > 0.5 ? sag
                        : (varlikSag < -0.5 ? sol : max(sag, sol) * 1.15);
            float nb = 0.55 + 0.45 * sin(zaman * (3.4 + varlikYakin * 7.0));
            float g2 = kenar * varlikYakin * (0.45 + 0.55 * nb);
            renk = mix(renk, renk * vec3(0.16, 0.14, 0.21), clamp(g2, 0.0, 0.92));
            renk += vec3(0.055, 0.006, 0.010) * g2 * nb;
            renk *= 1.0 - varlikYakin * 0.10 * nb;          // genel nefes
          }

          // film greni
          float gr = rast(vUv * vec2(1280.0, 720.0) + fract(zaman * 0.97) * 137.3);
          renk += (gr - 0.5) * (0.048 + gerilim * 0.042) * grenGuc;

          // çok hafif tarama dokusu
          renk *= 1.0 - 0.016 * grenGuc * sin(vUv.y * 880.0);

          renk *= (1.0 - karart);
          gl_FragColor = vec4(clamp(renk, 0.0, 1.0), 1.0);
        }
      `,
      depthTest: false, depthWrite: false,
    });

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
      -1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
    g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2));
    this.sahne = new THREE.Scene();
    this.sahne.add(new THREE.Mesh(g, this.malzeme));
    this.kamera = new THREE.Camera();
  },

  boyut(renderer, en, boy) {
    const pr = renderer.getPixelRatio();
    this.hedef.setSize(Math.round(en * pr), Math.round(boy * pr));
  },

  ciz(renderer, sahne, kamera, t, gerilim, nabiz, karart, varlikYakin, varlikSag) {
    renderer.setRenderTarget(this.hedef);
    renderer.clear();
    renderer.render(sahne, kamera);
    renderer.setRenderTarget(null);
    const u = this.malzeme.uniforms;
    u.zaman.value = t;
    u.gerilim.value = gerilim;
    u.nabiz.value = nabiz;
    u.karart.value = karart;
    u.varlikYakin.value = varlikYakin || 0;
    u.varlikSag.value = varlikSag || 0;
    renderer.render(this.sahne, this.kamera);
  },
};
