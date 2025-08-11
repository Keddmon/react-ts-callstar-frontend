import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CidPortInfo } from '../types/global';

type CidEvent = { type: string; payload?: any; timestamp: number };

export function useCid() {
    // const isElectron = useMemo(() => typeof window !== 'undefined' && !!window.cid, []);
    const isElectron = typeof window !== 'undefined' && !!(window as any).cid;
    const [connected, setConnected] = useState(false);
    const [portPath, setPortPath] = useState<string>('');
    const [baudRate, setBaudRate] = useState<number>(19200);
    const [channel, setChannel] = useState<string>('1');
    const [events, setEvents] = useState<CidEvent[]>([]);
    const [ports, setPorts] = useState<CidPortInfo[]>([]);
    const [loadingPorts, setLoadingPorts] = useState(false);
    const unsubRef = useRef<(() => void) | null>(null);

    const pushEvent = useCallback((type: string, payload?: any) => {
        setEvents((prev) => [{ type, payload, timestamp: Date.now() }, ...prev].slice(0, 200));
    }, []);

    const listPorts = useCallback(async () => {
        if (!isElectron) return;
        setLoadingPorts(true);
        try {
            const result = await window.cid!.listPorts();
            if ((result as any)?.error) {
                pushEvent('error', (result as any).error);
                setPorts([]);
            } else {
                setPorts(result as CidPortInfo[]);
            }
        } catch (e: any) {
            pushEvent('error', e?.message ?? String(e));
            setPorts([]);
        } finally {
            setLoadingPorts(false);
        }
    }, [isElectron, pushEvent]);

    const open = useCallback(async () => {
        if (!isElectron) {
            pushEvent('warn', 'Electron 환경이 아닙니다.');
            return;
        }
        if (!portPath) {
            pushEvent('error', '포트를 먼저 선택하세요.');
            return;
        }
        try {
            await window.cid!.open(portPath, baudRate);
            setConnected(true);
            pushEvent('open', { portPath, baudRate });
        } catch (e: any) {
            pushEvent('error', e?.message ?? String(e));
        }
    }, [isElectron, portPath, baudRate, pushEvent]);

    const close = useCallback(async () => {
        if (!isElectron) return;
        try {
            await window.cid!.close();
            setConnected(false);
            pushEvent('close');
        } catch (e: any) {
            pushEvent('error', e?.message ?? String(e));
        }
    }, [isElectron, pushEvent]);

    const status = useCallback(async () => {
        if (!isElectron) return;
        try {
            const s = await window.cid!.status();
            pushEvent('status', s);
        } catch (e: any) {
            pushEvent('error', e?.message ?? String(e));
        }
    }, [isElectron, pushEvent]);

    const deviceInfo = useCallback(async () => {
        if (!isElectron) return;
        try {
            const ok = await window.cid!.deviceInfo(channel);
            pushEvent('device-info:request', { ok, channel });
        } catch (e: any) {
            pushEvent('error', e?.message ?? String(e));
        }
    }, [isElectron, channel, pushEvent]);

    const dial = useCallback(async (phoneNumber: string) => {
        if (!isElectron) return;
        try {
            const ok = await window.cid!.dial(phoneNumber, channel);
            pushEvent('dial', { ok, phoneNumber, channel });
        } catch (e: any) {
            pushEvent('error', e?.message ?? String(e));
        }
    }, [isElectron, channel, pushEvent]);

    const forceEnd = useCallback(async () => {
        if (!isElectron) return;
        try {
            const ok = await window.cid!.forceEnd(channel);
            pushEvent('force-end', { ok, channel });
        } catch (e: any) {
            pushEvent('error', e?.message ?? String(e));
        }
    }, [isElectron, channel, pushEvent]);

    // 첫 마운트 시 포트 목록 로드
    useEffect(() => {
        if (isElectron) listPorts();
    }, [isElectron, listPorts]);

    // 이벤트 구독
    useEffect(() => {
        if (!isElectron) return;
        if (unsubRef.current) unsubRef.current();

        const unsub = window.cid!.onEvent((evt) => {
            pushEvent(evt?.type ?? 'event', evt?.payload);
        });
        unsubRef.current = unsub;

        return () => {
            if (unsubRef.current) unsubRef.current();
            unsubRef.current = null;
        };
    }, [isElectron, pushEvent]);

    return {
        // 상태
        isElectron,
        connected, portPath, setPortPath, baudRate, setBaudRate,
        channel, setChannel,
        events, setEvents,
        ports, loadingPorts,

        // 명령
        listPorts, open, close, status, deviceInfo, dial, forceEnd,
    };
}
