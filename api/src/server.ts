import { buildApp } from "./app";
import { env } from "./env";

buildApp()
  .then(app => app.listen({ host: "0.0.0.0", port: env.PORT }))
  .then(() => console.log(`API on http://localhost:${env.PORT}`))
  .catch((err) => { console.error(err); process.exit(1); });
