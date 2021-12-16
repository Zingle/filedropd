import {resolve} from "path";

export default function configure(env) {
  const config = {};

  config.dir = process.cwd();

  if (env.FILEDROP_PORT) config.port = readint(env.FILEDROP_PORT);
  if (env.FILEDROP_DIR) config.dir = resolve(env.FILEDROP_DIR);
  if (env.FILEDROP_USER) config.user = env.FILEDROP_USER;
  if (env.FILEDROP_PASS) config.password = env.FILEDROP_PASS;

  if (isNaN(config.port) || config.port < 1) throw new Error("invalid port");
  if (!config.user) throw new Error("user not configured");
  if (!config.password) throw new Error("password not configured");

  return config;
}

function readint(value) {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && /^[0-9]+$/.test(value)) return parseInt(value);
  return NaN;
}
