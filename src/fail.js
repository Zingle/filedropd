export default function fail(err, status=1) {
  console.error(process.env.DEBUG ? err : err.message);
  process.exit("status" in err ? err.status : status);
}
