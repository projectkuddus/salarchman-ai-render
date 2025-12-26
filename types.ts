export enum RenderStyle {
  // Realism Spectrum
  CONCEPTUAL = 'Conceptual',
  SEMI_REALISTIC = 'Semi-Realistic',
  PHOTOREALISTIC = 'Photorealistic',
  HYPERREAL = 'Hyperreal / Cinematic',
  TRANSLUCENT_ETHEREAL = 'Translucent Ethereal',
  SATELLITE_DRONE = 'Satellite to Drone',
  EVENING_LIGHT = 'Evening Light',
  EVENING_LIGHT_2 = 'Evening 2',
  GOLDEN_HOUR_DRAMATIC = 'Dramatic Golden Hour',

  // 3D Model-Based
  WIREFRAME = 'Wireframe',
  CLAY = 'Clay Render',
  WHITE_MODEL = 'White Model',
  PAPER_MODEL = 'Paper Model',
  AMBIENT_OCCLUSION = 'Ambient Occlusion',

  MATERIAL_STUDY = 'Material Study',
  LIGHTING_STUDY = 'Lighting Study',

  // Stylized / NPR
  TOON_CEL = 'Toon / Cel-Shaded',
  SKETCHY_NPR = 'Sketchy NPR',
  WATERCOLOR_NPR = 'Watercolor NPR',
  MINIATURE = 'Miniature / Tilt-Shift',
  LOW_POLY = 'Low Poly',
  DESERT_RUIN = 'Desert Ruin',

  // Hand-Drawn / Analog
  PENCIL_SKETCH = 'Pencil Sketch',
  INK_LINE = 'Ink Line Drawing',
  MARKER_RENDERING = 'Marker Rendering',
  WATERCOLOR_WASH = 'Watercolor Wash',
  CHARCOAL = 'Charcoal / Graphite',
  PASTEL = 'Pastel / Chalk',
  TECHNICAL_PEN = 'Technical Pen',
  BLUEPRINT = 'Blueprint',
  ARCH_DOODLE = 'Architectural Doodle',
  GAZIR_POT = 'Gazir Pot',

  // Architectural Model Photography
  METAL_MODEL = 'Metal Model',
  CONCRETE_MODEL = 'Concrete Model',
  WOOD_MODEL = 'Wood Model',
  RED_BRICK_MODEL = 'Red Brick Model',
  BRONZE_MODEL = 'Bronze Model',
  RED_CONCRETE_MODEL = 'Red Concrete Model',
  CONCRETE_PLANS_MODEL = 'Concrete & Plans Model',
  WOOD_VEGETATION_MODEL = 'Wood & Vegetation Model',
  WOOD_WHITE_MODEL = 'Wood & White Model',
  DARK_BRUTALIST_MODEL = 'Dark Brutalist Model',
  GREY_CARDBOARD_MODEL = 'Grey Cardboard Model',
  LEGO_MODEL = 'Lego Model',
  CITY_MODEL_3D_PRINT = '3D Printed City Model',
  WIREFRAME_GLASS_MODEL = 'Wireframe & Glass Model',
  WOODEN_STRUCTURE_TERRACOTTA_MODEL = 'Wooden Structure & Terracotta Model',
  PASTEL_WOOD_GREEN_MODEL = 'Pastel Wood & Green Model',
  METALLIC_WOOD_MODEL = 'Metallic & Wood Model',
  WHITE_ARCHITECTURAL_MODEL = 'White Architectural Model',
  CONCRETE_WHITE_MODEL = 'Concrete & White Structure Model',
  WOOD_ACRYLIC_MODEL = 'Wood & Acrylic Model',
  URBAN_CONCEPT_SKETCH = 'Urban Concept Sketch',
  VIBRANT_DIGITAL_PAINTING = 'Vibrant Digital Painting',
  KRAFT_PAPER_SKETCH = 'Kraft Paper Sketch',

  // Legacy mappings (for backward compatibility if needed)
  FUTURISTIC = 'Futuristic',
  SKETCHY = 'Sketchy',
  WATERCOLOR = 'Watercolor',
  RAW_SKETCH = 'Raw Sketch',
  CARTOONISH = 'Cartoonish',
  COMIC_BOOK = 'Comic Book',
  ULTRA_RENDER = 'Ultra Render',
  CONCEPT_SKETCH = 'Concept Sketch',
  SIMILAR_TO_REF = 'Similar to Reference Image'
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
  INDUSTRIAL = 'Industrial',
  AMBER_TEXTURED = 'Amber Textured',
  AMBER_NOIR = 'Amber Noir',
  PAPER_MODEL = 'Paper Model',
  GAZIR_POT = 'Gazir Pot',
  BLUE_AMBIENCE = 'Blue Ambience',
  SOFT_BRUTALIST = 'Soft Brutalist',
  SIMILAR_TO_REF = 'Similar to Reference Image'
}

export type Atmosphere = 'High-key' | 'Golden Hour' | 'Blue Hour' | 'Night' | 'Fog/Rain/Snow' | 'Brutal Contrast';

export type CreateMode = 'Exterior' | 'Interior';

export enum ViewType {
  PERSPECTIVE = 'Perspective Render',
  PLAN = 'Floor Plan',
  ELEVATION = 'Elevation',
  SECTION = 'Section',
  AXONOMETRIC = 'Axonometric',
  ISOMETRIC = 'Isometric',
  TOPSHOT = 'Top Shot (Bird\'s Eye)',
  DETAILS = 'Architectural Details',
  SIMILAR_TO_INPUT = 'Similar to Input Image',
  SIMILAR_TO_REF = 'Similar to Reference Image'
}

export enum DiagramType {
  CONCEPT = 'Concept / Schematic',
  EXPLODED = 'Exploded Axonometric',
  PROGRAMMATIC = 'Programmatic & Zoning',
  ZONING = 'Zoning Diagram',
  CIRCULATION = 'Circulation & Flow',
  ENVIRONMENTAL = 'Climate & Environmental',
  SECTIONAL_PERSP = 'Sectional Perspective',
  ACTIVITY = 'Activity & Usage',
  GEOMETRY = 'Geometric Analysis',
  STRUCTURE = 'Structural Tectonics',
  URBAN_CONTEXT = 'Urban Context & Mapping',
  FORM_EVOLUTION = 'Form Evolution',
  LIVING_COLLAGE = 'Living Collage Cutaway',

  // Core Drawing Set
  MASTER_PLAN = 'Master Plan / Site Plan',
  FLOOR_PLAN = 'Floor Plan',
  SECTION = 'Section',
  ELEVATION = 'Elevation',
  ROOF_PLAN = 'Roof Plan',

  // Concept Story
  PARTI_DRAWING = 'Parti Drawing',
  KEY_PRINCIPLES = 'Key Principles',

  // Diagram Arsenal
  SUN_PATH = 'Sun Path & Shading',
  WIND_FLOW = 'Wind Flow & Ventilation',
  VIEWS_PRIVACY = 'Views & Privacy',
  NOISE_MAP = 'Noise Map',
  SLOPE_DRAINAGE = 'Slope & Drainage',
  LANDSCAPE_TREES = 'Landscape & Trees',
  ACCESS_DROPOFF = 'Access & Drop-off',
  ADJACENCY_BUBBLE = 'Adjacency / Bubble',
  PROCESSIONAL = 'Processional Sequence',
  TIME_OF_DAY = 'Time-of-Day Use',
  ENVELOPE_SHADING = 'Envelope & Shading',
  PASSIVE_COOLING = 'Passive Cooling',
  WATER_STRATEGY = 'Water Strategy',
  SUSTAINABILITY = 'Sustainability Scorecard',

  // Signature
  ICONIC_DIAGRAM = 'Iconic Diagram',
  EXPLODED_PERSPECTIVE = 'Exploded Perspective',
  STORYBOARD = 'Storyboard Strip',
  CINEMATIC_PANEL = 'Cinematic Sequence',
  MATERIAL_PALETTE = 'Material Palette',

  // Advanced
  DATA_DRIVEN = 'Data-Driven Diagram',
  PARAMETRIC_GROWTH = 'Parametric Growth',
  ASSEMBLY_SEQUENCE = 'Assembly Sequence',
  PHASING = 'Phasing Diagram',
  COST_LOGIC = 'Cost Logic',
  ACCESSIBILITY = 'Accessibility Strategy',
  FIRE_STRATEGY = 'Fire Strategy',

  // Motion
  MOTION_FILM = '60-120s Film',
  ANIMATED_DIAGRAM = 'Animated Diagram',
  WALKTHROUGH_3D = '3D Walkthrough'
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | 'Similar to Input' | 'Similar to Reference';
export type ImageSize = '1K' | '2K' | '4K';
export type ElevationSide = 'Front' | 'Back' | 'Left' | 'Right';

export interface CustomStyle {
  id: string;
  name: string;
  prompt: string;
}

export enum UserTier {
  FREE = 'Free',
  PRO = 'Pro',
  STUDIO = 'Studio'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: UserTier;
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
  additionalBaseImages?: string[]; // Base64[] (Optional additional angles)
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
