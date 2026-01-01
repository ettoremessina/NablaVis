import React, { useMemo, useState } from 'react';
import { OrbitControls, Line, Html, Cone } from '@react-three/drei';
import * as THREE from 'three';
import { useTranslation } from '../utils/translate';
import { DirectionSelector } from '../components/DirectionSelector';

// Vector Fields
const vectorFields = {
    rotation: {
        label: 'Simple Rotation',
        F: (x: number, y: number, _z: number) => new THREE.Vector3(-y, x, 0),
        formula: 'F = (-y, x, 0)',
        curl: 'Curl F = (0, 0, 2)',
        theorem: '∮ F · dr = ∬ (∇ × F) · dS',
        getLineIntegral: (r: number) => 2 * Math.PI * r * r,
        getSurfaceIntegral: (r: number) => 2 * Math.PI * r * r
    },
    saddle: {
        label: 'Saddle (Irrotational)',
        F: (x: number, y: number, _z: number) => new THREE.Vector3(y, x, 0),
        formula: 'F = (y, x, 0)',
        curl: 'Curl F = (0, 0, 0)',
        theorem: 'Conservative Field',
        getLineIntegral: (_r: number) => 0,
        getSurfaceIntegral: (_r: number) => 0
    },
    shear: {
        label: 'Shear Flow',
        F: (_x: number, y: number, _z: number) => new THREE.Vector3(y, 0, 0),
        formula: 'F = (y, 0, 0)',
        curl: 'Curl F = (0, 0, -1)',
        theorem: 'Rotational (Uniform negative curl)',
        getLineIntegral: (r: number) => -Math.PI * r * r,
        getSurfaceIntegral: (r: number) => -Math.PI * r * r
    },
    spiral: {
        label: 'Expanding Spiral',
        F: (x: number, y: number, _z: number) => new THREE.Vector3(x - y, x + y, 0),
        formula: 'F = (x - y, x + y, 0)',
        curl: 'Curl F = (0, 0, 2)',
        theorem: 'Divergence + Curl',
        getLineIntegral: (r: number) => 2 * Math.PI * r * r,
        getSurfaceIntegral: (r: number) => 2 * Math.PI * r * r
    }
};

export const CurlScene: React.FC = () => {
    const t = useTranslation();
    const [preset, setPreset] = useState<keyof typeof vectorFields>('rotation');

    const currentField = vectorFields[preset];

    // Vector Field Visualization
    const vectors = useMemo(() => {
        const vecs = [];
        const spacing = 1;
        for (let x = -4; x <= 4; x += spacing) {
            for (let y = -4; y <= 4; y += spacing) {
                const z = 0;
                const pos = new THREE.Vector3(x, y, z);
                const dir = currentField.F(x, y, z).normalize().multiplyScalar(0.7);
                vecs.push({ pos, dir });
            }
        }
        return vecs;
    }, [preset]);

    // Circulation Path (Circle radius 3)
    const pathPoints = useMemo(() => {
        const points = [];
        const segments = 64;
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(3 * Math.cos(theta), 3 * Math.sin(theta), 0));
        }
        return points;
    }, []);

    return (
        <>
            <Html fullscreen>
                <DirectionSelector
                    options={[
                        { label: t.field_rotation, value: 'rotation' },
                        { label: t.field_saddle, value: 'saddle' },
                        { label: t.field_shear, value: 'shear' },
                        { label: t.field_spiral, value: 'spiral' }
                    ]}
                    value={preset}
                    onChange={(val: string) => setPreset(val as any)}
                />
            </Html>

            <OrbitControls makeDefault />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            {/* Vector Field Arrows */}
            {vectors.map((v, i) => (
                <group key={i} position={v.pos} rotation={[0, 0, Math.atan2(v.dir.y, v.dir.x)]}>
                    <Line points={[[0, 0, 0], [v.dir.length(), 0, 0]]} color="#aaa" lineWidth={1} />
                    <Cone args={[0.1, 0.2, 8]} position={[v.dir.length(), 0, 0]} rotation={[0, 0, -Math.PI / 2]} material-color="#aaa" />
                </group>
            ))}

            {/* Circulation Path */}
            <Line points={pathPoints} color="red" lineWidth={3} />

            {/* Surface (Disk) */}
            <mesh position={[0, 0, -0.01]}>
                <circleGeometry args={[3, 32]} />
                <meshBasicMaterial color="red" opacity={0.1} transparent side={THREE.DoubleSide} />
            </mesh>

            <Html fullscreen style={{ pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '15px 25px',
                    borderRadius: '12px',
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '20px',
                    whiteSpace: 'nowrap',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <h3 style={{ margin: 0, borderRight: '1px solid #666', paddingRight: '15px' }}>{t.curl}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' }}>
                        <p style={{ margin: 0 }}>{currentField.formula}</p>
                        <p style={{ margin: 0 }}>{currentField.curl}</p>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>
                            ∮ F·dr = {(currentField.getLineIntegral(3)).toFixed(2)}
                        </p>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>
                            ∬ (∇×F)·dS = {(currentField.getSurfaceIntegral(3)).toFixed(2)}
                        </p>
                    </div>
                </div>
            </Html>

            <gridHelper args={[10, 10]} rotation={[Math.PI / 2, 0, 0]} />
        </>
    );
};
