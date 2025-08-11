import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type CidEvent = {
    type: string;          // 예: 'incoming', 'device-info', 'off-hook', 'on-hook' 등
    payload?: any;
    timestamp: number;     // 프런트 추가 타임스탬프
};

export function useCid() {
    const isElectron = useMemo(() => typeof window !== 'undefined' && !!window.cid, []);
    const [connected, setConnected] = useState(false);
    const [portPath, setPortPath] = useState<string>('');
    const [baudRate, setBaudRate] = useState<number>(19200);
    const [channel, setChannel] = useState<string>('1');
    const [events, setEvents] = useState<CidEvent[]>([]);
    const unsubRef = useRef<(() => void) | null>(null);

    const pushEvent = useCallback((type: string, payload?: any) => {
        setEvents((prev) => [{ type, payload, timestamp: Date.now() }, ...prev].slice(0, 200));
    }, []);

    const open = useCallback(async () => {
        if (!isElectron) {
            pushEvent('warn', 'Electron 환경이 아닙니다.');
            return;
        }
        if (!portPath) {
            pushEvent('error', '포트 경로를 입력하세요. (예: COM3, /dev/ttyUSB0)');
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

    // 이벤트 구독/해제
    useEffect(() => {
        if (!isElectron) return;
        if (unsubRef.current) unsubRef.current(); // 중복 구독 방지

        const unsub = window.cid!.onEvent((evt) => {
            // evt: main → preload → renderer로 온 장비 이벤트
            pushEvent(evt?.type ?? 'event');
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

        // 명령
        open, close, status, deviceInfo, dial, forceEnd,
    };
}