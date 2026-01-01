import { useTranslation } from '../utils/translate';

interface DirectionSelectorProps {
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
}

export const DirectionSelector: React.FC<DirectionSelectorProps> = ({ options, value, onChange }) => {
    const t = useTranslation();
    return (
        <div style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.6)',
            padding: '10px',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
        }}>
            <label style={{ color: 'white', fontSize: '0.9rem' }}>{t.select_field}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    padding: '5px',
                    borderRadius: '4px',
                    border: '1px solid #555',
                    background: '#333',
                    color: 'white',
                    cursor: 'pointer'
                }}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
