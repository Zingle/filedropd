const TYPE_TEXT = "text/plain; charset=utf-8";

export function http404() {
  return function http404(req, res) {
    res.status(404);
    res.type(TYPE_TEXT);
    res.send("Not Found\n");
    res.end();
  }
}
