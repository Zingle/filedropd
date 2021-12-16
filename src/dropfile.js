import {createWriteStream, promises as fs} from "fs";
import {join} from "path";
import {genid, fullURL, http, limit} from "filedropd";

const METADATA_PREFIX = "x-filedrop-metadata-";

export default function dropfile(dir) {
  return async function dropfile(req, res) {
    const metadata = readMetadata(req);

    if (metadata === false) {
      return http.http400("invalid metadata headers");
    }

    const id = genid();
    const path = join(dir, id);
    const file = createWriteStream(path);
    const limiter = limit("50MiB");
    const dataPath = `${path}.metadata`;

    try {
      await pipeline(req, limiter, file);
      await fs.writeFile(dataPath, metadata);
      http.redirect303(res, new URL(`/pickup/${id}`, fullURL(req)));
    } catch (err) {
      try {
        await fs.unlink(path);
        await fs.unlink(dataPath);
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.error(err.message);
          console.error("failed to cleanup", path);
        }
      }

      if (err.message !== "limit reached") {
        throw err;
      }

      http.clientError413(res);
    }
  }
}

async function pipeline(...streams) {
  return new Promise((resolve, reject) => {
    streams[streams.length-1].on("finish", resolve);
    streams.forEach(stream => stream.on("error", reject));
    streams.reduce((a, b) => a?a.pipe(b):b);
  });
}

function readMetadata(req) {
  const metadata = {};

  for (const [name, value] of Object.entries(req.headers)) {
    if (name.toLowerCase().startsWith(METADATA_PREFIX)) {
      if (name in metadata) throw new Error("duplicate metadata");
      metadata[name] = value;
    }
  }

  return Object.entries(metadata).reduce((s, [k,v]) => s+k+":"+v+"\n", "");
}
