
export enum RenderStyle {
  // Realism Spectrum
  CONCEPTUAL = 'Conceptual',
  SEMI_REALISTIC = 'Semi-Realistic',
  PHOTOREALISTIC = 'Photorealistic',
  HYPERREAL = 'Hyperreal / Cinematic',
  SATELLITE_DRONE = 'Satellite to Drone',

  // 3D Model-Based
  WIREFRAME = 'Wireframe',
  CLAY = 'Clay Render',
  WHITE_MODEL = 'White Model',
  AMBIENT_OCCLUSION = 'Ambient Occlusion',

  MATERIAL_STUDY = 'Material Study',
  LIGHTING_STUDY = 'Lighting Study',

  // Stylized / NPR
  TOON_CEL = 'Toon / Cel-Shaded',
  SKETCHY_NPR = 'Sketchy NPR',
  WATERCOLOR_NPR = 'Watercolor NPR',
  MINIATURE = 'Miniature / Tilt-Shift',
  LOW_POLY = 'Low Poly',

  // Hand-Drawn / Analog
  PENCIL_SKETCH = 'Pencil Sketch',
  INK_LINE = 'Ink Line Drawing',
  MARKER_RENDERING = 'Marker Rendering',
  WATERCOLOR_WASH = 'Watercolor Wash',
  CHARCOAL = 'Charcoal / Graphite',
  PASTEL = 'Pastel / Chalk',
  TECHNICAL_PEN = 'Technical Pen',
  BLUEPRINT = 'Blueprint',

  // Legacy mappings (for backward compatibility if needed)
  FUTURISTIC = 'Futuristic',
  SKETCHY = 'Sketchy',
  WATERCOLOR = 'Watercolor',
  RAW_SKETCH = 'Raw Sketch',
  CARTOONISH = 'Cartoonish',
  COMIC_BOOK = 'Comic Book',
  ULTRA_RENDER = 'Ultra Render',
  CONCEPT_SKETCH = 'Concept Sketch'
}

export enum InteriorStyle {
  PHOTOREALISTIC = 'Photorealistic',
  DHAKA_LUXURY = 'Dhaka Luxury',
  ART_DECO = 'Art Deco',
  FUTURISTIC_INT = 'Futuristic',
  PARAMETRIC = 'Parametric',
  MINIMALIST = 'Minimalist',
  BRUTALIST = 'Brutalist',
  BOHO = 'Boho',
  CLASSICAL = 'Classical',
  POST_MODERN = 'Post Modern',
  DOODLE_ART = 'Doodle Art',
  SCANDINAVIAN = 'Scandinavian',
  INDUSTRIAL = 'Industrial'
}

export type Atmosphere = 'High-key' | 'Golden Hour' | 'Blue Hour' | 'Night' | 'Fog/Rain/Snow' | 'Brutal Contrast';

export type CreateMode = 'Exterior' | 'Interior';

export enum ViewType {
  PERSPECTIVE = 'Perspective Render',
  PLAN = 'Floor Plan',
  ELEVATION = 'Elevation',
  SECTION = 'Section',
  AXONOMETRIC = 'Axonometric',
  TOPSHOT = 'Top Shot (Bird\'s Eye)',
  DETAILS = 'Architectural Details'
}

export enum DiagramType {
  CONCEPT = 'Concept / Schematic',
  EXPLODED = 'Exploded Axonometric',
  PROGRAMMATIC = 'Programmatic & Zoning',
  CIRCULATION = 'Circulation & Flow',
  ENVIRONMENTAL = 'Climate & Environmental',
  SECTIONAL_PERSP = 'Sectional Perspective',
  ACTIVITY = 'Activity & Usage',
  GEOMETRY = 'Geometric Analysis',
  STRUCTURE = 'Structural Tectonics',
  URBAN_CONTEXT = 'Urban Context & Mapping',
  FORM_EVOLUTION = 'Form Evolution',
  LIVING_COLLAGE = 'Living Collage Cutaway'
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
export type ImageSize = '1K' | '2K' | '4K';
export type ElevationSide = 'Front' | 'Back' | 'Left' | 'Right';

export interface CustomStyle {
  id: string;
  name: string;
  prompt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface IdeationConfig {
  innovationLevel: number; // 0-100
  material: string;
  formLanguage: string;
  elevationSide?: ElevationSide;
  timeOfDay?: string;
}

export interface GenerationResult {
  id: string;
  originalImage: string; // Base64
  siteImage?: string | null; // Base64 (Optional context)
  referenceImage?: string | null; // Base64 (Optional style/material reference)
  generatedImage: string; // Base64 or URL
  style: string; // Changed from RenderStyle to string to support custom styles
  viewType: ViewType;
  diagramType?: DiagramType; // New field for diagram history
  aspectRatio?: AspectRatio;
  imageSize?: ImageSize;
  prompt: string;
  timestamp: number;
  selectedVerbs?: string[]; // New: Store the operative verbs used
  ideationConfig?: IdeationConfig; // New: Store ideation specific settings
  createMode?: CreateMode; // Store if it was interior or exterior
  atmospheres?: Atmosphere[]; // New: Store selected atmospheres
  elevationSide?: ElevationSide; // New: Store specific elevation side for history
}

export interface UserCredits {
  available: number;
  totalUsed: number;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
