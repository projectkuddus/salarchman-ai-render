import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, TransformControls, Grid, Environment, ContactShadows, GizmoHelper, GizmoViewcube, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SUBTRACTION, ADDITION, Brush, Evaluator } from 'three-bvh-csg';

export interface SceneObject {
    id: string;
    type: 'cube' | 'sphere' | 'cylinder' | 'cone';
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    color: string;
    operation?: 'add' | 'subtract'; // For CSG
}

interface Scene3DProps {
    objects: SceneObject[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onUpdateObject: (id: string, updates: Partial<SceneObject>) => void;
    transformMode: 'translate' | 'rotate' | 'scale';
    onCapture?: (dataUrl: string) => void;
    captureTrigger?: number;
    siteImage?: string | null;
}

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
                castShadow
                receiveShadow
            >
                {obj.type === 'cube' && <boxGeometry />}
                {obj.type === 'sphere' && <sphereGeometry />}
                {obj.type === 'cylinder' && <cylinderGeometry />}
                {obj.type === 'cone' && <coneGeometry />}

                <meshStandardMaterial
                    color={isSelected ? '#60a5fa' : obj.color}
                    transparent={obj.operation === 'subtract'}
                    opacity={obj.operation === 'subtract' ? 0.5 : 1}
                    wireframe={obj.operation === 'subtract'}
                />
            </mesh>
        </>
    );
}

const SceneContent: React.FC<Scene3DProps> = ({ objects, selectedId, onSelect, onUpdateObject, transformMode, onCapture, captureTrigger, siteImage }) => {
    const { gl, scene, camera } = useThree();

    useEffect(() => {
        if (captureTrigger && captureTrigger > 0) {
            gl.render(scene, camera);
            const dataUrl = gl.domElement.toDataURL('image/png');
            if (onCapture) onCapture(dataUrl);
        }
    }, [captureTrigger, gl, scene, camera, onCapture]);

    // CSG Result Calculation
    // This is a simplified CSG implementation. Real-time CSG with many objects can be heavy.
    // We will render the result SEPARATELY if needed, or just let users arrange objects for now.
    // For "Operative Massing", we ideally want to show the boolean result.
    // Let's keep it simple: Render objects as is. If we implement "Merge", we create a new mesh.

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
            <Environment preset="city" />

            <Grid infiniteGrid fadeDistance={50} sectionColor="#4a5568" cellColor="#334155" position={[0, -0.01, 0]} />

            {/* Ground Plane for Shadows */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <shadowMaterial opacity={0.4} />
            </mesh>

            {/* Site Image Overlay */}
            {siteImage && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                    <planeGeometry args={[20, 20]} />
                    <meshBasicMaterial transparent opacity={0.8}>
                        <canvasTexture attach="map" image={useMemo(() => {
                            const img = new Image();
                            img.src = siteImage;
                            return img;
                        }, [siteImage])} />
                    </meshBasicMaterial>
                </mesh>
            )}

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

            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewcube />
            </GizmoHelper>
        </>
    );
};

export default function Scene3DWrapper(props: Scene3DProps) {
    return (
        <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden relative">
            <Canvas shadows camera={{ position: [8, 8, 8], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
                <SceneContent {...props} />
                <OrbitControls makeDefault />
            </Canvas>
        </div>
    )
}
