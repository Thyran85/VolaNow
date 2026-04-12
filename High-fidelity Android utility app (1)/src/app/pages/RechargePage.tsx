import { useState, useEffect } from "react";
import { ArrowLeft, Scan, Phone, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";

export default function RechargePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "ready">("idle");

  useEffect(() => {
    if (isScanning) {
      // Simulate scanning process
      setScanStatus("scanning");
      const timer = setTimeout(() => {
        // Simulate successful scan
        const mockCode = Math.random().toString().slice(2, 16);
        setScannedCode(mockCode);
        setScanStatus("ready");
        setIsScanning(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isScanning]);

  const handleStartScan = () => {
    setIsScanning(true);
    setScanStatus("scanning");
    setScannedCode("");
  };

  const handleCall = () => {
    if (scannedCode) {
      // Simulate calling the recharge code
      alert(`Dialing recharge code: *${scannedCode}#`);
    }
  };

  return (
    <div className="h-full bg-[#181818] flex flex-col overflow-y-auto">
      {/* Status Bar */}
      <div className="px-6 pt-3 pb-2 flex items-center justify-between">
        <span className="text-white text-sm">9:41</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-3 border border-white/60 rounded-sm relative">
            <div className="absolute inset-0.5 bg-white rounded-[1px]" />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="px-6 py-6 flex items-center gap-4 border-b border-[#2a2a2a]">
        <Link to="/">
          <button className="w-10 h-10 rounded-full bg-[#202020] flex items-center justify-center hover:bg-[#252525] transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </Link>
        <div>
          <h1 className="text-white text-xl font-medium">Card Top-up</h1>
          <p className="text-gray-400 text-sm">OCR Scratch Card Scanner</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 max-w-md mx-auto">
        {/* Scanner View */}
        <div className="mb-8">
          <div
            className={`relative aspect-[4/3] rounded-3xl overflow-hidden border-2 transition-all ${
              isScanning
                ? "border-[#B0FC51] bg-[#0a0a0a]"
                : "border-[#2a2a2a] bg-[#202020]"
            }`}
          >
            {/* Camera View Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              {!isScanning && scanStatus === "idle" && (
                <div className="text-center">
                  <Scan className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">
                    Position card in frame
                  </p>
                </div>
              )}

              {/* Scanning Animation */}
              {isScanning && (
                <div className="absolute inset-0">
                  {/* Scanning Lines */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#B0FC51] to-transparent animate-pulse" />
                  </div>
                  {/* Corner Markers */}
                  <div className="absolute top-4 left-4 w-12 h-12 border-l-4 border-t-4 border-[#B0FC51] rounded-tl-2xl" />
                  <div className="absolute top-4 right-4 w-12 h-12 border-r-4 border-t-4 border-[#B0FC51] rounded-tr-2xl" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 border-l-4 border-b-4 border-[#B0FC51] rounded-bl-2xl" />
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-r-4 border-b-4 border-[#B0FC51] rounded-br-2xl" />
                  
                  {/* Laser Scan Overlay */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                    <div className="h-0.5 bg-[#B0FC51] shadow-[0_0_20px_#B0FC51] animate-pulse" />
                    <div className="h-20 bg-gradient-to-b from-[#B0FC51]/20 via-transparent to-transparent" />
                  </div>
                </div>
              )}

              {/* Success State */}
              {scanStatus === "ready" && !isScanning && (
                <div className="text-center">
                  <CheckCircle2 className="w-20 h-20 text-[#B0FC51] mx-auto mb-4" />
                  <p className="text-[#B0FC51] text-sm font-medium">
                    Code Detected
                  </p>
                </div>
              )}
            </div>

            {/* Scan Status Indicator */}
            {isScanning && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="bg-[#B0FC51] text-[#181818] px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#181818] animate-pulse" />
                  Scanning...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scanned Code Display */}
        {scannedCode && (
          <div className="mb-6 p-5 bg-[#202020] rounded-2xl border border-[#2a2a2a]">
            <label className="text-gray-400 text-xs mb-2 block">
              Detected Code
            </label>
            <p className="text-[#B0FC51] text-xl font-mono tracking-wider">
              {scannedCode}
            </p>
          </div>
        )}

        {/* Status Indicator */}
        <div className="mb-6 flex items-center justify-center gap-2 p-4 bg-[#202020] rounded-2xl border border-[#2a2a2a]">
          <div
            className={`w-3 h-3 rounded-full ${
              scanStatus === "ready"
                ? "bg-[#B0FC51]"
                : scanStatus === "scanning"
                ? "bg-yellow-500"
                : "bg-gray-600"
            }`}
          />
          <p className="text-white text-sm">
            {scanStatus === "ready"
              ? "Ready to Call"
              : scanStatus === "scanning"
              ? "Scanning in progress..."
              : "Awaiting scan"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {scanStatus !== "ready" && (
            <button
              onClick={handleStartScan}
              disabled={isScanning}
              className="w-full bg-[#B0FC51] text-[#181818] rounded-2xl py-5 font-semibold text-lg hover:bg-[#a0ec41] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Scan className="w-5 h-5" />
              {isScanning ? "Scanning..." : "Start Scan"}
            </button>
          )}

          {scanStatus === "ready" && (
            <>
              <button
                onClick={handleCall}
                className="w-full bg-[#B0FC51] text-[#181818] rounded-2xl py-5 font-semibold text-lg hover:bg-[#a0ec41] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call to Recharge
              </button>

              <button
                onClick={handleStartScan}
                className="w-full bg-[#202020] text-white border border-[#2a2a2a] rounded-2xl py-4 font-medium hover:bg-[#252525] transition-all active:scale-[0.98]"
              >
                Scan Another Card
              </button>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 space-y-3">
          <div className="flex items-start gap-3 text-gray-400 text-sm">
            <div className="w-6 h-6 rounded-full bg-[#202020] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[#B0FC51] text-xs">1</span>
            </div>
            <p>Position the scratch card within the frame</p>
          </div>
          <div className="flex items-start gap-3 text-gray-400 text-sm">
            <div className="w-6 h-6 rounded-full bg-[#202020] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[#B0FC51] text-xs">2</span>
            </div>
            <p>Wait for the scanner to detect the code</p>
          </div>
          <div className="flex items-start gap-3 text-gray-400 text-sm">
            <div className="w-6 h-6 rounded-full bg-[#202020] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[#B0FC51] text-xs">3</span>
            </div>
            <p>Tap "Call to Recharge" to complete the top-up</p>
          </div>
        </div>
      </main>
    </div>
  );
}