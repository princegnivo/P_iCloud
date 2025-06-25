export default function usePhishBait() {
  const sendCredentials = async (data) => {
    try {
      const res = await fetch('http://localhost:3333/auth', {
        method: 'POST',
        headers: { 'X-EDU-TOKEN': process.env.VITE_APP_SECRET },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (err) {
      console.error("Erreur éducative:", err);
    }
  };
  return { sendCredentials };
}
