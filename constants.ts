
import { RenderStyle, ViewType, ImageSize, DiagramType, InteriorStyle, Atmosphere } from './types';

// Credit costs based on resolution
export const CREDIT_COSTS: Record<ImageSize, number> = {
  '1K': 5,
  '2K': 7,
  '4K': 10
};

export const INITIAL_CREDITS = 50;

// Organize Exterior Styles into Segments
export const EXTERIOR_STYLE_CATEGORIES = [
  {
    title: "Realism Spectrum",
    styles: [
      RenderStyle.PHOTOREALISTIC, // Moved to top as primary default
      RenderStyle.SIMILAR_TO_REF,
      RenderStyle.HYPERREAL,
      RenderStyle.SEMI_REALISTIC,
      RenderStyle.CONCEPTUAL,
      RenderStyle.SATELLITE_DRONE
    ]
  },
  {
    title: "3D Model-Based",
    styles: [
      RenderStyle.WIREFRAME,
      RenderStyle.CLAY,
      RenderStyle.WHITE_MODEL,
      RenderStyle.PAPER_MODEL,
      RenderStyle.AMBIENT_OCCLUSION,

      RenderStyle.MATERIAL_STUDY,
      RenderStyle.LIGHTING_STUDY
    ]
  },
  {
    title: "Stylized / NPR",
    styles: [
      RenderStyle.TOON_CEL,
      RenderStyle.SKETCHY_NPR,
      RenderStyle.WATERCOLOR_NPR,
      RenderStyle.MINIATURE,
      RenderStyle.LOW_POLY
    ]
  },
  {
    title: "Hand-Drawn / Analog",
    styles: [
      RenderStyle.PENCIL_SKETCH,
      RenderStyle.INK_LINE,
      RenderStyle.MARKER_RENDERING,
      RenderStyle.WATERCOLOR_WASH,
      RenderStyle.CHARCOAL,
      RenderStyle.PASTEL,
      RenderStyle.TECHNICAL_PEN,
      RenderStyle.BLUEPRINT
    ]
  }
];

export const ATMOSPHERE_OPTIONS: Atmosphere[] = [
  'High-key',
  'Golden Hour',
  'Blue Hour',
  'Night',
  'Fog/Rain/Snow',
  'Brutal Contrast'
];

export const ATMOSPHERE_PROMPTS: Record<Atmosphere, string> = {
  'High-key': "High-key day lighting, very bright, clean white sky, soft shadows, airy 'developer brochure' aesthetic.",
  'Golden Hour': "Golden hour lighting, low warm sun, long dramatic shadows, orange/yellow glow, emotional and marketing-friendly.",
  'Blue Hour': "Blue hour/dusk lighting, deep twilight sky, warm artificial interior lights glowing against the cool exterior, cinematic.",
  'Night': "Night render, dark sky, dramatic artificial spotlighting, interior life visible through windows, high contrast.",
  'Fog/Rain/Snow': "Atmospheric weather condition, mist, fog, rain reflections on pavement, or soft snow, mood-focused depth.",
  'Brutal Contrast': "Brutal contrast, sharp direct sunlight, deep black shadows, chiaroscuro effect, strong geometric composition."
};

// Mapping styles to Unsplash thumbnail images for preview
export const EXTERIOR_STYLE_THUMBNAILS: Record<string, string> = {
  // Realism Spectrum
  [RenderStyle.PHOTOREALISTIC]: '/thumbnails/photorealistic.jpg',
  [RenderStyle.SIMILAR_TO_REF]: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=150&q=60&fm=webp',
  [RenderStyle.HYPERREAL]: '/thumbnails/hyperreal.jpg',
  [RenderStyle.SEMI_REALISTIC]: '/thumbnails/semi-realistic.jpg',
  [RenderStyle.CONCEPTUAL]: '/thumbnails/conceptual.jpg',
  [RenderStyle.SATELLITE_DRONE]: '/thumbnails/satellite.jpg',

  // 3D Model
  [RenderStyle.WIREFRAME]: '/thumbnails/wireframe.jpg',
  [RenderStyle.CLAY]: '/thumbnails/clay.jpg',
  [RenderStyle.WHITE_MODEL]: '/thumbnails/white-model.jpg',
  [RenderStyle.PAPER_MODEL]: '/paper-output.jpg',
  [RenderStyle.AMBIENT_OCCLUSION]: '/thumbnails/ambient-occlusion.jpg',

  [RenderStyle.MATERIAL_STUDY]: '/thumbnails/material-study.jpg',
  [RenderStyle.LIGHTING_STUDY]: '/thumbnails/lighting-study.jpg',

  // Stylized
  [RenderStyle.TOON_CEL]: '/thumbnails/toon.jpg',
  [RenderStyle.SKETCHY_NPR]: '/thumbnails/sketchy-npr.jpg',
  [RenderStyle.WATERCOLOR_NPR]: '/thumbnails/watercolor-npr.jpg',
  [RenderStyle.MINIATURE]: '/thumbnails/miniature.jpg',
  [RenderStyle.LOW_POLY]: '/thumbnails/low-poly.jpg',

  // Hand-Drawn
  [RenderStyle.PENCIL_SKETCH]: '/thumbnails/pencil-sketch.jpg',
  [RenderStyle.INK_LINE]: '/thumbnails/ink-line.jpg',
  [RenderStyle.MARKER_RENDERING]: '/thumbnails/marker.jpg',
  [RenderStyle.CHARCOAL]: '/thumbnails/charcoal.jpg',
  [RenderStyle.PASTEL]: '/thumbnails/pastel.jpg',
  [RenderStyle.WATERCOLOR_WASH]: '/thumbnails/watercolor-wash.jpg',
  [RenderStyle.TECHNICAL_PEN]: '/thumbnails/technical-pen.jpg',
  [RenderStyle.BLUEPRINT]: '/thumbnails/blueprint.jpg',

  // Legacy Fallbacks
  [RenderStyle.FUTURISTIC]: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=150&q=60&fm=webp",
  [RenderStyle.SKETCHY]: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150&q=60&fm=webp",
  [RenderStyle.WATERCOLOR]: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=150&q=60&fm=webp",
  [RenderStyle.RAW_SKETCH]: "https://images.unsplash.com/photo-1594813583279-7dd252c8032f?w=150&q=60&fm=webp",
  [RenderStyle.CARTOONISH]: "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?w=150&q=60&fm=webp",
  [RenderStyle.COMIC_BOOK]: "https://images.unsplash.com/photo-1560696950-68d71243765e?w=150&q=60&fm=webp",
  [RenderStyle.ULTRA_RENDER]: "https://images.unsplash.com/photo-1600596542815-2a4d04760252?w=150&q=60&fm=webp",
  [RenderStyle.CONCEPT_SKETCH]: "https://images.unsplash.com/photo-1565514020176-db79339a6a57?w=150&q=60&fm=webp"
};

export const STYLE_PROMPTS: Record<string, string> = {
  [RenderStyle.PHOTOREALISTIC]: "Photorealistic architectural render, high fidelity, realistic lighting and materials, 8k resolution, professional photography style.",
  [RenderStyle.SIMILAR_TO_REF]: "Match the exact architectural style, materials, lighting, and mood of the provided Style Reference image.",
  [RenderStyle.HYPERREAL]: "Hyperreal cinematic render, extreme detail, dramatic lighting, movie quality, atmospheric depth.",
  [RenderStyle.SEMI_REALISTIC]: "Semi-realistic render, clean and professional, suitable for early presentations, balanced detail.",
  [RenderStyle.CONCEPTUAL]: "Conceptual architectural render, focus on form and massing, abstract white or grey materials, clean aesthetic.",
  [RenderStyle.SATELLITE_DRONE]: "Satellite to Drone view, aerial photography style, realistic context integration, top-down or high angle.",
  [RenderStyle.WIREFRAME]: "Wireframe render, structural lines, blueprint aesthetic, technical view.",
  [RenderStyle.CLAY]: "Clay render, matte white material, ambient occlusion, focus on light and shadow volume.",
  [RenderStyle.WHITE_MODEL]: "White physical model look, clean materials, soft studio lighting, architectural scale model.",
  [RenderStyle.PAPER_MODEL]: "Architectural white paper model, pure white matte texture, thin paperly, Slightly creased, a bit crumpled, with a papery texture, Mildly crimped and crinkled. Clean precision cuts, layered paper edges, soft ambient occlusion shadows, studio lighting. Minimalist, abstract, high key. No colors, just white paper geometry.",
  [RenderStyle.AMBIENT_OCCLUSION]: "Ambient occlusion pass, greyscale, soft shadows showing geometry contacts.",

  [RenderStyle.MATERIAL_STUDY]: "Material study, focus on specific textures (wood, concrete, glass), close-up details.",
  [RenderStyle.LIGHTING_STUDY]: "Lighting study, focus on light interaction, shadows, and contrast, atmospheric.",
  [RenderStyle.TOON_CEL]: "Toon shaded / Cel-shaded style, bold outlines, flat colors, comic book or anime aesthetic.",
  [RenderStyle.SKETCHY_NPR]: "Sketchy Non-Photorealistic Render (NPR), loose lines, artistic hand-drawn feel.",
  [RenderStyle.WATERCOLOR_NPR]: "Watercolor NPR, soft edges, paint wash effects, artistic and fluid.",
  [RenderStyle.MINIATURE]: "Miniature tilt-shift effect, depth of field blur, toy-like scale model appearance.",
  [RenderStyle.LOW_POLY]: "Low poly art style, faceted geometry, vibrant colors, digital art aesthetic.",
  [RenderStyle.PENCIL_SKETCH]: "Pencil sketch style, graphite texture, rough hand-drawn lines on paper.",
  [RenderStyle.INK_LINE]: "Ink line drawing, sharp black lines on white, technical illustration quality.",
  [RenderStyle.MARKER_RENDERING]: "Marker rendering, alcohol marker textures, vibrant architectural sketch style.",
  [RenderStyle.WATERCOLOR_WASH]: "Watercolor wash, gentle gradients, soft artistic architectural illustration.",
  [RenderStyle.CHARCOAL]: "Charcoal drawing, deep blacks, smudged textures, dramatic high contrast.",
  [RenderStyle.PASTEL]: "Pastel drawing, soft chalky textures, gentle colors, artistic impression.",
  [RenderStyle.TECHNICAL_PEN]: "Technical pen drawing, precise lines, stippling, clean architectural detail.",
  [RenderStyle.BLUEPRINT]: "Blueprint style, white technical lines on blue background, construction document look.",
  [RenderStyle.FUTURISTIC]: "Futuristic style, neon lights, sleek materials, sci-fi aesthetic.",
  [RenderStyle.SKETCHY]: "Sketchy style, loose lines.",
  [RenderStyle.WATERCOLOR]: "Watercolor style, artistic wash.",
  [RenderStyle.RAW_SKETCH]: "Raw sketch style, unfinished look.",
  [RenderStyle.CARTOONISH]: "Cartoonish style, simplified forms.",
  [RenderStyle.COMIC_BOOK]: "Comic book style, bold lines and colors.",
  [RenderStyle.ULTRA_RENDER]: "Ultra render, maximum detail.",
  [RenderStyle.CONCEPT_SKETCH]: "Concept sketch style."
};

export const INTERIOR_STYLE_THUMBNAILS: Record<string, string> = {
  [InteriorStyle.SIMILAR_TO_REF]: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=150&q=60&fm=webp", // Reusing exterior ref image
  [InteriorStyle.PHOTOREALISTIC]: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=150&q=60&fm=webp", // Missing file
  [InteriorStyle.DHAKA_LUXURY]: "/thumbnails/interior/dhaka-luxury.jpg",
  [InteriorStyle.ART_DECO]: "/thumbnails/interior/art-deco.jpg",
  [InteriorStyle.FUTURISTIC_INT]: "/thumbnails/interior/futuristic.jpg",
  [InteriorStyle.PARAMETRIC]: "/thumbnails/interior/parametric.jpg",
  [InteriorStyle.MINIMALIST]: "/thumbnails/interior/minimalist.jpg",
  [InteriorStyle.BRUTALIST]: "/thumbnails/interior/brutalist.jpg",
  [InteriorStyle.BOHO]: "/thumbnails/interior/boho.jpg",
  [InteriorStyle.CLASSICAL]: "/thumbnails/interior/classical.jpg",
  [InteriorStyle.POST_MODERN]: "/thumbnails/interior/post-modern.jpg",
  [InteriorStyle.DOODLE_ART]: "/thumbnails/interior/doodle-art.jpg",
  [InteriorStyle.SCANDINAVIAN]: "/thumbnails/interior/scandinavian.jpg",
  [InteriorStyle.INDUSTRIAL]: "/thumbnails/interior/industrial.jpg",
  [InteriorStyle.PAPER_MODEL]: "/paper-output.jpg"
};

export const INTERIOR_STYLE_PROMPTS: Record<string, string> = {
  [InteriorStyle.SIMILAR_TO_REF]: "Match the exact interior design style, furniture, lighting, and mood of the provided Style Reference image.",
  [InteriorStyle.PHOTOREALISTIC]: "High-end interior design photography, 8k resolution, architectural digest style, raytracing, perfect lighting balance, luxurious textures, ultra-realistic.",
  [InteriorStyle.DHAKA_LUXURY]: "Dhaka Luxury style. Opulent Bangladeshi high-end interior. Polished marble floors, intricate false ceilings with warm cove lighting, golden accents, premium teak wood furniture, rich velvet upholstery. Elegant, sophisticated, status symbol aesthetic.",
  [InteriorStyle.ART_DECO]: "Art Deco style. Geometric patterns, bold symmetry, rich colors (emerald green, navy, gold), brass and chrome accents, fluted glass, velvet textures, glamorous 1920s revival.",
  [InteriorStyle.FUTURISTIC_INT]: "Futuristic interior. White surfaces, curves, LED strip lighting, seamless furniture integration, high-tech vibe, minimal clutter, Zaha Hadid interiors, sleek and spaceship-like.",
  [InteriorStyle.PARAMETRIC]: "Parametric interior design. Fluid organic walls, voronoi patterns, wood slats curving across ceiling and walls, computational design aesthetic, complex geometry.",
  [InteriorStyle.MINIMALIST]: "Minimalist interior. Less is more. Clean lines, monochromatic palette (whites, beiges, greys), decluttered space, natural light, functional furniture, Japanese-Scandi influence.",
  [InteriorStyle.BRUTALIST]: "Brutalist interior. Raw exposed concrete walls, heavy structural elements, geometric furniture, dark wood, leather, industrial lighting, honest materials, strong shadows.",
  [InteriorStyle.BOHO]: "Bohemian Chic. Eclectic, relaxed, abundance of indoor plants, rattan furniture, macramé wall hangings, layered rugs, warm earth tones, cozy and lived-in vibe.",
  [InteriorStyle.CLASSICAL]: "Classical luxury. Crown moldings, wainscoting, chandeliers, heavy drapes, antique wooden furniture, symmetry, Persian rugs, timeless elegance.",
  [InteriorStyle.POST_MODERN]: "Post Modern interior. Playful geometry, pastel colors mixed with bold primary colors, terrazzo floors, Memphis group influence, quirky furniture shapes, ironic and bold.",
  [InteriorStyle.DOODLE_ART]: "Experimental Doodle Art style. The room is rendered as a 3D space but textures are replaced with black and white hand-drawn doodles, cartoon scribbles, and artistic markers. Playful, creative, sketch-like 3D environment.",
  [InteriorStyle.SCANDINAVIAN]: "Scandinavian design. Bright, airy, white walls, light wood floors, cozy textiles (hygge), simple functional furniture, pops of muted color.",
  [InteriorStyle.INDUSTRIAL]: "Industrial loft style. Exposed brick walls, ductwork, metal framed windows, concrete floors, vintage leather furniture, Edison bulbs, warehouse aesthetic.",
  [InteriorStyle.PAPER_MODEL]: "Interior white paper model. Pure white matte paper texture, thin paperly, Slightly creased, a bit crumpled, with a papery texture, Mildly crimped and crinkled. Clean precision cuts, layered paper edges, soft ambient occlusion shadows, studio lighting. Minimalist, abstract, high key. No colors, just white paper geometry."
};

export const VIEW_PROMPTS: Record<ViewType, string> = {
  [ViewType.PERSPECTIVE]: "eye-level perspective view, showing the building in its environment",
  [ViewType.PLAN]: "2D architectural floor plan, top-down view, clear wall definitions, room layout, black and white or technical colors",
  [ViewType.ELEVATION]: "2D orthographic facade elevation, flat view, material details, no perspective distortion",
  [ViewType.SECTION]: "architectural section cut, showing interior structure, floor levels, and vertical relationships, technical shading",
  [ViewType.AXONOMETRIC]: "Strictly render in isometric or axonometric projection. Do NOT render in perspective. Transform the view to be parallel projection.",
  [ViewType.TOPSHOT]: "aerial top-down view, bird's eye perspective, site context, landscaping layout",
  [ViewType.DETAILS]: "close-up architectural detail, construction joint, material transition, macro photography style",
  [ViewType.SIMILAR_TO_INPUT]: "match the exact camera angle, perspective, and composition of the provided input image",
  [ViewType.SIMILAR_TO_REF]: "match the exact camera angle, perspective, and composition of the provided reference image"
};

// Diagram Prompts - Enhanced for Professional Portfolio styles
export const DIAGRAM_PROMPTS: Record<DiagramType, string> = {
  [DiagramType.CONCEPT]: "Concept / Schematic Diagram. A minimalist isometric massing diagram explaining the core design idea. Render the form as clean white volumes with sharp black outlines. Overlay bold red arrows to indicate design moves (push, pull, lift, view). Use dashed lines to show cuts or axes. Ground plane should be abstract, simple green or grey patches. Aesthetic: Clear, instructional, architectural diagram style (like BIG or OMA process diagrams). Focus on simple geometry and logic.",

  [DiagramType.EXPLODED]: "Exploded Axonometric Diagram. Deconstruct the building into expanded vertical layers (floor plates, structure, skin, roof) floating above each other to reveal the assembly. Use dashed 'trace lines' connecting the corners to show alignment. Aesthetic: Clean white minimal background, ambient occlusion, vector-style outlines, 'Morphosis' or 'Thom Mayne' style technical complexity.",

  [DiagramType.PROGRAMMATIC]: "Programmatic & Zoning Diagram. Render the building geometry as translucent or wireframe containers. Fill specific functional volumes (public, private, circulation) with distinct, vibrant pastel color blocks (Cyan, Magenta, Yellow). Add 3D floating text labels. Aesthetic: 'BIG' (Bjarke Ingels Group) style, iconic, bold, infographic clarity.",

  [DiagramType.CIRCULATION]: "Circulation & Flow Diagram. Render the architecture in muted grey or white clay mode. Overlay bold, fluid, ribbon-like arrows indicating human movement. Red for public flow, Blue for services. Highlight vertical cores (stairs/elevators) as solid colored shafts. Show entrances and exits clearly. Aesthetic: UNStudio style, fluid, dynamic vectors.",

  [DiagramType.ENVIRONMENTAL]: "Climate & Environmental Analysis. White clay model base. Overlay graphical climate vectors: Yellow gradients for solar gain/radiation on facades, Blue stream-lines for wind ventilation through the building, Red zones for thermal mass. Include a Sun Path arc. Aesthetic: Technical, analytical, 'Transsolar' engineering style.",

  [DiagramType.SECTIONAL_PERSP]: "Sectional Perspective (3D Section). A vertical cut through the building that reveals the interior life while maintaining 3D depth. Show people, furniture, and activity inside the cut sections. Render the cut plane in solid black or heavy hatch. Aesthetic: 'Lewis Tsurumaki Lewis' (LTL) style, detailed, atmospheric interior lighting against a white section cut.",

  [DiagramType.ACTIVITY]: "Activity & Usage Mapping. 'Ghosted' architectural view. The building is semi-transparent white lines. The focus is on 'Events': populate the space with silhouetted scale figures engaging in specific activities (sitting, walking, gathering). Use color coding for different activity intensities. Aesthetic: Bernard Tschumi 'Event Cities' style, notation-based, dynamic.",

  [DiagramType.GEOMETRY]: "Geometric & Regulating Lines Analysis. Overlay the regulating grids, symmetry axes, and golden ratio proportions used to generate the form. Use thin red and dashed black lines over a wireframe model. Highlight the primary geometric primitives (Cube, Sphere, Pyramid). Aesthetic: Eisenman style, formalist, grid-based, intellectual.",

  [DiagramType.STRUCTURE]: "Structural Tectonics (X-Ray). Highlight the load-bearing skeleton (columns, beams, trusses, space frame) in dark bold material (Steel/Concrete). Make the skin/cladding transparent or removed completely. Focus on the transfer of loads to the ground. Aesthetic: High-tech, Renzo Piano style, engineering focus.",

  [DiagramType.URBAN_CONTEXT]: "Urban Context & Mapping. Aerial Isometric view. Show the building in pure white, but render the surrounding city context as simple grey masses. Highlight specific urban connections (views, transport lines, green corridors) with colored dashed lines extending into the city. Aesthetic: MVRDV data-scape style, urban planning focus.",

  [DiagramType.FORM_EVOLUTION]: "Form Evolution (Generative Process). A sequence or single composite image showing the 'operations' that created the form. Show the base block -> subtraction -> addition -> final form. Use ghosted red volumes for removed parts and blue for added parts. Aesthetic: Step-by-step diagram, clean, instructional.",

  [DiagramType.LIVING_COLLAGE]: "Living Collage Cutaway Diagram. A highly detailed isometric cutaway or section presented as a whimsical digital collage. 'Dollhouse' view revealing complex interior life. Densely populate every room with lush hanging plants, potted vegetation, detailed furniture, and eclectic decor. Show people engaging in domestic activities (reading, cooking, resting). Aesthetic: Soft textured paper background, muted pastel colors, flat lighting, artistic illustration style (e.g., Fala Atelier, Dogma). Emphasize biophilia, domestic narrative, and 'lived-in' atmosphere."
};

// Allowed Views for Ideation Mode
export const IDEATION_ALLOWED_VIEWS = [
  ViewType.AXONOMETRIC,
  ViewType.ELEVATION,
  ViewType.TOPSHOT
];

// Operative Design - Catalogue of Spatial Verbs
export const SPATIAL_VERBS: Record<string, { category: 'Additive' | 'Subtractive' | 'Displacement' | 'Hybrid', prompt: string }> = {
  // Additive
  'Extrude': { category: 'Additive', prompt: "EXTRUDE: Extend the base profile vertically or horizontally to create a linear volume." },
  'Branch': { category: 'Additive', prompt: "BRANCH: Split the volume into multiple diverging arms or directions, creating a tree-like structure." },
  'Merge': { category: 'Additive', prompt: "MERGE: Combine two distinct volumes into a single continuous form, smoothing the transition." },
  'Nest': { category: 'Additive', prompt: "NEST: Place a smaller volume inside or partially embedded within a larger volume." },
  'Inflate': { category: 'Additive', prompt: "INFLATE: Expand the volume outwards, creating bulbous or soft convex forms." },
  'Stack': { category: 'Additive', prompt: "STACK: Place volumes on top of one another, potentially with slight misalignments." },
  'Laminate': { category: 'Additive', prompt: "LAMINATE: Layer thin sheets or plates over the volume to create a stratified surface." },
  'Grade': { category: 'Additive', prompt: "GRADE: Add a stepped or sloped addition that connects the volume to the ground or another level." },
  'Embed': { category: 'Additive', prompt: "EMBED: Partially submerge a volume within another, creating a sense of weight and integration." },

  // Subtractive
  'Subtract': { category: 'Subtractive', prompt: "SUBTRACT: Remove a significant geometric chunk from the main mass to create voids." },
  'Punch': { category: 'Subtractive', prompt: "PUNCH: Create deep, specific window-like openings or apertures through the solid mass." },
  'Split': { category: 'Subtractive', prompt: "SPLIT: Divide the volume into two separated halves with a clear gap or canyon between them." },
  'Carve': { category: 'Subtractive', prompt: "CARVE: Erode the edges or corners of the volume organically or geometrically." },
  'Notch': { category: 'Subtractive', prompt: "NOTCH: Cut small, precise angular indentations into the corners or edges." },
  'Fracture': { category: 'Subtractive', prompt: "FRACTURE: Create a jagged, irregular break or crack through the volume." },
  'Excavate': { category: 'Subtractive', prompt: "EXCAVATE: Dig out a large portion of the volume from the top down, creating a courtyard or pit." },

  // Displacement / Surface
  'Twist': { category: 'Displacement', prompt: "TWIST: Rotate the top of the volume relative to the bottom, creating a torqued form." },
  'Fold': { category: 'Displacement', prompt: "FOLD: Bend the volume or surface like a continuous sheet of paper or origami." },
  'Shear': { category: 'Displacement', prompt: "SHEAR: Slide layers of the volume horizontally to create a slanted or slipping effect." },
  'Cantilever': { category: 'Displacement', prompt: "CANTILEVER: Extend a portion of the volume horizontally with no support underneath, creating tension." },
  'Lift': { category: 'Displacement', prompt: "LIFT: Raise the mass off the ground on pilotis or a reduced base." },
  'Terrace': { category: 'Displacement', prompt: "TERRACE: Create stepped setbacks on the roof or facade, forming inhabitable platforms." },
  'Bend': { category: 'Displacement', prompt: "BEND: Curve the entire linear volume along an arc." },
  'Shift': { category: 'Displacement', prompt: "SHIFT: Slide a portion of the volume horizontally to create misalignment or overhangs." },
  'Rotate': { category: 'Displacement', prompt: "ROTATE: Rotate a specific section of the volume around an axis to create dynamic movement." },
  'Offset': { category: 'Displacement', prompt: "OFFSET: Create a parallel shell or inner volume, establishing a layered depth." },
  'Taper': { category: 'Displacement', prompt: "TAPER: Gradually reduce the cross-section of the volume towards the top or one end." },
  'Wrap': { category: 'Displacement', prompt: "WRAP: Envelop the volume with a continuous surface or skin that folds around it." },
  'Weave': { category: 'Displacement', prompt: "WEAVE: Interlace linear elements or volumes to create a fabric-like structure." },
  'Hinge': { category: 'Displacement', prompt: "HINGE: Rotate a part of the volume around a specific edge, opening it up like a door." },
  'Pivot': { category: 'Displacement', prompt: "PIVOT: Rotate a volume around a central point, creating a dynamic, unbalanced composition." },
  'Slide': { category: 'Displacement', prompt: "SLIDE: Shift a layer or section horizontally, creating a shearing effect." },
  'Compress': { category: 'Displacement', prompt: "COMPRESS: Squeeze the volume, reducing its height or width and creating bulging sides." },
  'Expand': { category: 'Displacement', prompt: "EXPAND: Pull the volume outwards from the center, creating a sense of internal pressure." },
  'Pleat': { category: 'Displacement', prompt: "PLEAT: Fold the surface back on itself multiple times, creating a rhythmic, textured depth." },
  'Seam': { category: 'Displacement', prompt: "SEAM: Join two surfaces or volumes with a visible, articulated line or ridge." },
  'Stretch': { category: 'Displacement', prompt: "STRETCH: Elongate the volume or surface along one axis, distorting its proportions." },

  // Hybrid
  'Interlock': { category: 'Hybrid', prompt: "INTERLOCK: Fit two distinct volumes together like a puzzle, creating a complex intersection." },
  'Infiltrate': { category: 'Hybrid', prompt: "INFILTRATE: A foreign volume penetrates and spreads within the main mass, changing its character." },
  'Augment': { category: 'Hybrid', prompt: "AUGMENT: Add a new element to the volume specifically to enhance or strengthen a part of it." },
  'React': { category: 'Hybrid', prompt: "REACT: The volume deforms or changes shape in response to an external force or context." }
};

// Ideation Options
export const IDEATION_MATERIALS: Record<string, string> = {
  'Concrete': 'monolithic, rough grey concrete with a brutalist texture, showing subtle imperfections and aggregate.',
  'White Card': 'clean white museum board, architectural maquette style, pristine white cardboard texture, minimal detailing.',
  'Blue Foam': 'blue modeling foam (styrofoam), porous texture, architectural study model aesthetic.',
  'Wood Block': 'solid light basswood, balsa wood texture, warm timber tones, physical model style.',
  'Cardboard': 'corrugated cardboard, layered paper texture, physical architectural model aesthetic, warm beige tones.',
  'Translucent': 'frosted acrylic or resin, semi-transparent, diffuse light transmission, ethereal massing.'
};

export const IDEATION_FORMS: Record<string, string> = {
  'Orthogonal': 'Strictly rectilinear forms, 90-degree angles, boxy composition, Cartesian logic.',
  'Organic': 'Biomorphic shapes, soft transitions, nature-inspired volumes.',
  'Curvilinear': 'Smooth, flowing, continuous curves, aerodynamic aesthetics, non-Euclidean geometry.',
  'Faceted': 'Triangulated surfaces, dynamic shards, low-poly aesthetics.',
  'Crystalline': 'Sharp, angular, faceted geometry, mineral aesthetics, precision-cut forms.',
  'Parametric': 'Complex, algorithmically generated shapes, voronoi patterns, gradient transitions, data-driven forms.',
  'Deconstructivist': 'Fragmented geometry, non-linear distortion, controlled chaos, exploding elements.'
};

export const MODEL_NAME = 'gemini-3-pro-image-preview'; // Nano Banana Pro equivalent
