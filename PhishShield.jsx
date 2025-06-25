import { useEffect, useState } from 'react';
import { ShieldExclamationIcon } from '@heroicons/react/24/solid';

export default function PhishShield() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(!visible);
    }, 30000); // Clignote toutes les 30s
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <div className={`fixed bottom-4 left-4 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-40'}`}>
      <div className="bg-black text-white px-3 py-2 rounded-lg flex items-center shadow-2xl">
        <ShieldExclamationIcon className="h-5 w-5 mr-2 text-red-500" />
        <span className="text-xs font-mono">SIMULATION EDU - {import.meta.env.VITE_APP_ID}</span>
      </div>
    </div>
  );
}
