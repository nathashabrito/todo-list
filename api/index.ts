import { buildApp } from "./src/app";

let app: any;

export default async function handler(req: any, res: any) {
  if (!app) {
    app = buildApp();
    await app.ready();
  }
  
  const response = await app.inject({
    method: req.method,
    url: req.url,
    headers: req.headers,
    payload: req.body
  });
  
  res.status(response.statusCode);
  Object.keys(response.headers).forEach(key => {
    res.setHeader(key, response.headers[key]);
  });
  
  res.send(response.body);
}

