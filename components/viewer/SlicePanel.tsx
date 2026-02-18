'use client';

import { useEffect, useMemo, useRef } from 'react';
import { renderSliceToCanvas } from '@/lib/cornerstone/renderSlice';
import { useViewerStore } from '@/store/viewerStore';
import { useSliceNavigation } from '@/hooks/useSliceNavigation';
import type { Orientation } from '@/types/viewer';

interface SlicePanelProps {
  orientation: Orientation;
  title: string;
}

export const SlicePanel = ({ orientation, title }: SlicePanelProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const volume = useViewerStore((state) => state.volume);
  const segmentation = useViewerStore((state) => state.segmentation);
  const showSegmentation = useViewerStore((state) => state.showSegmentation);
  const windowing = useViewerStore((state) => state.windowing);
  const zoom = useViewerStore((state) => state.zoom);

  const { slice, maxSlice, setSlice } = useSliceNavigation(orientation);

  useEffect(() => {
    if (!canvasRef.current || !volume) return;
    renderSliceToCanvas(canvasRef.current, volume, orientation, slice, windowing, segmentation, showSegmentation);
  }, [orientation, segmentation, showSegmentation, slice, volume, windowing]);

  const wheelStep = useMemo(() => Math.max(1, Math.round(maxSlice / 80)), [maxSlice]);

  return (
    <div className="panel">
      <h3>{title}</h3>
      <div className="canvas-wrapper" onWheel={(e) => setSlice(slice + (e.deltaY > 0 ? wheelStep : -wheelStep))}>
        <canvas
          ref={canvasRef}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', imageRendering: 'pixelated' }}
        />
      </div>
      <div className="controls-row">
        <input
          type="range"
          min={0}
          max={maxSlice}
          value={slice}
          onChange={(e) => setSlice(Number(e.target.value))}
          style={{ width: '100%' }}
          disabled={!volume}
        />
        <span>
          {slice}/{maxSlice}
        </span>
      </div>
    </div>
  );
};
