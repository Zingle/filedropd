export default async function pipeline(...streams) {
  return new Promise((resolve, reject) => {
    streams[streams.length-1].on("finish", resolve);
    streams.forEach(stream => stream.on("error", reject));
    streams.reduce((a, b) => a?a.pipe(b):b);
  });
}
