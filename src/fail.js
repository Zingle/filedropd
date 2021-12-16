export default function fail(err, status=1) {
  status = "status" in err ? err.status : status;
  err = err?.message || String(err);

  console.error(err);
  process.exit(status);
}
