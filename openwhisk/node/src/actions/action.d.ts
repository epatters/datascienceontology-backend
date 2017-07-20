/* Every OpenWhisk action must declare a global `main` function.
 */
declare namespace NodeJS {
  export interface Global {
    main: (params: {}) => {};
  }
}
