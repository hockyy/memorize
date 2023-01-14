import * as fs from 'fs';

export default function handler(req, res) {
  if (req.method === 'POST') {
    fs.writeFileSync('./public/memorize/text.txt', req.body.data, {
      flag: 'w',
    });
    res.status(200).json({ message: 'ok' });
  } else {
    const data = fs.readFileSync('./public/memorize/text.txt');
    res.status(200).json({ data });
  }
}
