import { useState } from 'react';

type Props = {
    portPath: string;
    setPortPath: (v: string) => void;
    baudRate: number;
    setBaudRate: (v: number) => void;
    channel: string;
    setChannel: (v: string) => void;
    connected: boolean;
    onOpen: () => void;
    onClose: () => void;
    onStatus: () => void;
    onDeviceInfo: () => void;
};

const CidControlPanel = ({
    portPath,
    setPortPath,
    baudRate,
    setBaudRate,
    channel,
    setChannel,
    connected,
    onOpen,
    onClose,
    onStatus,
    onDeviceInfo,
}: Props) => {
    /* ===== STATE ===== */
    const [portInput, setPortInput] = useState(portPath);

    /* ===== RENDER ===== */
    return (
        <div className='card'>
            <h3>포트 연결</h3>
            <div className='row'>
                <label>포트 경로</label>
                <input
                    value={portInput}
                    onChange={(e) => setPortInput(e.target.value)}
                    placeholder={'예) COM5'}
                    style={{ flex: 1 }}
                />
                <button onClick={() => setPortPath(portInput)}>적용</button>
            </div>
            <div className='row'>
                <label>연결된 포트</label>
                <span>{portPath}</span>
            </div>

            <div className='row'>
                <label>BaudRate</label>
                <input
                    type='number'
                    value={baudRate}
                    onChange={(e) => setBaudRate(Number(e.target.value))}
                    min={1200}
                    step={600}
                    style={{ width: 120 }}
                />
                <label style={{ marginLeft: 16 }}>Channel</label>
                <input
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    style={{ width: 60 }}
                />
            </div>

            <div className='row'>
                {!connected ? (
                    <button className='primary' onClick={onOpen}>열기</button>
                ) : (
                    <button className='danger' onClick={onOpen}>닫기</button>
                )}
                <button onClick={onStatus}>상태</button>
                <button onClick={onDeviceInfo}>장치정보 요청</button>
            </div>
        </div>
    );
}

export default CidControlPanel;