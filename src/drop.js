import {createWriteStream, promises as fs} from "fs";
import {join} from "path";
import {genid, fullURL, http, limit, pipeline} from "filedropd";
import {METADATA_PREFIX} from "filedropd";

export default function drop(dir) {
  return async function drop(req, res) {
    const metadata = readMetadata(req);

    if (metadata === false) {
      return http.http400("invalid metadata headers");
    }

    const id = genid();
    const path = join(dir, id);
    const file = createWriteStream(path, {flags: "wx"});
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

function readMetadata(req) {
  const metadata = {};

  for (const [key, value] of Object.entries(req.headers)) {
    const header = key.toLowerCase();

    if (header.startsWith(METADATA_PREFIX)) {
      if (header in metadata) throw new Error("duplicate metadata");
      metadata[header] = value;
    }
  }

  return Object.entries(metadata).reduce((s, [k,v]) => s+k+":"+v+"\n", "");
}
