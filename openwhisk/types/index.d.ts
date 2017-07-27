/* Type definitions for the OpenWhisk JS client.

  It does not yet have official type definitions. These are hastily assembled
  and very incomplete.
 */

interface Client {
  actions: Actions
}

interface ClientOptions {
  apihost?: string;
  api_key?: string;
  
  api?: string;
  namespace?: string;
  ignore_certs?: boolean;
  apigw_token?: string;
  apigw_space_guid?: string;
}

interface Actions {
  // Promise can have type `ActionResult` or `any` depending on value of
  // `result` option.
  invoke: (options: ActionOptions) => Promise<any>;
}

interface ActionOptions {
  name: string;
  blocking?: boolean;
  result?: boolean;
  params?: any;
}

interface ActionResult {
  activationId: string;
  name: string;
  namespace: string;
  version:string;
  publish: boolean;
  subject: string;
  
  duration: number;
  start: number;
  end: number;
  
  response: {
    result: any;
    success: boolean;
    status: string;
  };
  logs: string[];
}

declare function OpenWhisk(options?: ClientOptions): Client;
 
declare module "openwhisk" {
  export = OpenWhisk;
}
