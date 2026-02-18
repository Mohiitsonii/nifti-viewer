import '@kitware/vtk.js/Rendering/Profiles/Volume';
import vtkGenericRenderWindow from 'vtk.js/Sources/Rendering/Misc/GenericRenderWindow';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';
import type { SegmentationData, VolumeData } from '@/types/viewer';

export interface VtkRendererHandle {
  destroy: () => void;
  render: (volume: VolumeData, segmentation: SegmentationData | null, showSegmentation: boolean) => void;
}

export const createVolumeRenderer = (container: HTMLDivElement): VtkRendererHandle => {
  const grw = vtkGenericRenderWindow.newInstance({ background: [0.08, 0.09, 0.12] });
  grw.setContainer(container);
  grw.resize();

  const renderer = grw.getRenderer();
  const renderWindow = grw.getRenderWindow();

  const mapper = vtkVolumeMapper.newInstance();
  mapper.setSampleDistance(0.7);

  const actor = vtkVolume.newInstance();
  actor.setMapper(mapper);

  const color = vtkColorTransferFunction.newInstance();
  const opacity = vtkPiecewiseFunction.newInstance();

  actor.getProperty().setRGBTransferFunction(0, color);
  actor.getProperty().setScalarOpacity(0, opacity);
  actor.getProperty().setShade(true);
  actor.getProperty().setAmbient(0.2);
  actor.getProperty().setDiffuse(0.7);
  actor.getProperty().setSpecular(0.3);

  renderer.addVolume(actor);

  const render = (volume: VolumeData, segmentation: SegmentationData | null, showSegmentation: boolean) => {
    const imageData = vtkImageData.newInstance();
    imageData.setDimensions(...volume.dimensions);
    imageData.setSpacing(...volume.voxelSpacing);

    const scalars = vtkDataArray.newInstance({
      name: 'scalars',
      numberOfComponents: 1,
      values: volume.voxelData,
    });

    imageData.getPointData().setScalars(scalars);
    mapper.setInputData(imageData);

    const min = volume.min;
    const max = volume.max;
    const mid = (min + max) / 2;

    color.removeAllPoints();
    opacity.removeAllPoints();

    color.addRGBPoint(min, 0.0, 0.0, 0.0);
    color.addRGBPoint(mid, 0.5, 0.5, 0.6);
    color.addRGBPoint(max, 1.0, 1.0, 1.0);

    opacity.addPoint(min, 0.0);
    opacity.addPoint(mid, 0.15);
    opacity.addPoint(max, 0.85);

    if (segmentation && showSegmentation) {
      color.addRGBPoint(max * 1.01, 1.0, 0.3, 0.4);
      opacity.addPoint(max * 1.01, 0.95);
    }

    renderer.resetCamera();
    renderWindow.render();
  };

  return {
    render,
    destroy: () => {
      renderer.removeAllViewProps();
      grw.delete();
    },
  };
};
