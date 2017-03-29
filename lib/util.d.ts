export declare const Symbol: any;
export declare function invariant(condition: any, message: string, warn?: boolean): void;
export declare function merge<T extends {
    [key: string]: any;
}, U extends {
    [key: string]: any;
}>(a: T, b: U): T & U;
export declare const requestAnimationFrame: (cb: any) => any;
export declare const requestIdleCallback: (cb: any) => any;
