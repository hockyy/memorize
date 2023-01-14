import * as fs from 'fs';

export default function handler(req, res) {
  if (req.method !== 'POST')
    res.status(200).json({ message: 'method not allowed' });
  const { filename } = req.body;
  try {
    fs.rmSync(`./public/memorize/images/${filename}`);
    res.status(200).json({ message: 'ok' });
  } catch (e) {}
}
