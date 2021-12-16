const TYPE_TEXT = "text/plain; charset=utf-8";

export function clientError404(res) {
  const clientError = http404();
  const req = {};
  clientError(req, res);
}

export function clientError413(res) {
  const clientError = http413();
  const req = {};
  clientError(req, res);
}

export function http204() {
  return function http204(req, res) {
    res.status(204);
    res.end();
  }
}

export function http303(location) {
  return function http303(req, res) {
    res.status(303);
    res.type(TYPE_TEXT);
    res.location(location);
    res.send(`See Other: ${location}\n`);
    res.end();
  };
}

export function http400(message="unknown") {
  return function http400(req, res) {
    res.status(400);
    res.type(TYPE_TEXT);
    res.send(`Bad Request: ${message}\n`);
    res.end();
  }
}

export function http404() {
  return function http404(req, res) {
    res.status(404);
    res.type(TYPE_TEXT);
    res.send("Not Found\n");
    res.end();
  }
}

export function http405(...methods) {
  return function http405(req, res) {
    res.status(405);
    res.type(TYPE_TEXT);
    res.set("Allow", methods.join(","));
    res.send(`Method Not Allowed: allows ${methods.join(",")}\n`);
    res.end();
  }
}

export function http413() {
  return function http413(req, res) {
    res.status(413);
    res.type(TYPE_TEXT);
    res.send("Request Entity Too Large\n");
    res.end();
  }
}

export function http500() {
  return function http500(req, res) {
    res.status(500);
    res.type(TYPE_TEXT);
    res.send("Internal Server Error\n");
    res.end();
  }
}

export function redirect303(res, location) {
  const redirect = http303(location);
  const req = {};
  redirect(req, res);
}

export function success204(res) {
  const success = http204();
  const req = {};
  success(req, res);
}
