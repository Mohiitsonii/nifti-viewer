'use client';

import { Toolbar } from '@/components/viewer/Toolbar';
import { SlicePanel } from '@/components/viewer/SlicePanel';
import { Volume3DPanel } from '@/components/viewer/Volume3DPanel';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { useVolumeData } from '@/hooks/useVolumeData';

export const ViewerLayout = () => {
  const { metadata, error, isLoading } = useVolumeData();

  return (
    <div className="viewer-shell">
      <main className="main-viewer">
        <Toolbar />
        <div className="viewer-grid">
          <SlicePanel orientation="axial" title="Axial" />
          <SlicePanel orientation="sagittal" title="Sagittal" />
          <SlicePanel orientation="coronal" title="Coronal" />
          <Volume3DPanel />
        </div>
        <div style={{ padding: '0 0.75rem 0.75rem' }}>
          {isLoading && <div>Processing volume with worker...</div>}
          {error && <div className="error">{error}</div>}
          {metadata && (
            <div>
              Loaded dimensions: {metadata.dimensions.join(' x ')} | spacing: {metadata.voxelSpacing.join(' x ')} mm
            </div>
          )}
        </div>
      </main>
      <ChatPanel />
    </div>
  );
};
