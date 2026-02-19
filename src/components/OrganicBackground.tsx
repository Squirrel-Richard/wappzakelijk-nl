'use client'

import { useEffect, useRef } from 'react'

export function OrganicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      }
    }
    window.addEventListener('mousemove', onMouse)

    const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `
    const frag = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_res;
      uniform vec2 u_mouse;

      vec3 palette(float t) {
        vec3 a = vec3(0.012, 0.032, 0.024);
        vec3 b = vec3(0.010, 0.028, 0.018);
        vec3 c = vec3(0.000, 0.350, 0.180);
        vec3 d = vec3(0.100, 0.200, 0.500);
        return a + b * cos(6.28318 * (c * t + d));
      }

      float orb(vec2 uv, vec2 center, float radius, float softness) {
        float d = length(uv - center);
        return smoothstep(radius, radius - softness, d);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        vec2 mouse = u_mouse;

        float t = u_time * 0.12;

        vec2 c1 = vec2(0.3 + sin(t * 1.1) * 0.2, 0.6 + cos(t * 0.9) * 0.2);
        vec2 c2 = vec2(0.7 + cos(t * 0.8) * 0.2, 0.4 + sin(t * 1.2) * 0.2);
        vec2 c3 = vec2(0.5 + sin(t * 1.3) * 0.15, 0.3 + cos(t * 1.0) * 0.15);
        vec2 cm = mouse;

        float o1 = orb(uv, c1, 0.32, 0.35) * 0.5;
        float o2 = orb(uv, c2, 0.25, 0.28) * 0.4;
        float o3 = orb(uv, c3, 0.20, 0.22) * 0.35;
        float om = orb(uv, cm, 0.12, 0.18) * 0.3;

        float combined = o1 + o2 + o3 + om;

        vec3 col = vec3(0.012, 0.020, 0.032); // #030810 deep navy base
        col += palette(combined * 0.7 + t * 0.08) * combined * 0.9;

        // Subtle planet arc glow at bottom
        float arcY = uv.y;
        float arcGlow = pow(max(0.0, 1.0 - arcY * 2.5), 3.0) * 0.15;
        col += vec3(0.05, 0.40, 0.20) * arcGlow;

        // Subtle vignette
        vec2 vuv = uv * 2.0 - 1.0;
        float vig = 1.0 - dot(vuv * 0.5, vuv * 0.5);
        col *= vig * 0.4 + 0.6;

        gl_FragColor = vec4(col, 1.0);
      }
    `

    function compileShader(type: number, src: string) {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }

    const vs = compileShader(gl.VERTEX_SHADER, vert)
    const fs = compileShader(gl.FRAGMENT_SHADER, frag)
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)

    const posLoc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')

    let start = performance.now()

    const render = () => {
      const t = (performance.now() - start) / 1000
      gl.uniform1f(uTime, t)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      animRef.current = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full"
      style={{ background: '#030810' }}
    />
  )
}
