// PM2 process konfiguratsiyasi — serverni doimiy ishlatadi, qulaganda qayta ishga tushiradi.
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, ".."); // loyiha ildizi (deploy/ ning yuqorisi)

// .env faylini o'qib, qiymatlarni qaytaradi.
// (PM2 cluster rejimida Node'ning --env-file bayrog'i ishonchsiz, shuning uchun
//  bu yerda o'qib, to'g'ridan-to'g'ri jarayon muhitiga uzatamiz.)
function loadEnv(file) {
  const env = {};
  try {
    for (const line of fs.readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
    }
  } catch {}
  return env;
}

module.exports = {
  apps: [
    {
      name: "digital-cfo",
      cwd: root,
      script: "server/index.js",
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production",
        PORT: "4000",
        ...loadEnv(path.join(root, ".env")),
      },
      autorestart: true,
      max_memory_restart: "300M",
    },
  ],
};
