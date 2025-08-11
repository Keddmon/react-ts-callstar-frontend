import './Main.style.css';
import { CidControlPanel, CidEventLog, CidStatusBar, CidPortPicker } from 'components';
import { CidPortInfo } from 'types/global';

type Props = {
    isElectron: boolean;
    connected: boolean;
    portPath: string;
    baudRate: number;
    channel: string;
    events: { type: string; payload?: any; timestamp: number }[];

    ports: CidPortInfo[];
    loadingPorts: boolean;

    onSetPortPath: (v: string) => void;
    onSetBaudRate: (v: number) => void;
    onSetChannel: (v: string) => void;

    onOpen: () => void;
    onClose: () => void;
    onStatus: () => void;
    onDeviceInfo: () => void;
    onDial: (phone: string) => void;
    onForceEnd: () => void;
    onClearEvents: () => void;

    onRefreshPorts: () => void;
};

const MainPresenter = ({
    isElectron,
    connected,
    portPath,
    baudRate,
    channel,
    events,
    ports,
    loadingPorts,
    onSetPortPath,
    onSetBaudRate,
    onSetChannel,
    onOpen,
    onClose,
    onStatus,
    onDeviceInfo,
    onDial,
    onForceEnd,
    onClearEvents,
    onRefreshPorts,
}: Props) => {
    const needPick = isElectron && !connected && !portPath;

    /* ===== RENDER ===== */
    return (
        <div className="page">
            <CidPortPicker
                visible={needPick}
                ports={ports}
                loading={loadingPorts}
                onRefresh={onRefreshPorts}
                onSelect={(path) => onSetPortPath(path)}
            />

            <header>
                <h2>CallStar — CID 테스트 패널</h2>
            </header>

            <CidStatusBar isElectron={isElectron} connected={connected} />

            <div className="grid">
                <CidControlPanel
                    portPath={portPath}
                    setPortPath={onSetPortPath}
                    baudRate={baudRate}
                    setBaudRate={onSetBaudRate}
                    channel={channel}
                    setChannel={onSetChannel}
                    connected={connected}
                    onOpen={onOpen}
                    onClose={onClose}
                    onStatus={onStatus}
                    onDeviceInfo={onDeviceInfo}
                />
            </div>

            <CidEventLog
                events={events}
                onClear={onClearEvents}
            />
        </div>
    );
}

export default MainPresenter;