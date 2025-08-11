type Props = {
    isElectron: boolean;
    connected: boolean;
};

const CidStatusBar = ({
    isElectron,
    connected,
}: Props) => {

    /* ===== RENDER ===== */
    return (
        <div style={{
            padding: '8px 12px',
            borderRadius: 8,
            background: connected ? '#e6ffd' : '#fff7e6',
            color: connected ? '#095a2a' : '8a5a00',
            border: `1px solid ${connected ? '#b7eb8f' : '#ffe58f'}`
        }}>
            <b>환경: </b> {isElectron ? 'Electron OK' : '브라우저(테스트 모드)'}
            <span style={{ marginLeft: 12 }} />
            <b>연결: </b> {connected ? '열림' : '닫힘'}
        </div>
    );
}

export default CidStatusBar;