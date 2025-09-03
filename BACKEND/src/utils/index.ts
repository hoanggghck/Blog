import * as path from 'path';

export function slugifyFilename(filename: string): string {
  if (!filename) return 'file';
  const ext = path.extname(filename);
  const name = path.basename(filename, ext);

  // Chuẩn hóa, xóa dấu tiếng Việt và ký tự đặc biệt
  const safeName = name
    .normalize('NFD')                   // tách dấu
    .replace(/[\u0300-\u036f]/g, '')    // xóa dấu
    .replace(/[^a-zA-Z0-9-_]/g, '-')    // thay ký tự lạ bằng "-"
    .toLowerCase();

  return `${safeName}${ext}`;
}