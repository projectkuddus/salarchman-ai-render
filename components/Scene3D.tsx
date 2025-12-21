import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, TransformControls, Grid, Environment, ContactShadows, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { SUBTRACTION, ADDITION, INTERSECTION, Brush, Evaluator } from 'three-bvh-csg';

export interface SceneObject {
    id: string;
    type: 'cube' | 'sphere' | 'cylinder' | 'model';
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    color: string;
    url?: string; // For uploaded models
}

interface Scene3DProps {
    objects: SceneObject[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onUpdateObject: (id: string, updates: Partial<SceneObject>) => void;
    transformMode: 'translate' | 'rotate' | 'scale';
    onCapture?: (dataUrl: string) => void;
    captureTrigger?: number; // Increment to trigger capture
}

const SceneContent: React.FC<Scene3DProps> = ({ objects, selectedId, onSelect, onUpdateObject, transformMode, onCapture, captureTrigger }) => {
    const { gl, scene, camera } = useThree();
    const transformRef = useRef<any>(null);

    useEffect(() => {
        if (captureTrigger && captureTrigger > 0) {
            gl.render(scene, camera);
            const dataUrl = gl.domElement.toDataURL('image/png');
            if (onCapture) onCapture(dataUrl);
        }
    }, [captureTrigger, gl, scene, camera, onCapture]);

    const selectedObject = objects.find(obj => obj.id === selectedId);

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <Environment preset="city" />

            <Grid infiniteGrid fadeDistance={50} sectionColor="#4a5568" cellColor="#cbd5e1" />

            <group>
                {objects.map((obj) => (
                    <mesh
                        key={obj.id}
                        position={obj.position}
                        rotation={obj.rotation}
                        scale={obj.scale}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(obj.id);
                        }}
                    >
                        {obj.type === 'cube' && <boxGeometry />}
                        {obj.type === 'sphere' && <sphereGeometry />}
                        {obj.type === 'cylinder' && <cylinderGeometry />}
                        <meshStandardMaterial color={obj.id === selectedId ? '#3b82f6' : obj.color} />
                    </mesh>
                ))}
            </group>

            {selectedObject && (
                <TransformControls
                    object={scene.getObjectByProperty('uuid', selectedObject.id) as any} // This might be tricky, better to attach to the mesh directly if possible, but we are mapping. 
                    // Actually, TransformControls works best when wrapping the object or passed an object ref.
                    // Let's try a different approach for TransformControls: Render it separately and attach to the selected mesh ref?
                    // Or simpler: Just wrap the selected mesh in TransformControls? No, that changes the scene graph structure.
                    // We will use the `position`, `rotation`, `scale` props of the mesh to drive it, and `onChange` to update state.
                    mode={transformMode}
                    onObjectChange={(e: any) => {
                        if (transformRef.current) {
                            const o = transformRef.current.object;
                            if (o) {
                                onUpdateObject(selectedId, {
                                    position: [o.position.x, o.position.y, o.position.z],
                                    rotation: [o.rotation.x, o.rotation.y, o.rotation.z],
                                    scale: [o.scale.x, o.scale.y, o.scale.z]
                                });
                            }
                        }
                    }}
                    ref={transformRef}
                >
                    {/* We need a proxy object here or attach to the real mesh. 
                For simplicity in this list-based approach, let's just re-render the selected object INSIDE TransformControls? 
                No, that duplicates it. 
                
                Correct way with list: 
                The list renders meshes. The selected mesh gets a ref. TransformControls attaches to that ref.
            */}
                </TransformControls>
            )}

            {/* Re-implementing rendering loop to handle TransformControls properly */}
        </>
    );
};

// Let's rewrite the component to handle refs properly
const SceneObjectComponent = ({ obj, isSelected, onSelect, onUpdate, transformMode }: { obj: SceneObject, isSelected: boolean, onSelect: () => void, onUpdate: (updates: Partial<SceneObject>) => void, transformMode: 'translate' | 'rotate' | 'scale' }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    return (
        <>
            {isSelected && (
                <TransformControls
                    object={meshRef}
                    mode={transformMode}
                    onMouseUp={() => {
                        if (meshRef.current) {
                            onUpdate({
                                position: [meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z],
                                rotation: [meshRef.current.rotation.x, meshRef.current.rotation.y, meshRef.current.rotation.z],
                                scale: [meshRef.current.scale.x, meshRef.current.scale.y, meshRef.current.scale.z]
                            });
                        }
                    }}
                />
            )}
            <mesh
                ref={meshRef}
                position={obj.position}
                rotation={obj.rotation}
                scale={obj.scale}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                }}
            >
                {obj.type === 'cube' && <boxGeometry />}
                {obj.type === 'sphere' && <sphereGeometry />}
                {obj.type === 'cylinder' && <cylinderGeometry />}
                <meshStandardMaterial color={isSelected ? '#60a5fa' : obj.color} />
            </mesh>
        </>
    );
}

export const Scene3D: React.FC<Scene3DProps> = (props) => {
    return (
        <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden relative">
            <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }} gl={{ preserveDrawingBuffer: true }}>
                <SceneContent {...props} />
                <OrbitControls makeDefault />
            </Canvas>
        </div>
    );
};

// Override SceneContent to use the new component structure
const SceneContentFixed: React.FC<Scene3DProps> = ({ objects, selectedId, onSelect, onUpdateObject, transformMode, onCapture, captureTrigger }) => {
    const { gl, scene, camera } = useThree();

    useEffect(() => {
        if (captureTrigger && captureTrigger > 0) {
            gl.render(scene, camera);
            const dataUrl = gl.domElement.toDataURL('image/png');
            if (onCapture) onCapture(dataUrl);
        }
    }, [captureTrigger, gl, scene, camera, onCapture]);

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <Environment preset="city" />
            <Grid infiniteGrid fadeDistance={50} sectionColor="#4a5568" cellColor="#1e293b" />

            {objects.map((obj) => (
                <SceneObjectComponent
                    key={obj.id}
                    obj={obj}
                    isSelected={obj.id === selectedId}
                    onSelect={() => onSelect(obj.id)}
                    onUpdate={(updates) => onUpdateObject(obj.id, updates)}
                    transformMode={transformMode}
                />
            ))}
        </>
    );
};

export default function Scene3DWrapper(props: Scene3DProps) {
    return (
        <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden relative">
            <Canvas shadows camera={{ position: [8, 8, 8], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
                <SceneContentFixed {...props} />
                <OrbitControls makeDefault />
            </Canvas>
        </div>
    )
}
