import { useCid } from 'hooks/useCid';
import MainPresenter from './MainPresenter';

const MainContainer = () => {

    /* ===== HOOKS ===== */
    const {
        isElectron,
        connected, portPath, setPortPath, baudRate, setBaudRate,
        channel, setChannel,
        events, setEvents,

        open, close, status, deviceInfo, dial, forceEnd,
    } = useCid();

    /* ===== RENDER ===== */
    return (
        <MainPresenter
            isElectron={isElectron}
            connected={connected}
            portPath={portPath}
            baudRate={baudRate}
            channel={channel}
            events={events}

            onSetPortPath={setPortPath}
            onSetBaudRate={setBaudRate}
            onSetChannel={setChannel}

            onOpen={open}
            onClose={close}
            onStatus={status}
            onDeviceInfo={deviceInfo}
            onDial={dial}
            onForceEnd={forceEnd}
            onClearEvents={() => setEvents([])}
        />
    );
};

export default MainContainer;