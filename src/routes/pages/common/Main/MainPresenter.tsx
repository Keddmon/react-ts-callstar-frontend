import './Main.style.css';
import { CidControlPanel, CidEventLog, CidStatusBar } from 'components';

type Props = {
    isElectron: boolean;
    connected: boolean;
    portPath: string;
    baudRate: number;
    channel: string;
    events: { type: string; payload?: any; timestamp: number }[];

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
};

const MainPresenter = ({
    isElectron,
    connected,
    portPath,
    baudRate,
    channel,
    events,
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
}: Props) => {
    return (
        <div className="page">
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