import { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";

type Operator = "mvola" | "orange" | "airtel";

export default function WithdrawalPage() {
  const [selectedOperator, setSelectedOperator] = useState<Operator>("mvola");
  const [cashPoint, setCashPoint] = useState("");
  const [amount, setAmount] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    if (cashPoint && amount) {
      setIsConfirmed(true);
      setTimeout(() => setIsConfirmed(false), 3000);
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
          <h1 className="text-white text-xl font-medium">Withdrawal</h1>
          <p className="text-gray-400 text-sm">Madagascar Mobile Money</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 max-w-md mx-auto">
        {/* Operator Selection */}
        <div className="mb-8">
          <label className="text-gray-300 text-sm mb-3 block">
            Select Operator
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedOperator("mvola")}
              className={`rounded-2xl p-4 border-2 transition-all ${
                selectedOperator === "mvola"
                  ? "border-[#B0FC51] bg-[#B0FC51]/10"
                  : "border-[#2a2a2a] bg-[#202020]"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#E60000] mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">M</span>
              </div>
              <p className="text-white text-xs text-center">MVola</p>
            </button>

            <button
              onClick={() => setSelectedOperator("orange")}
              className={`rounded-2xl p-4 border-2 transition-all ${
                selectedOperator === "orange"
                  ? "border-[#B0FC51] bg-[#B0FC51]/10"
                  : "border-[#2a2a2a] bg-[#202020]"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#FF7900] mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">O</span>
              </div>
              <p className="text-white text-xs text-center">Orange</p>
            </button>

            <button
              onClick={() => setSelectedOperator("airtel")}
              className={`rounded-2xl p-4 border-2 transition-all ${
                selectedOperator === "airtel"
                  ? "border-[#B0FC51] bg-[#B0FC51]/10"
                  : "border-[#2a2a2a] bg-[#202020]"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#ED1C24] mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <p className="text-white text-xs text-center">Airtel</p>
            </button>
          </div>
        </div>

        {/* Cash Point Number */}
        <div className="mb-6">
          <label className="text-gray-300 text-sm mb-3 block">
            Cash Point Number
          </label>
          <input
            type="text"
            value={cashPoint}
            onChange={(e) => setCashPoint(e.target.value)}
            placeholder="Enter cash point number"
            className="w-full bg-[#202020] border border-[#2a2a2a] rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#B0FC51] transition-colors"
          />
        </div>

        {/* Amount */}
        <div className="mb-8">
          <label className="text-gray-300 text-sm mb-3 block">
            Amount (Ar)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-[#202020] border border-[#2a2a2a] rounded-2xl px-5 py-4 text-white text-2xl placeholder-gray-500 focus:outline-none focus:border-[#B0FC51] transition-colors"
          />
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[5000, 10000, 20000, 50000].map((value) => (
            <button
              key={value}
              onClick={() => setAmount(value.toString())}
              className="bg-[#202020] border border-[#2a2a2a] rounded-xl py-3 text-gray-300 text-sm hover:border-[#B0FC51] hover:text-[#B0FC51] transition-colors"
            >
              {value / 1000}K
            </button>
          ))}
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!cashPoint || !amount}
          className="w-full bg-[#B0FC51] text-[#181818] rounded-2xl py-5 font-semibold text-lg hover:bg-[#a0ec41] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isConfirmed ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Confirmed
            </>
          ) : (
            "Confirm Withdrawal"
          )}
        </button>

        {/* Info Note */}
        <div className="mt-6 p-4 bg-[#202020] rounded-2xl border border-[#2a2a2a]">
          <p className="text-gray-400 text-xs text-center">
            Make sure to verify the cash point number before confirming
          </p>
        </div>
      </main>
    </div>
  );
}