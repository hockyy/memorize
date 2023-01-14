import * as fs from 'fs';

export default function handler(req, res) {
  const dirs = fs.readdirSync('./public/memorize/images');
  res.status(200).json(dirs);
}
