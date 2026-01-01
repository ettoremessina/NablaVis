import { useMemo, useState } from 'react';
import { OrbitControls, Line, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTranslation } from '../utils/translate';
import { DirectionSelector } from '../components/DirectionSelector';

// Scalar Fields
const scalarFields = {
    hill: {
        label: 'Hill & Valley',
        f: (x: number, y: number) => Math.sin(x / 2) * Math.cos(y / 2) * 2,
        formula: 'f(x,y) = 2sin(x/2)cos(y/2)'
    },
    paraboloid: {
        label: 'Paraboloid',
        f: (x: number, y: number) => -(x * x + y * y) / 10 + 2,
        formula: 'f(x,y) = 2 - (x² + y²)/10'
    },
    saddle: {
        label: 'Saddle Surface',
        f: (x: number, y: number) => (x * x - y * y) / 4,
        formula: 'f(x,y) = (x² - y²)/4'
    },
    gaussian: {
        label: 'Gaussian Peak',
        f: (x: number, y: number) => 3 * Math.exp(-(x * x + y * y) / 4),
        formula: 'f(x,y) = 3exp(-(x² + y²)/4)'
    }
};

export const GradientScene: React.FC = () => {
    const t = useTranslation();
    const [preset, setPreset] = useState<keyof typeof scalarFields>('hill');
    const [p, setP] = useState<[number, number]>([-2, -2]);
    const [q, setQ] = useState<[number, number]>([2, 0]);

    const currentField = scalarFields[preset];
    const f = currentField.f;

    // Create scalar field mesh
    const fieldGeometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(10, 10, 50, 50);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            pos.setZ(i, f(x, y));
        }
        geo.computeVertexNormals();
        return geo;
    }, [preset]);

    // Create path points (linear for now)
    const pathPoints = useMemo(() => {
        const points = [];
        const steps = 50;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = p[0] + (q[0] - p[0]) * t;
            const y = p[1] + (q[1] - p[1]) * t;
            const z = f(x, y); // Path lies on the surface
            points.push(new THREE.Vector3(x, y, z + 0.05)); // Slightly above
        }
        return points;
    }, [p, q, preset]);

    // Calculate integral (f(q) - f(p))
    const valP = f(p[0], p[1]);
    const valQ = f(q[0], q[1]);
    const difference = valQ - valP;

    // Draggable handles Logic (Simplified: clicking on plane moves nearest point? Or just sliders/input for now to avoid raycasting complexity in this step? Let's use simple spheres that listen to drag? drei's DragControls or PivotControls? 
    // For simplicity, let's just assume valid clicks on the base plane update the nearest point P or Q.)

    const handlePlaneClick = (e: any) => {
        const x = e.point.x;
        const y = e.point.z; // Use Z for the 2D plane coordinate (Y is up)

        const distP = Math.hypot(x - p[0], y - p[1]);
        const distQ = Math.hypot(x - q[0], y - q[1]);

        if (distP < distQ) {
            setP([x, y]);
        } else {
            setQ([x, y]);
        }
    };

    return (
        <>
            <Html fullscreen>
                <DirectionSelector
                    options={[
                        { label: t.field_hill, value: 'hill' },
                        { label: t.field_paraboloid, value: 'paraboloid' },
                        { label: t.field_saddle_surface, value: 'saddle' },
                        { label: t.field_gaussian, value: 'gaussian' }
                    ]}
                    value={preset}
                    onChange={(val: string) => setPreset(val as any)}
                />
            </Html>

            <OrbitControls makeDefault />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1} />

            {/* Scalar Field Surface */}
            <mesh geometry={fieldGeometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={handlePlaneClick}>
                <meshStandardMaterial color="#4488ff" wireframe={false} transparent opacity={0.8} side={THREE.DoubleSide} />
            </mesh>
            <gridHelper args={[10, 10]} position={[0, -2, 0]} />

            {/* Path Line */}
            <Line points={pathPoints} color="yellow" lineWidth={4} />

            {/* Points P and Q */}
            <Sphere position={[p[0], f(p[0], p[1]), p[1]]} args={[0.2]} onClick={(e) => { e.stopPropagation(); console.log('clicked P') }}>
                <meshStandardMaterial color="red" />
                <Html position={[0, 0.3, 0]}>
                    <div style={{ color: 'black', background: 'white', padding: '2px', borderRadius: '4px' }}>P ({valP.toFixed(2)})</div>
                </Html>
            </Sphere>

            <Sphere position={[q[0], f(q[0], q[1]), q[1]]} args={[0.2]}>
                <meshStandardMaterial color="green" />
                <Html position={[0, 0.3, 0]}>
                    <div style={{ color: 'black', background: 'white', padding: '2px', borderRadius: '4px' }}>Q ({valQ.toFixed(2)})</div>
                </Html>
            </Sphere>

            {/* Interactive Base Plane for clicking to move */}
            {/* Interactive Base Plane for clicking to move */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.1, 0]} onClick={handlePlaneClick} visible={true}>
                <planeGeometry args={[10, 10]} />
                <meshBasicMaterial color="red" transparent opacity={0} />
            </mesh>

            {/* Info Overlay in 3D space - now HUD */}
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
                    <h3 style={{ margin: 0, borderRight: '1px solid #666', paddingRight: '15px' }}>{t.gradient}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'left' }}>
                        <p style={{ margin: 0 }}>{currentField.formula}</p>
                        <p style={{ margin: 0 }}>f(Q) - f(P) = {valQ.toFixed(2)} - {valP.toFixed(2)} = {difference.toFixed(2)}</p>
                        <p style={{ margin: 0 }}>∫ ∇f · dr = {difference.toFixed(2)}</p>
                        <small style={{ marginTop: '5px', opacity: 0.7 }}>{t.click_to_move}</small>
                    </div>
                </div>
            </Html>
        </>
    );
};
