import formidable from 'formidable';
import fs from 'fs/promises';
import type { NextApiHandler, NextApiRequest } from 'next';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = './public/memorize/images';
    options.filename = (name, ext, filepath) => {
      return `${Date.now().toString()}_${filepath.originalFilename}`;
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler: NextApiHandler = async (req, res) => {
  try {
    await fs.readdir(`./public/memorize/images`);
  } catch (error) {
    await fs.mkdir(`./public/memorize/images`);
  }
  await readFile(req, true);
  res.json({ message: 'ok' });
};

export default handler;
