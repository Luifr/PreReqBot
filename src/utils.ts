import accents from 'remove-accents';
import path from 'path';
import fs from 'fs';

export const cleanString = (str: string) => {
  return accents.remove(str).toLowerCase().replace(/\s\s+/g, ' ').trim();
}

export const normaliseString = (str: string) => {
  return accents.remove(str).toLowerCase().replace(/\s\s+/g, ' ').replace(/\-|\:|\,|\\|\//g, '').trim();
}


export const writeFileSyncRecursive = (filename: string, content: string, charset?: any) => {
  const paths = filename.split('/');
  paths.slice(0, paths.length-1).forEach((dir, index, splits) => {
    if (dir === '.') {
      return;
    }
    const curParent = splits.slice(0, index).join('/');
    const dirPath = path.resolve(curParent, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  });

  fs.writeFileSync(filename, content, charset);
}