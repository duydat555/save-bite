// Copy comes from the Input Field `error` props in Figma (SB-008). Rules themselves are not specified there.
export const ERROR_GENERIC = 'Kiểm tra lại thông tin đã nhập.';
export const ERROR_WRONG_PASSWORD = 'Mật khẩu chưa đúng, thử lại.';

// ASSUMPTION: minimum password length is not in Figma; 8 matches the 8-dot sample.
export const MIN_PASSWORD_LENGTH = 8;

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
