import React, { useMemo, useState } from 'react';
import { OrbitControls, Html, Cone, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useTranslation } from '../utils/translate';
import { DirectionSelector } from '../components/DirectionSelector';

// Vector Fields
const vectorFields = {
    source: {
        label: 'Source',
        F: (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).normalize().multiplyScalar(0.5),
        formula: 'F = (x, y, z)',
        div: 'Div F = 3',
        theorem: '∯ F · dS = ∭ (∇ · F) dV',
        getFluxIntegral: (r: number) => 4 * Math.PI * Math.pow(r, 3),
        getVolumeIntegral: (r: number) => 4 * Math.PI * Math.pow(r, 3)
    },
    sink: {
        label: 'Sink',
        F: (x: number, y: number, z: number) => new THREE.Vector3(-x, -y, -z).normalize().multiplyScalar(0.5),
        formula: 'F = (-x, -y, -z)',
        div: 'Div F = -3',
        theorem: '∯ F · dS = -Volume',
        getFluxIntegral: (r: number) => -4 * Math.PI * Math.pow(r, 3),
        getVolumeIntegral: (r: number) => -4 * Math.PI * Math.pow(r, 3)
    },
    uniform: {
        label: 'Uniform Field',
        F: (_x: number, _y: number, _z: number) => new THREE.Vector3(1, 0, 0),
        formula: 'F = (1, 0, 0)',
        div: 'Div F = 0',
        theorem: 'Flux In = Flux Out',
        getFluxIntegral: (_r: number) => 0,
        getVolumeIntegral: (_r: number) => 0
    },
    vertical: {
        label: 'Vertical Expansion',
        F: (_x: number, _y: number, z: number) => new THREE.Vector3(0, 0, z).normalize().multiplyScalar(0.5),
        formula: 'F = (0, 0, z)',
        div: 'Div F = 1',
        theorem: 'Expansion along Z',
        getFluxIntegral: (r: number) => (4 / 3) * Math.PI * Math.pow(r, 3),
        getVolumeIntegral: (r: number) => (4 / 3) * Math.PI * Math.pow(r, 3)
    }
};

export const DivergenceScene: React.FC = () => {
    const t = useTranslation();
    const [preset, setPreset] = useState<keyof typeof vectorFields>('source');

    const currentField = vectorFields[preset];

    // Random sample points on sphere surface for vectors
    const vectors = useMemo(() => {
        const vecs = [];
        const count = 50;
        for (let i = 0; i < count; i++) {
            // Fibonacci sphere algorithm for even distribution
            const phi = Math.acos(1 - 2 * (i + 0.5) / count);
            const theta = Math.PI * (1 + 5 ** 0.5) * i;

            const x = 2 * Math.sin(phi) * Math.cos(theta);
            const y = 2 * Math.sin(phi) * Math.sin(theta);
            const z = 2 * Math.cos(phi);

            const pos = new THREE.Vector3(x, y, z);
            const dir = currentField.F(x, y, z); // Just radial outward/inward
            vecs.push({ pos, dir });
        }
        return vecs;
    }, [preset]);

    return (
        <>
            <Html fullscreen>
                <DirectionSelector
                    options={[
                        { label: t.field_source, value: 'source' },
                        { label: t.field_sink, value: 'sink' },
                        { label: t.field_uniform, value: 'uniform' },
                        { label: t.field_vertical, value: 'vertical' }
                    ]}
                    value={preset}
                    onChange={(val: string) => setPreset(val as any)}
                />
            </Html>

            <OrbitControls makeDefault />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            {/* Sphere Volume */}
            <mesh>
                <sphereGeometry args={[2, 32, 32]} />
                <meshStandardMaterial color={preset === 'source' ? "#44ff88" : "#ff4444"} transparent opacity={0.3} wireframe={false} />
            </mesh>

            {/* Wireframe for 'volume' feel */}
            <mesh>
                <sphereGeometry args={[2, 16, 16]} />
                <meshBasicMaterial color={preset === 'source' ? "#228844" : "#882222"} wireframe={true} transparent opacity={0.1} />
            </mesh>

            {/* Flux Vectors */}
            {vectors.map((v, i) => (
                <group key={i} position={v.pos} lookAt={v.pos.clone().add(v.dir)}>
                    <Line points={[[0, 0, 0], [0, 0, v.dir.length()]]} color="white" lineWidth={1} />
                    <Cone args={[0.08, 0.2, 8]} position={[0, 0, v.dir.length()]} rotation={[Math.PI / 2, 0, 0]} material-color="white" />
                </group>
            ))}

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
                    <h3 style={{ margin: 0, borderRight: '1px solid #666', paddingRight: '15px' }}>{t.divergence}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' }}>
                        <p style={{ margin: 0 }}>{currentField.formula}</p>
                        <p style={{ margin: 0 }}>{currentField.div}</p>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>
                            ∯ F·dS = {(currentField.getFluxIntegral(2)).toFixed(2)}
                        </p>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>
                            ∭ (∇·F)dV = {(currentField.getVolumeIntegral(2)).toFixed(2)}
                        </p>
                    </div>
                </div>
            </Html>
        </>
    );
};
