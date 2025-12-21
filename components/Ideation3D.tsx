import React, { useState, useCallback } from 'react';
import { Box, Circle, Cylinder, Move, RotateCw, Maximize, Plus, Minus, Combine, Image as ImageIcon, Download, Trash2, MousePointer2 } from 'lucide-react';
import Scene3DWrapper, { SceneObject } from './Scene3D';
import * as THREE from 'three';
import { SUBTRACTION, ADDITION, INTERSECTION, Brush, Evaluator } from 'three-bvh-csg';

interface Ideation3DProps {
    onRender: (image: string) => void;
}

export const Ideation3D: React.FC<Ideation3DProps> = ({ onRender }) => {
    const [objects, setObjects] = useState<SceneObject[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
    const [captureTrigger, setCaptureTrigger] = useState(0);

    const addObject = (type: 'cube' | 'sphere' | 'cylinder') => {
        const newObj: SceneObject = {
            id: crypto.randomUUID(),
            type,
            position: [0, 0.5, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            color: '#e2e8f0'
        };
        setObjects([...objects, newObj]);
        setSelectedId(newObj.id);
    };

    const updateObject = (id: string, updates: Partial<SceneObject>) => {
        setObjects(objects.map(obj => obj.id === id ? { ...obj, ...updates } : obj));
    };

    const deleteSelected = () => {
        if (selectedId) {
            setObjects(objects.filter(obj => obj.id !== selectedId));
            setSelectedId(null);
        }
    };

    const handleRenderClick = () => {
        setCaptureTrigger(prev => prev + 1);
    };

    const handleCapture = (dataUrl: string) => {
        onRender(dataUrl);
    };

    // Placeholder for CSG operations
    const performBoolean = (op: 'union' | 'subtract' | 'intersect') => {
        // This would require more complex logic:
        // 1. Convert SceneObjects to THREE.Meshes (Brushes)
        // 2. Perform operation using Evaluator
        // 3. Convert result back to a geometry/mesh
        // 4. Update scene objects
        console.log(`Perform ${op} - Not fully implemented yet`);
        alert("Boolean operations are experimental and require multi-selection (coming soon). For now, please arrange shapes manually.");
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
            {/* Toolbar */}
            <div className="h-14 bg-white border-b border-slate-200 flex items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-1">
                        <button
                            onClick={() => addObject('cube')}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-md text-slate-600 transition-all"
                            title="Add Cube"
                        >
                            <Box size={18} />
                        </button>
                        <button
                            onClick={() => addObject('sphere')}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-md text-slate-600 transition-all"
                            title="Add Sphere"
                        >
                            <Circle size={18} />
                        </button>
                        <button
                            onClick={() => addObject('cylinder')}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-md text-slate-600 transition-all"
                            title="Add Cylinder"
                        >
                            <Cylinder size={18} />
                        </button>
                    </div>

                    <div className="w-px h-8 bg-slate-200 mx-2" />

                    <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-1">
                        <button
                            onClick={() => setTransformMode('translate')}
                            className={`p-2 rounded-md transition-all ${transformMode === 'translate' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Move"
                        >
                            <Move size={18} />
                        </button>
                        <button
                            onClick={() => setTransformMode('rotate')}
                            className={`p-2 rounded-md transition-all ${transformMode === 'rotate' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Rotate"
                        >
                            <RotateCw size={18} />
                        </button>
                        <button
                            onClick={() => setTransformMode('scale')}
                            className={`p-2 rounded-md transition-all ${transformMode === 'scale' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Scale"
                        >
                            <Maximize size={18} />
                        </button>
                    </div>

                    <div className="w-px h-8 bg-slate-200 mx-2" />

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => performBoolean('union')}
                            className="p-2 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-all"
                            title="Union (Experimental)"
                        >
                            <Combine size={18} />
                        </button>
                        <button
                            onClick={deleteSelected}
                            className="p-2 hover:bg-red-50 hover:text-red-600 rounded-md text-slate-400 transition-all"
                            title="Delete Selected"
                            disabled={!selectedId}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRenderClick}
                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors shadow-lg shadow-slate-900/20"
                    >
                        <ImageIcon size={16} />
                        Render View
                    </button>
                </div>
            </div>

            {/* 3D Viewport */}
            <div className="flex-1 relative bg-slate-900">
                <Scene3DWrapper
                    objects={objects}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    onUpdateObject={updateObject}
                    transformMode={transformMode}
                    onCapture={handleCapture}
                    captureTrigger={captureTrigger}
                />

                {/* Overlay Instructions */}
                {objects.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center text-slate-500 bg-slate-900/80 p-6 rounded-xl backdrop-blur-sm border border-slate-800">
                            <Box size={48} className="mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium text-slate-300">3D Massing Editor</h3>
                            <p className="text-sm mt-2 max-w-xs">Add shapes from the toolbar to start building your massing model. Click 'Render View' to generate a photorealistic render.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
