export declare const Symbol: any;
export declare function invariant(condition: any, message: string | (() => string), warn?: boolean): void;
export declare function merge<T extends {
    [key: string]: any;
}, U extends {
    [key: string]: any;
}>(a: T, b: U): T & U;
export declare function typeOf(a: any): string;
export declare const requestAnimationFrame: (cb: any) => any;
export declare const requestIdleCallback: (cb: any) => any;
export declare function isDefined(a: any): boolean;
export declare const keyList: (o: any) => string[];
