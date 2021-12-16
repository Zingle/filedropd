import {createReadStream, promises as fs} from "fs";
import {join} from "path";
import {http, pipeline} from "filedropd";
import {METADATA_PREFIX} from "filedropd";

export default function pickup(dir) {
  return async function pickup(req, res, next) {
    const {id} = req.params;
    const path = join(dir, id);
    const dataPath = `${path}.metadata`;
    const encoding = "utf8";

    try {
      // send file metadata in the headers first
      sendMetadata(res, await fs.readFile(dataPath, {encoding}));
      await pipeline(createReadStream(path), res);
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
      http.clientError404(res);
    }
  }
}

function sendMetadata(res, metadata) {
  for (const header of metadata.split("\n")) {
    const delim = header.indexOf(":");

    if (header) {
      if (delim < 0) throw new Error("file has invalid metadata");
      res.set(header.slice(0, delim), header.slice(delim+1));
    }
  }
}
