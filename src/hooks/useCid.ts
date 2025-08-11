import { useCallback, useEffect, useRef, useState } from 'react';
import type { CidPortInfo } from 'types/global';
import { normalizePorts } from 'utils/serial';

type CidEvent = { type: string; payload?: any; timestamp: number };

export function useCid() {
    const [isElectron, setIsElectron] = useState(false);
    const [connected, setConnected] = useState(false);
    const [portPath, setPortPath] = useState<string>('');
    const [baudRate, setBaudRate] = useState<number>(19200);
    const [channel, setChannel] = useState<string>('1');
    const [events, setEvents] = useState<CidEvent[]>([]);
    const [ports, setPorts] = useState<CidPortInfo[]>([]);
    const [loadingPorts, setLoadingPorts] = useState(false);
    const unsubRef = useRef<(() => void) | null>(null);
    const mountedRef = useRef(true);

    const pushEvent = useCallback((type: string, payload?: any) => {
        setEvents((prev) => [{ type, payload, timestamp: Date.now() }, ...prev].slice(0, 200));
    }, []);

    /** 1) Electron 환경 판별: 한 번만, load 이후 안전 타이밍에 */
    useEffect(() => {
        mountedRef.current = true;
        const detect = () => {
            const hasBridge = typeof window !== 'undefined' && !!window.cid;
            const isElectronUA = /Electron/i.test(navigator.userAgent);
            const ok = hasBridge && isElectronUA;
            setIsElectron(ok);
            if (!ok) {
                console.warn('Electron 환경이 아닙니다.');
            }
        };
        if (document.readyState === 'complete') {
            setTimeout(detect, 0);
        } else {
            window.addEventListener('load', () => setTimeout(detect, 0), { once: true });
        }
        return () => {
            mountedRef.current = false;
        };
    }, []);

    /** 2) 포트 목록 */
    const listPorts = useCallback(async () => {
        if (!isElectron || !window.cid) return;
        setLoadingPorts(true);
        try {
            const result = await window.cid.listPorts();
            const normalized = normalizePorts(result);
            setPorts(normalized);
        } catch (e: any) {
            pushEvent('error', e?.message ?? String(e));
            setPorts([]);
        } finally {
            setLoadingPorts(false);
        }
    }, [isElectron, pushEvent]);

    // 환경 판별 완료 후 1회 자동 로드 (원하면 주석 해제)
    useEffect(() => {
        if (isElectron) {
            listPorts();
        }
    }, [isElectron, listPorts]);

    /** 3) 이벤트 구독 */
    useEffect(() => {
        if (!isElectron || !window.cid) return;
        // 이전 구독 해제
        if (unsubRef.current) unsubRef.current();

        const unsub = window.cid.onEvent((evt) => {
            pushEvent(evt?.type ?? 'event', evt?.payload);
            // 연결 상태를 이벤트로도 동기화하고 싶다면 여기서 처리
            if (evt?.type === 'port:closed') setConnected(false);
            if (evt?.type === 'port:opened') setConnected(true);
        });
        unsubRef.current = unsub;

        return () => {
            unsubRef.current?.();
            unsubRef.current = null;
        };
    }, [isElectron, pushEvent]);

    /** 4) 명령들 */
    const open = useCallback(async () => {
        if (!isElectron || !window.cid) {
            pushEvent('warn', 'Electron 환경이 아닙니다.');
            return;
        }
        if (!portPath) {
            pushEvent('error', '포트를 먼저 선택하세요.');
            return;
        }
        try {
            await window.cid.open(portPath, baudRate);
            if (mountedRef.current) setConnected(true);
            pushEvent('open', { portPath, baudRate });
        } catch (e: any) {
            pushEvent('error', e?.message ?? String(e));
        }
    }, [isElectron, portPath, baudRate, pushEvent]);

    const close = useCallback(async () => {
        if (!isElectron || !window.cid) return;
        try {
            await window.cid.close();
            if (mountedRef.current) setConnected(false);
            pushEvent('close');
        } catch (e: any) {
            pushEvent('error', e?.message ?? String(e));
        }
    }, [isElectron, pushEvent]);

    const status = useCallback(async () => {
        if (!isElectron || !window.cid) return;
        try {
            const s = await window.cid.status();
            pushEvent('status', s);
        } catch (e: any) {
            pushEvent('error', e?.message ?? String(e));
        }
    }, [isElectron, pushEvent]);

    const deviceInfo = useCallback(async () => {
        if (!isElectron || !window.cid) return;
        try {
            const ok = await window.cid.deviceInfo(channel);
            pushEvent('device-info:request', { ok, channel });
        } catch (e: any) {
            pushEvent('error', e?.message ?? String(e));
        }
    }, [isElectron, channel, pushEvent]);

    const dial = useCallback(
        async (phoneNumber: string) => {
            if (!isElectron || !window.cid) return;
            try {
                const ok = await window.cid.dial(phoneNumber, channel);
                pushEvent('dial', { ok, phoneNumber, channel });
            } catch (e: any) {
                pushEvent('error', e?.message ?? String(e));
            }
        },
        [isElectron, channel, pushEvent],
    );

    const forceEnd = useCallback(async () => {
        if (!isElectron || !window.cid) return;
        try {
            const ok = await window.cid.forceEnd(channel);
            pushEvent('force-end', { ok, channel });
        } catch (e: any) {
            pushEvent('error', e?.message ?? String(e));
        }
    }, [isElectron, channel, pushEvent]);

    return {
        // 상태
        isElectron,
        connected,
        portPath,
        setPortPath,
        baudRate,
        setBaudRate,
        channel,
        setChannel,
        events,
        setEvents,
        ports,
        loadingPorts,
        // 명령
        listPorts,
        open,
        close,
        status,
        deviceInfo,
        dial,
        forceEnd,
    };
}