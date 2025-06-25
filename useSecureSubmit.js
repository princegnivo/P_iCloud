import CryptoJS from 'crypto-js';
export default function useSecureSubmit() {
  const encryptData = (data, secret) => {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      secret + process.env.VITE_HASH_SALT
    ).toString();
  };

  const handleSubmit = async (formData) => {
    const encrypted = encryptData(formData, import.meta.env.VITE_APP_SECRET);
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'X-Encrypted-Data': 'true',
        'Content-Type': 'text/plain'
      },
      body: encrypted
    });
    return res.ok;
  };

  return { handleSubmit };
}
