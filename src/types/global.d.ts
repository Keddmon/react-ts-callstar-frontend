export { };

declare global {
    interface Window {
        cid?: {
            open: (path: string, baudRate?: number) => Promise<any>;
            close: () => Promise<any>;
            status: () => Promise<any>;
            dial: (phone: string, channel?: string) => Promise<boolean>;
            forceEnd: (channel?: string) => Promise<boolean>;
            deviceInfo: (channel?: string) => Promise<boolean>;
            listPorts: () => Promise<CidPortInfo[] | { error: string }>;
            onEvent: (handler: (evt: any) => void) => () => void;
        };
    }
}

export type CidPortInfo = {
    path: string;
    manufacturer?: string;
    serialNumber?: string;
    pnpId?: string;
    locationId?: string;
    vendorId?: string;
    productId?: string;
    friendlyName?: string;
    isLikelyCid: boolean;
};
