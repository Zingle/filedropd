import {resolve} from "path";

export default function configure(env) {
  const config = {};

  config.dir = process.cwd();

  if (env.FILEDROP_PORT) config.port = readint(env.FILEDROP_PORT);
  if (env.FILEDROP_DIR) config.dir = resolve(env.FILEDROP_DIR);
  if (env.FILEDROP_SECRET) config.secret = env.FILEDROP_SECRET;

  if (isNaN(config.port) || config.port < 1) throw new Error("invalid port");
  if (!env.FILEDROP_SECRET) throw new Error("secret not configured");

  return config;
}

function readint(value) {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && /^[0-9]+$/.test(value)) return parseInt(value);
  return NaN;
}
