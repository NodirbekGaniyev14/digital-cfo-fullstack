// PM2 process konfiguratsiyasi — serverni doimiy ishlatadi, qulaganda qayta ishga tushiradi.
const path = require("path");
const root = path.resolve(__dirname, ".."); // loyiha ildizi (deploy/ ning yuqorisi)

module.exports = {
  apps: [
    {
      name: "digital-cfo",
      cwd: root,
      script: "server/index.js",
      // .env mavjud bo'lsa o'qiydi (Telegram token va h.k.), bo'lmasa yiqilmaydi.
      node_args: "--env-file-if-exists=.env",
      env: {
        NODE_ENV: "production",
        PORT: "4000",
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "300M",
    },
  ],
};
