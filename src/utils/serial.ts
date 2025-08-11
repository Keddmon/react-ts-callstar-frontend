import type { CidPortInfo } from 'types/global';

export function guessLikelyCid(p: any): boolean {
    const text = `${p?.manufacturer ?? ''} ${p?.friendlyName ?? ''} ${p?.pnpId ?? ''}`.toLowerCase();
    return /(cp210|silicon labs|prolific|usb[-\s]?to[-\s]?(uart|serial)|cti|callstar|cid)/.test(text);
}

export function normalizePorts(raw: any[]): CidPortInfo[] {
    return (raw || []).map((p: any) => ({
        path: p?.path ?? '',
        manufacturer: p?.manufacturer,
        serialNumber: p?.serialNumber,
        pnpId: p?.pnpId,
        locationId: p?.locationId,
        vendorId: p?.vendorId,
        productId: p?.productId,
        friendlyName: p?.friendlyName,
        isLikelyCid: guessLikelyCid(p),
    }));
}