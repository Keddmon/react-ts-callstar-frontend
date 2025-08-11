export {};

declare global {
    interface Window {
        cid?: {
            open: (path: string, baudRate?: number) => Promise<any>;
            close: () => Promise<any>;
            status: () => Promise<any>;
            dial: (phone: string, channel?: string) => Promise<boolean>;
            forceEnd: (channel?: string) => Promise<boolean>;
            deviceInfo: (channel?: string) => Promise<boolean>;
            onEvent: (handler: (evt: any) => void) => () => void;
        };
    }
}