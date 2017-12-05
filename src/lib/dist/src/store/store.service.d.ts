export declare class StoreService {
    private memStore;
    private memStore$;
    private find(key);
    private find$(key, autoAdd?);
    get(key: string, where?: any): any;
    get$(key: string): any;
    set(strKey: string, value: any, where?: any): boolean;
    setByObservable(key: string, observable: any): void;
}
