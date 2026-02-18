'use client';

import { FileUpload } from '@/components/viewer/FileUpload';
import { useViewerStore } from '@/store/viewerStore';

export const Toolbar = () => {
  const showSegmentation = useViewerStore((state) => state.showSegmentation);
  const toggleSegmentation = useViewerStore((state) => state.toggleSegmentation);
  const windowing = useViewerStore((state) => state.windowing);
  const setWindowing = useViewerStore((state) => state.setWindowing);
  const zoom = useViewerStore((state) => state.zoom);
  const setZoom = useViewerStore((state) => state.setZoom);

  return (
    <div className="toolbar">
      <FileUpload />
      <button className="btn" type="button" onClick={toggleSegmentation}>
        {showSegmentation ? 'Hide Segmentation' : 'Show Segmentation'}
      </button>
      <label>
        WW
        <input
          className="input"
          style={{ width: 90, marginLeft: 8 }}
          type="number"
          value={Math.round(windowing.width)}
          onChange={(e) => setWindowing({ width: Number(e.target.value) })}
        />
      </label>
      <label>
        WC
        <input
          className="input"
          style={{ width: 90, marginLeft: 8 }}
          type="number"
          value={Math.round(windowing.center)}
          onChange={(e) => setWindowing({ center: Number(e.target.value) })}
        />
      </label>
      <label>
        Zoom
        <input
          className="input"
          style={{ width: 80, marginLeft: 8 }}
          type="number"
          step="0.1"
          min={0.25}
          max={6}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
      </label>
    </div>
  );
};
