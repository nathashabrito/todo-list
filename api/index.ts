import { buildApp } from "./src/app";

export default async function handler(req: any, res: any) {
  const app = buildApp();
  await app.ready();
  
  // Remove o prefixo /api da URL para o Fastify
  const url = req.url.replace('/api', '') || '/';
  
  const response = await app.inject({
    method: req.method,
    url: url,
    headers: req.headers,
    payload: req.body
  });
  
  res.status(response.statusCode);
  Object.keys(response.headers).forEach(key => {
    res.setHeader(key, response.headers[key]);
  });
  
  res.send(response.body);
}

