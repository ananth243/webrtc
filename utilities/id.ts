export default function generateId() {
  const opts = "abcdefghijklmnopqrstuvwxyz";
  const id: string[] = [];
  id.push(
    opts[Math.floor(Math.random() * opts.length)] +
      opts[Math.floor(Math.random() * opts.length)] +
      opts[Math.floor(Math.random() * opts.length)]
  );
  id.push(
    opts[Math.floor(Math.random() * opts.length)] +
      opts[Math.floor(Math.random() * opts.length)] +
      opts[Math.floor(Math.random() * opts.length)]
  );
  id.push(
    opts[Math.floor(Math.random() * opts.length)] +
      opts[Math.floor(Math.random() * opts.length)] +
      opts[Math.floor(Math.random() * opts.length)]
  );
  return id;
}
