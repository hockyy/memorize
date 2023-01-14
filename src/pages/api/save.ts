import * as fs from 'fs';
import * as path from 'path';
import randomWords from 'random-words';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    const id = randomWords({
      exactly: 1,
      wordsPerString: 2,
      separator: '-',
    })[0];
    const storedData = {
      id,
      time: data.time,
      timestamp: new Date().toLocaleString('en', {
        timeZone: 'Japan',
        timeZoneName: 'long',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };
    fs.writeFileSync(
      './public/memorize/result.txt',
      `${JSON.stringify(storedData)}\n`,
      {
        flag: 'a+',
      }
    );
    res.status(200).json({ message: 'OK', id });
  } else {
    res.status(200).json({ message: 'NOT ALLOWED METHOD' });
  }
}
