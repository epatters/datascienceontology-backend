const ccurllib = require("ccurllib");
const fs = require("fs");
const httpProxy = require("http-proxy");
const path = require("path");

async function getAccessToken(apiKey) {
  ccurllib.init()

  let obj = ccurllib.get(apiKey);
  if (!obj) {
    obj = await ccurllib.getBearerToken(apiKey);
    if (obj)
      ccurllib.set(apiKey, obj);
    else
      throw new Error("Could not obtain bearer token");
  }
  return obj.access_token;
}

async function main() {
  const apiKey = process.env.IAM_API_KEY;
  const accessToken = await getAccessToken(apiKey);
  const target = process.env.COUCH_URL;
  const headers = { Authorization: `Bearer ${accessToken}` };
  const changeOrigin = true;
  const options = { target, headers, changeOrigin };
  const proxy = httpProxy.createProxyServer(options);

  proxy.listen(5984);
}

main();
