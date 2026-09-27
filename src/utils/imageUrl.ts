/**
 * Helper function untuk resolve path gambar dengan BASE_URL Vite.
 * Berguna untuk deploy ke subfolder (misalnya GitHub Pages).
 * 
 * @param path - Path gambar relatif dari folder public (contoh: 'images/logo.png')
 * @returns URL lengkap dengan BASE_URL
 */
export const getImageUrl = (path: string): string => {
  return `${import.meta.env.BASE_URL}${path}`;
};