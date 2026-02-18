# NIfTI Browser Viewer

Production-oriented, frontend-only medical imaging viewer built with Next.js App Router + TypeScript. Supports NIfTI upload/parsing in a Web Worker, 2D tri-planar slice visualization, segmentation overlay, vtk.js volume rendering, and a contextual chat panel.

## 1) Project setup commands

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run start
```

## 2) Folder structure

```text
app/
components/
  chat/
  viewer/
hooks/
lib/
  chat/
  cornerstone/
  nifti/
  segmentation/
  vtk/
store/
types/
utils/
workers/
```

## 3) Step-by-step build order implemented

1. Project setup (package/config)
2. Folder structure
3. Type definitions
4. Zustand stores
5. Worker setup
6. NIfTI parsing module
7. File upload
8. Slice viewer panels
9. Multi-view layout + toolbar
10. Segmentation overlay
11. 3D vtk volume renderer
12. Chat system
13. Integration in main app page

## 4) Run project

```bash
npm run dev
```

Open `http://localhost:3000`.
