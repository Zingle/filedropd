export default function fullURL(req) {
  return new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
}
