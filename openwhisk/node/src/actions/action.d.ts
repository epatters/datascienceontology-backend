/* Every OpenWhisk action must declare a global `main` function.
 */
declare namespace NodeJS {
  export interface Global {
    main: (params: {}) => {};
  }
}

/* The OpenWhisk client-side library does not yet have type defintiions.
 */
declare module "openwhisk";
