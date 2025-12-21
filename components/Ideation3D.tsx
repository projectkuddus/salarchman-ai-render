import React, { useState, useRef } from 'react';
import { Box, Circle, Cylinder, Triangle, Move, RotateCw, Maximize, Image as ImageIcon, Download, Trash2, Upload, Send, Layers } from 'lucide-react';
import Scene3DWrapper, { SceneObject } from './Scene3D';

interface Ideation3DProps {
    onRender: (image: string) => void;
}

export const Ideation3D: React.FC<Ideation3DProps> = ({ onRender }) => {
    const [objects, setObjects] = useState<SceneObject[]>([
        {
            id: 'default-cube',
            type: 'cube',
            position: [0, 0.5, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            color: '#e2e8f0'
        }
    ]);
    const [selectedId, setSelectedId] = useState<string | null>('default-cube');
    const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
    const [captureTrigger, setCaptureTrigger] = useState(0);


    const generateId = () => Math.random().toString(36).substr(2, 9);

    const addObject = (type: 'cube' | 'sphere' | 'cylinder' | 'cone') => {
        const newObj: SceneObject = {
            id: generateId(),
            type,
            position: [Math.random() * 2 - 1, 0.5, Math.random() * 2 - 1],
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

    const clearAll = () => {
        setObjects([]);
        setSelectedId(null);
    };



    const handleCapture = (dataUrl: string) => {
        onRender(dataUrl);
    };

    const handleSendToRenderer = () => {
        setCaptureTrigger(prev => prev + 1);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200 relative">
            {/* Floating Toolbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-slate-200">
                {/* Shapes */}
                <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
                    <button onClick={() => addObject('cube')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600" title="Add Cube"><Box size={20} /></button>
                    <button onClick={() => addObject('sphere')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600" title="Add Sphere"><Circle size={20} /></button>
                    <button onClick={() => addObject('cylinder')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600" title="Add Cylinder"><Cylinder size={20} /></button>
                    <button onClick={() => addObject('cone')} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600" title="Add Cone"><Triangle size={20} /></button>
                </div>

                {/* Transforms */}
                <div className="flex items-center gap-1 border-r border-slate-200 pr-2 pl-2">
                    <button onClick={() => setTransformMode('translate')} className={`p-2 rounded-lg transition-colors ${transformMode === 'translate' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`} title="Move"><Move size={20} /></button>
                    <button onClick={() => setTransformMode('rotate')} className={`p-2 rounded-lg transition-colors ${transformMode === 'rotate' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`} title="Rotate"><RotateCw size={20} /></button>
                    <button onClick={() => setTransformMode('scale')} className={`p-2 rounded-lg transition-colors ${transformMode === 'scale' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`} title="Scale"><Maximize size={20} /></button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 pl-2">
                    <button onClick={deleteSelected} disabled={!selectedId} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg disabled:opacity-50" title="Delete Selected"><Trash2 size={20} /></button>
                    <button onClick={clearAll} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg" title="Clear All"><Layers size={20} /></button>
                </div>
            </div>

            {/* Send to Renderer Button */}
            <div className="absolute bottom-6 right-6 z-10">
                <button
                    onClick={handleSendToRenderer}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium shadow-xl hover:bg-black transition-transform hover:scale-105 active:scale-95"
                >
                    <Send size={18} />
                    Send to Renderer
                </button>
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

                {/* Empty State Overlay */}
                {objects.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center text-slate-500 bg-slate-900/80 p-6 rounded-xl backdrop-blur-sm border border-slate-800">
                            <Layers size={48} className="mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium text-slate-300">Start Massing</h3>
                            <p className="text-sm mt-2 max-w-xs">Add shapes from the toolbar to begin.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
