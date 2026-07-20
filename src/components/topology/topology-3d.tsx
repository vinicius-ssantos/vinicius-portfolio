"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Scene, SceneEdge, ScenePoint } from "@/lib/topology";

// #48 Phase A — visual prototype of the Backend System Pulse in 3D.
//
// Deliberately decorative: this canvas is aria-hidden and the accessible
// HTML topology renders alongside it, so nothing here is the only source of
// any information. Wiring selection/detail panels into the canvas is Phase B;
// shipping it to real visitors waits on the Phase D decision, which needs the
// #56 before/after sample that doesn't exist yet.

/**
 * Approximates the emerald design token per theme. The tokens are authored in
 * oklch, which three.js can't parse, so these are the nearest sRGB values —
 * close enough for a prototype. Reading the real computed token is a Phase B
 * concern, once the scene is worth matching pixel-for-pixel.
 */
type Palette = {
  accent: string;
  node: string;
  edge: string;
  fog: string;
  grid: string;
  label: string;
};

const PALETTE: Record<"dark" | "light", Palette> = {
  dark: {
    accent: "#34d399",
    node: "#0d3b32",
    edge: "#1f6f5c",
    fog: "#0f0e0d",
    grid: "#2a4a42",
    label: "#a7c3ba",
  },
  light: {
    accent: "#047857",
    node: "#d6efe6",
    edge: "#7fc9ae",
    fog: "#fafaf7",
    grid: "#b9d8cc",
    label: "#3f5f55",
  },
};

const NODE_RADIUS = 0.34;
const PULSE_RADIUS = 0.09;
/** Seconds for one pulse to travel an edge end to end. */
const PULSE_TRAVEL_SECONDS = 2.4;
/** How far the camera drifts with the cursor, in world units. */
const PARALLAX_RANGE = 0.55;
/**
 * Framing for the whole graph; `toScene` centers geometry on the origin.
 * Pulled back and raised enough to keep the lower side-cluster shelf inside
 * the frame, and angled so the grid conveys depth instead of reading flat.
 */
const CAMERA_ORIGIN: [number, number, number] = [0.6, 4.6, 11.5];
/** The camera aims slightly below center so both shelves sit in frame. */
const CAMERA_TARGET: [number, number, number] = [0, -0.5, 0];

/** Lifts each connection into a shallow arc so overlapping runs stay readable. */
function curveFor(edge: SceneEdge): THREE.QuadraticBezierCurve3 {
  const from = new THREE.Vector3(...edge.fromPosition);
  const to = new THREE.Vector3(...edge.toPosition);
  const mid = from.clone().lerp(to, 0.5);
  mid.y += from.distanceTo(to) * 0.22;
  return new THREE.QuadraticBezierCurve3(from, mid, to);
}

function Nodes({ points, palette }: { points: ScenePoint[]; palette: Palette }) {
  return (
    <>
      {points.map((point) => (
        <group key={point.id} position={point.position}>
          <mesh>
            <icosahedronGeometry args={[NODE_RADIUS, 2]} />
            <meshStandardMaterial
              color={palette.node}
              emissive={palette.accent}
              // Detached nodes glow less, echoing the 2.5D view's quieter
              // treatment of things outside the request path.
              emissiveIntensity={point.connected ? 0.45 : 0.18}
              roughness={0.35}
              metalness={0.1}
              transparent
              opacity={0.92}
            />
          </mesh>
          <mesh>
            <icosahedronGeometry args={[NODE_RADIUS * 1.35, 1]} />
            <meshBasicMaterial
              color={palette.accent}
              wireframe
              transparent
              opacity={point.connected ? 0.22 : 0.1}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

/** Reused across every projection so the per-frame loop allocates nothing. */
const projectionScratch = new THREE.Vector3();

/** Height of a node's caption above its centre, alternating by reading order. */
function labelOffsetFor(point: ScenePoint): number {
  // Several captions run long ("namespaces: mcp / bff / vos / monitoring")
  // and collide with their neighbours when every label sits at one height.
  return NODE_RADIUS + (point.depth % 2 === 0 ? 0.46 : 1.06);
}

/**
 * Projects world positions to screen space and drives the HTML captions that
 * live outside the canvas.
 *
 * Hand-rolled rather than using drei's `<Html>`: drei pulls in
 * `camera-controls`, which requires Node >= 22, and this project's baseline
 * is Node 20 (.nvmrc, CI, and `engines`). Labels were the only thing drei was
 * providing, so projecting them directly keeps the dependency out entirely —
 * see docs/topology-3d-spike.md.
 *
 * Writes straight to `style` instead of through React state: this runs per
 * frame, and re-rendering the tree 60 times a second to move some text would
 * be the single most expensive thing in the scene.
 */
function LabelProjector({
  points,
  elements,
}: {
  points: ScenePoint[];
  elements: React.RefObject<(HTMLElement | null)[]>;
}) {
  useFrame((state) => {
    points.forEach((point, i) => {
      const element = elements.current[i];
      if (!element) return;

      projectionScratch.set(point.position[0], point.position[1], point.position[2]);
      projectionScratch.y += labelOffsetFor(point);
      projectionScratch.project(state.camera);

      const x = (projectionScratch.x * 0.5 + 0.5) * state.size.width;
      const y = (-projectionScratch.y * 0.5 + 0.5) * state.size.height;
      element.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      // z > 1 means the point is behind the camera; hide rather than
      // rendering a caption mirrored onto the wrong side of the screen.
      element.style.opacity = projectionScratch.z > 1 ? "0" : point.connected ? "1" : "0.65";
    });
  });

  return null;
}

/**
 * Perspective floor grid — the cheapest way to make the depth readable.
 * Without it the nodes read as flat circles no matter how the camera is
 * angled, because nothing else in the scene establishes a ground plane.
 */
function Grid({ palette }: { palette: Palette }) {
  return (
    <gridHelper
      args={[26, 26, palette.grid, palette.grid]}
      position={[0, -2.6, 0]}
      // gridHelper lies in the XZ plane already; the material tweak below is
      // what keeps it a hint rather than a focal point.
    >
      <meshBasicMaterial attach="material" color={palette.grid} transparent opacity={0.25} />
    </gridHelper>
  );
}

function Connections({ edges, palette }: { edges: SceneEdge[]; palette: Palette }) {
  const tubes = useMemo(
    () => edges.map((edge) => new THREE.TubeGeometry(curveFor(edge), 40, 0.022, 8, false)),
    [edges],
  );

  return (
    <>
      {tubes.map((geometry, i) => (
        <mesh key={i} geometry={geometry}>
          <meshBasicMaterial color={palette.edge} transparent opacity={0.55} />
        </mesh>
      ))}
    </>
  );
}

/**
 * One emerald pulse per connection, staggered so the whole path reads as
 * traffic moving through the system rather than a synchronized blink.
 */
function Pulses({
  edges,
  palette,
  animate,
}: {
  edges: SceneEdge[];
  palette: Palette;
  animate: boolean;
}) {
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const curves = useMemo(() => edges.map(curveFor), [edges]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    curves.forEach((curve, i) => {
      const mesh = meshes.current[i];
      if (!mesh) return;
      // Static pose under reduced motion: parked mid-run so the connection
      // still reads as carrying traffic without anything moving.
      const t = animate
        ? ((elapsed + i * (PULSE_TRAVEL_SECONDS / Math.max(curves.length, 1))) /
            PULSE_TRAVEL_SECONDS) %
          1
        : 0.5;
      mesh.position.copy(curve.getPointAt(t));
    });
  });

  return (
    <>
      {curves.map((_, i) => (
        <mesh
          key={i}
          ref={(node) => {
            meshes.current[i] = node;
          }}
        >
          <sphereGeometry args={[PULSE_RADIUS, 12, 12]} />
          <meshBasicMaterial color={palette.accent} />
        </mesh>
      ))}
    </>
  );
}

/**
 * Guided camera: a small cursor-driven drift, never a free orbit. Eases
 * toward the target so the scene settles instead of tracking the pointer
 * one-to-one, and stays put entirely under reduced motion.
 *
 * Reads camera and pointer off the per-frame state rather than closing over
 * values destructured during render — mutating those would be a render-scope
 * escape the React compiler (rightly) rejects.
 */
function CameraDrift({ enabled }: { enabled: boolean }) {
  useFrame((state) => {
    if (enabled) {
      const targetX = CAMERA_ORIGIN[0] + state.pointer.x * PARALLAX_RANGE;
      const targetY = CAMERA_ORIGIN[1] + state.pointer.y * PARALLAX_RANGE * 0.6;
      state.camera.position.x += (targetX - state.camera.position.x) * 0.04;
      state.camera.position.y += (targetY - state.camera.position.y) * 0.04;
    }
    // Aimed every frame, including the single on-demand frame drawn under
    // reduced motion — otherwise that pose would keep three's default
    // origin-facing camera and sit mis-framed.
    state.camera.lookAt(...CAMERA_TARGET);
  });

  return null;
}

export default function Topology3D({
  scene,
  active,
  reducedMotion,
}: {
  scene: Scene;
  /** False when offscreen or the tab is hidden — stops the render loop. */
  active: boolean;
  reducedMotion: boolean;
}) {
  const [isDark, setIsDark] = useState(true);

  // next-themes toggles `.dark` on <html>. Observing the attribute (rather
  // than reading it once) keeps the scene in sync when the user hits the
  // theme toggle while the canvas is already mounted.
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsDark(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const palette = isDark ? PALETTE.dark : PALETTE.light;
  const animate = active && !reducedMotion;
  const labelElements = useRef<(HTMLElement | null)[]>([]);

  return (
    <div className="relative h-full w-full">
      <Canvas
        // Anything continuous must stop when the section scrolls away or the
        // tab is backgrounded. "demand" drops the rAF loop and only redraws when
        // props change, which also gives reduced motion a correct static frame.
        frameloop={animate ? "always" : "demand"}
        dpr={[1, 1.5]}
        camera={{ position: CAMERA_ORIGIN, fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <fog attach="fog" args={[palette.fog, 12, 26]} />
        <ambientLight intensity={isDark ? 0.5 : 0.85} />
        <directionalLight position={[4, 6, 5]} intensity={isDark ? 1.1 : 0.9} />
        <Grid palette={palette} />
        <Connections edges={scene.edges} palette={palette} />
        <Pulses edges={scene.edges} palette={palette} animate={animate} />
        <Nodes points={scene.points} palette={palette} />
        <CameraDrift enabled={animate} />
        <LabelProjector points={scene.points} elements={labelElements} />
      </Canvas>

      {/* Captions live outside the canvas so they stay real text: legible at
          any DPR and styled with the same tokens as the rest of the page.
          LabelProjector positions them from the camera every frame. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {scene.points.map((point, i) => (
          <span
            key={point.id}
            ref={(element) => {
              labelElements.current[i] = element;
            }}
            className="absolute left-0 top-0 select-none whitespace-nowrap font-mono text-[10px]"
            style={{ color: palette.label, opacity: 0 }}
          >
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}
