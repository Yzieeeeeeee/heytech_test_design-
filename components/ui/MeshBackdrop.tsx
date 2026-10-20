'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

/**
 * MeshBackdrop
 * ---------------------------------------------------------------------------
 * The low-poly triangle mesh used behind hero, process and closing sections —
 * drawn as inline SVG so it costs a single request-free node, scales crisply
 * and inherits theme colours.
 *
 * Nodes are generated deterministically from a fixed seed, which keeps server
 * and client markup identical (no hydration mismatch) and avoids any layout
 * work at runtime.
 */

interface MeshBackdropProps {
  className?: string;
  /** Visual weight of the mesh lines. */
  opacity?: number;
  /** Number of node rows/columns — lower on mobile for cheaper paint. */
  density?: number;
  /** Adds the soft red / cyan radial glows layered behind the mesh. */
  glows?: boolean;
}

function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function MeshBackdrop({
  className,
  opacity = 0.5,
  density = 7,
  glows = true,
}: MeshBackdropProps) {
  const { nodes, lines, width, height } = useMemo(() => {
    const random = mulberry32(20260214);
    const w = 1200;
    const h = 760;
    const cols = density;
    const rows = Math.max(4, Math.round(density * 0.62)); // responsive density
    const pts: Array<{ x: number; y: number }> = [];

    const cellW = w / (cols - 1);
    const cellH = h / (rows - 1);

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const jitterX = (random() - 0.5) * cellW * 0.85;
        const jitterY = (random() - 0.5) * cellH * 0.85;
        pts.push({
          x: c * cellW + jitterX,
          y: r * cellH + jitterY,
        });
      }
    }

    const at = (r: number, c: number) => pts[r * cols + c];
    const segments: Array<{ x1: number; y1: number; x2: number; y2: number; strong: boolean }> = [];

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const p = at(r, c);
        if (!p) continue;
        const right = c + 1 < cols ? at(r, c + 1) : null;
        const down = r + 1 < rows ? at(r + 1, c) : null;
        const diag = c + 1 < cols && r + 1 < rows ? at(r + 1, c + 1) : null;
        const anti = c - 1 >= 0 && r + 1 < rows ? at(r + 1, c - 1) : null;

        if (right) segments.push({ x1: p.x, y1: p.y, x2: right.x, y2: right.y, strong: random() > 0.72 });
        if (down) segments.push({ x1: p.x, y1: p.y, x2: down.x, y2: down.y, strong: random() > 0.72 });
        if (diag && random() > 0.45) segments.push({ x1: p.x, y1: p.y, x2: diag.x, y2: diag.y, strong: random() > 0.8 });
        if (anti && random() > 0.72) segments.push({ x1: p.x, y1: p.y, x2: anti.x, y2: anti.y, strong: random() > 0.86 });
      }
    }

    return { nodes: pts, lines: segments, width: w, height: h };
  }, [density]);

  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {glows && (
        <>
          <div
            className="absolute -left-[15%] top-[-25%] h-[70%] w-[70%] rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, var(--glow-cyan) 0%, transparent 68%)` }}
          />
          <div
            className="absolute bottom-[-30%] right-[-10%] h-[65%] w-[65%] rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, var(--glow-red) 0%, transparent 70%)` }}
          />
        </>
      )}

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity }}
      >
        <g strokeWidth="1" fill="none">
          {lines.map((line, index) => (
            <line
              key={`${line.x1.toFixed(0)}-${line.y1.toFixed(0)}-${index}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.strong ? 'var(--mesh)' : 'var(--mesh-2)'}
              opacity={line.strong ? 1 : 0.6}
            />
          ))}
        </g>
        <g>
          {nodes.map((node, index) =>
            index % 4 === 0 ? (
              <circle
                key={`${node.x.toFixed(0)}-${node.y.toFixed(0)}`}
                cx={node.x}
                cy={node.y}
                r={1.6}
                fill="var(--mesh)"
                opacity={0.75}
              />
            ) : null,
          )}
        </g>
      </svg>
    </div>
  );
}

export default MeshBackdrop;
