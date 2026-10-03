/**
 * Shader foto kartu pemain.
 * - crop konsisten dengan versi DOM (uCrop, ruang gambar origin kiri-atas)
 * - ripple mengikuti pointer + displacement vertex saat hover
 * - RGB split dari hover & kecepatan scroll
 * - banner bawah opaque (menutup area dagu foto), sudut membulat (SDF)
 * - wipe reveal diagonal dengan garis neon (dipakai Spotlight)
 * Output pass-through sRGB (tanpa colorspace_fragment) agar identik dengan <img>.
 */

export const photoVertex = /* glsl */ `
  uniform float uTime;
  uniform float uHover;
  uniform float uVelocity;
  uniform vec2 uMouse;
  uniform vec2 uSize;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float dist = length((uv - uMouse) * uSize) / uSize.y;
    float wave = sin(dist * 22.0 - uTime * 5.0) * exp(-dist * 5.5);
    pos.z += wave * 0.018 * uHover;
    pos.z += sin(uv.y * 3.14159265) * uVelocity * 0.04;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

export const photoFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec4 uCrop;
  uniform vec2 uSize;
  uniform vec2 uMouse;
  uniform float uRadius;
  uniform float uHover;
  uniform float uTime;
  uniform float uVelocity;
  uniform float uBanner;
  uniform float uReveal;
  uniform float uZoom;
  uniform vec3 uInk;
  uniform vec3 uAccent;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float roundedBox(vec2 p, vec2 halfSize, float radius) {
    vec2 q = abs(p) - halfSize + radius;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
  }

  vec3 samplePhoto(vec2 uv) {
    vec2 frame = (uv - 0.5) / uZoom + 0.5;
    vec2 image = vec2(uCrop.x + frame.x * uCrop.z, uCrop.y + (1.0 - frame.y) * uCrop.w);
    return texture2D(uMap, vec2(image.x, 1.0 - image.y)).rgb;
  }

  void main() {
    vec2 uv = vUv;

    vec2 toMouse = uv - uMouse;
    float dist = length(toMouse * uSize) / uSize.y;
    float ripple = sin(dist * 36.0 - uTime * 6.0) * exp(-dist * 7.0) * uHover;
    uv += normalize(toMouse + 1e-5) * ripple * 0.005;

    float shift = 0.0022 * uHover + uVelocity * 0.012;
    vec2 offset = vec2(shift, shift * 0.3);
    vec3 color = vec3(
      samplePhoto(uv + offset).r,
      samplePhoto(uv).g,
      samplePhoto(uv - offset).b
    );

    color = mix(color, color * color * (3.0 - 2.0 * color), 0.2);
    color *= 0.97 + 0.03 * sin(vUv.y * 720.0);
    color += (hash(vUv * 811.0 + fract(uTime * 0.37)) - 0.5) * 0.035;
    float vignette = smoothstep(1.05, 0.35, length((vUv - vec2(0.5, 0.56)) * vec2(1.0, 0.9)));
    color *= mix(0.72, 1.0, vignette);

    vec2 p = (vUv - 0.5) * uSize;
    float d = roundedBox(p, uSize * 0.5, uRadius);
    color = mix(color, uAccent, smoothstep(-0.05, 0.0, d) * uHover * 0.45);

    float banner = 1.0 - step(uBanner, vUv.y);
    color = mix(color, uInk, banner);

    float edge = vUv.y + (vUv.x - 0.5) * 0.3;
    float threshold = uReveal * 1.4 - 0.2;
    float reveal = smoothstep(edge - 0.015, edge + 0.015, threshold);
    float scanLine = (1.0 - smoothstep(0.0, 0.02, abs(edge - threshold))) * step(uReveal, 0.999);
    color = mix(color, uAccent, scanLine);

    float aa = fwidth(d);
    float alpha = (1.0 - smoothstep(-aa, aa, d)) * max(reveal, scanLine);
    if (alpha < 0.002) discard;
    gl_FragColor = vec4(color, alpha);
  }
`
