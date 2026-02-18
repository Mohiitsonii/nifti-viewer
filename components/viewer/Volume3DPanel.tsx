'use client';

import { useEffect, useRef } from 'react';
import { createVolumeRenderer, type VtkRendererHandle } from '@/lib/vtk/volumeRenderer';
import { useViewerStore } from '@/store/viewerStore';

export const Volume3DPanel = () => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<VtkRendererHandle | null>(null);

  const volume = useViewerStore((state) => state.volume);
  const segmentation = useViewerStore((state) => state.segmentation);
  const showSegmentation = useViewerStore((state) => state.showSegmentation);

  useEffect(() => {
    if (!hostRef.current) return;
    rendererRef.current = createVolumeRenderer(hostRef.current);

    return () => {
      rendererRef.current?.destroy();
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!volume || !rendererRef.current) return;
    rendererRef.current.render(volume, segmentation, showSegmentation);
  }, [volume, segmentation, showSegmentation]);

  return (
    <div className="panel">
      <h3>3D Volume</h3>
      <div className="canvas-wrapper">
        <div ref={hostRef} data-render-canvas="true" />
      </div>
    </div>
  );
};
