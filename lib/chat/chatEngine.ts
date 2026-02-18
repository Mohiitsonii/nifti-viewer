import type { ChatMessage } from '@/types/chat';
import type { NiftiHeaderSummary, SegmentationData, VolumeData } from '@/types/viewer';
import { calculateSegmentationStats } from '@/lib/segmentation/mockSegmentation';

interface ChatContext {
  volume: VolumeData | null;
  metadata: NiftiHeaderSummary | null;
  segmentation: SegmentationData | null;
  history: ChatMessage[];
}

export const generateMockAssistantResponse = async (query: string, context: ChatContext): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 280));

  if (!context.volume || !context.metadata) {
    return 'Please upload a NIfTI volume first, then I can answer metadata and segmentation questions.';
  }

  const normalized = query.toLowerCase();
  if (normalized.includes('dimension') || normalized.includes('size')) {
    return `Volume dimensions are ${context.metadata.dimensions.join(' x ')} voxels with spacing ${context.metadata.voxelSpacing.join(' x ')} mm.`;
  }

  if (normalized.includes('segment') || normalized.includes('tumor') || normalized.includes('mask')) {
    const stats = calculateSegmentationStats(context.segmentation);
    return stats.voxels > 0
      ? `Segmentation occupies ${stats.voxels.toLocaleString()} voxels (${(stats.ratio * 100).toFixed(2)}% of volume).`
      : 'Segmentation is not available yet. Upload or generate a mask.';
  }

  if (normalized.includes('intensity') || normalized.includes('window')) {
    return `Intensity range is ${context.volume.min.toFixed(2)} to ${context.volume.max.toFixed(2)}. Adjust windowing in the toolbar for better contrast.`;
  }

  return `Loaded file: ${context.volume.sourceFileName}. Ask me about dimensions, segmentation, or intensity.`;
};
