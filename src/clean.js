import {promises as fs} from "fs";
import {join} from "path";
import {http} from "filedropd";

export default function clean(dir) {
  return async function clean(req, res) {
    const {id} = req.params;
    const path = join(dir, id);
    const dataPath = `${path}.metadata`;

    try {
      await fs.unlink(path);
      await fs.unlink(dataPath);
      http.success204(res);
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
      http.clientError404(res);
    }
  }
}
