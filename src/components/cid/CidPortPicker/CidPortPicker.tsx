import type { CidPortInfo } from "types/global";

/* ===== TYPES ===== */
type Props = {
    visible: boolean;
    ports: CidPortInfo[];
    loading: boolean;
    onRefresh: () => void;
    onSelect: (path: string) => void;
    onClose?: () => void;
};

/* ===== STYLES ===== */
const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
};

const modalStyle: React.CSSProperties = {
    width: 640,
    maxHeight: '80vh',
    overflow: 'auto',
    background: '#fff',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
};

const listStyle: React.CSSProperties = {
    border: '1px solid #e5e7eb',
    borderRadius: 8
};

const itemStyle: React.CSSProperties = {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    padding: 12,
    borderBottom: '1px solid #eee'
};

const CidPortPicker = ({
    visible,
    ports,
    loading,
    onRefresh,
    onSelect,
    onClose,
}: Props) => {
    if (!visible) return null;

    /* ===== RENDER ===== */
    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, flex: 1 }}>연결된 CID 포트 선택</h3>
                    {onClose && <button onClick={onClose}>닫기</button>}
                </div>

                <div style={{ margin: '12px 0' }}>
                    <button onClick={onRefresh} disabled={loading}>
                        {loading ? '검색 중...' : '다시 검색'}
                    </button>
                </div>

                <div style={listStyle}>
                    {ports.length === 0 && (
                        <div style={{ padding: 12, color: '#666' }}>
                            검색된 포트가 없습니다. 연결 후 “다시 검색”을 눌러주세요.
                        </div>
                    )}
                    {ports.map((p) => (
                        <div key={p.path} style={itemStyle}>
                            <div style={{ flex: 1 }}>
                                <div><b>{p.path}</b></div>
                                <div style={{ fontSize: 12, color: '#666' }}>
                                    {p.friendlyName || p.manufacturer || 'Device'} · VID: {p.vendorId ?? '-'} / PID: {p.productId ?? '-'}
                                    {p.isLikelyCid ? ' · (CID 후보)' : ''}
                                </div>
                            </div>
                            <button className="primary" onClick={() => onSelect(p.path)}>선택</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CidPortPicker;