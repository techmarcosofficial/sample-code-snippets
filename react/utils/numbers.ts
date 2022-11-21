function convertNumber(num: number): any {
  if (num < 1e3) return { sum: num, num, ext: '' };
  if (num >= 1e3 && num < 1e6) return { sum: num, num: +(num / 1e3).toFixed(2), ext: 'K' };
  if (num >= 1e6 && num < 1e9) return { sum: num, num: +(num / 1e6).toFixed(2), ext: 'M' };
  if (num >= 1e9 && num < 1e12) return { sum: num, num: +(num / 1e9).toFixed(2), ext: 'B' };
  if (num >= 1e12) return { sum: num, num: +(num / 1e12).toFixed(2), ext: 'T' };
}

function parseNumberExtension(ext: string): any {
  let value = '';
  switch (ext) {
    case 'K':
      value = 'THOUSANDS';
      break;
    case 'M':
      value = 'MILLIONS';
      break;
    case 'B':
      value = 'BILLIONS';
      break;
    case 'T':
      value = 'TRILLIONS';
      break;
  }
  return value;
}

export { convertNumber, parseNumberExtension };