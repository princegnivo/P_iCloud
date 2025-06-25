export default function PhishShield() {
  return (
    <div className="fixed bottom-5 left-5 bg-black text-white p-3 rounded-lg shadow-xl">
      <div className="flex items-center">
        <ShieldIcon className="mr-2" />
        <span className="text-xs">
          SIMULATION ÉDUCATIVE - {process.env.VITE_APP_CODE}
        </span>
      </div>
    </div>
  );
}
