/**
 * preload.ts
 * ---
 * 렌더러 타입체크용.
 * (preload.ts에 노출된 window.cid와 동일한 시그니처)
 */
import type { CidStatus, CidEvent } from './cid';

declare global {
    interface Window {
        cid: {
            open: (path: string, baudRate?: number) => Promise<CidStatus>;
            close: () => Promise<CidStatus>;
            status: () => Promise<CidStatus>;
            dial: (phone: string, channel?: string) => Promise<boolean>;
            forceEnd: (channel?: string) => Promise<boolean>;
            deviceInfo: (channel?: string) => Promise<boolean>;
            onEvent: (handler: (evt: CidEvent) => void) => () => void;
        };
    }
}

export {};