import { useState } from "react";
import { ArrowLeft, ArrowDown, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";

type Operator = "mvola" | "orange" | "airtel";

const operators = [
  { id: "mvola" as Operator, name: "MVola", color: "#E60000" },
  { id: "orange" as Operator, name: "Orange Money", color: "#FF7900" },
  { id: "airtel" as Operator, name: "Airtel Money", color: "#ED1C24" },
];

export default function TransferPage() {
  const [sendingOperator, setSendingOperator] = useState<Operator>("mvola");
  const [receivingOperator, setReceivingOperator] = useState<Operator>("orange");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleNumberPad = (digit: string) => {
    if (digit === "⌫") {
      setPhoneNumber(phoneNumber.slice(0, -1));
    } else if (phoneNumber.length < 10) {
      setPhoneNumber(phoneNumber + digit);
    }
  };

  const handleConfirm = () => {
    if (phoneNumber.length === 10 && amount) {
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
          <h1 className="text-white text-xl font-medium">Money Transfer</h1>
          <p className="text-gray-400 text-sm">Between operators</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 max-w-md mx-auto">
        {/* Operator Selection */}
        <div className="mb-8">
          {/* Sending Operator */}
          <div className="mb-4">
            <label className="text-gray-300 text-sm mb-3 block">
              From (Sending Operator)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {operators.map((op) => (
                <button
                  key={`send-${op.id}`}
                  onClick={() => setSendingOperator(op.id)}
                  className={`rounded-2xl p-3 border-2 transition-all ${
                    sendingOperator === op.id
                      ? "border-[#B0FC51] bg-[#B0FC51]/10"
                      : "border-[#2a2a2a] bg-[#202020]"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl mx-auto mb-1 flex items-center justify-center"
                    style={{ backgroundColor: op.color }}
                  >
                    <span className="text-white text-xs font-bold">
                      {op.name[0]}
                    </span>
                  </div>
                  <p className="text-white text-xs text-center truncate">
                    {op.name.split(" ")[0]}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Arrow Indicator */}
          <div className="flex justify-center my-4">
            <div className="w-10 h-10 rounded-full bg-[#202020] flex items-center justify-center border border-[#2a2a2a]">
              <ArrowDown className="w-5 h-5 text-[#B0FC51]" />
            </div>
          </div>

          {/* Receiving Operator */}
          <div>
            <label className="text-gray-300 text-sm mb-3 block">
              To (Receiving Operator)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {operators.map((op) => (
                <button
                  key={`receive-${op.id}`}
                  onClick={() => setReceivingOperator(op.id)}
                  className={`rounded-2xl p-3 border-2 transition-all ${
                    receivingOperator === op.id
                      ? "border-[#B0FC51] bg-[#B0FC51]/10"
                      : "border-[#2a2a2a] bg-[#202020]"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl mx-auto mb-1 flex items-center justify-center"
                    style={{ backgroundColor: op.color }}
                  >
                    <span className="text-white text-xs font-bold">
                      {op.name[0]}
                    </span>
                  </div>
                  <p className="text-white text-xs text-center truncate">
                    {op.name.split(" ")[0]}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Phone Number Display */}
        <div className="mb-6">
          <label className="text-gray-300 text-sm mb-3 block">
            Recipient Phone Number
          </label>
          <div className="bg-[#202020] border border-[#2a2a2a] rounded-2xl px-5 py-5 text-center">
            <p className="text-white text-2xl tracking-widest font-mono">
              {phoneNumber || "_ _ _ _ _ _ _ _ _ _"}
            </p>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-6">
          <label className="text-gray-300 text-sm mb-3 block">Amount (Ar)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-[#202020] border border-[#2a2a2a] rounded-2xl px-5 py-4 text-white text-xl placeholder-gray-500 focus:outline-none focus:border-[#B0FC51] transition-colors"
          />
        </div>

        {/* Numeric Keypad */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-3">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"].map(
              (digit, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNumberPad(digit)}
                  className={`rounded-2xl py-4 font-semibold text-xl transition-all ${
                    digit === "⌫"
                      ? "bg-[#2a2a2a] text-[#B0FC51] col-span-2"
                      : "bg-[#202020] text-white hover:bg-[#252525]"
                  } border border-[#2a2a2a] active:scale-95`}
                >
                  {digit}
                </button>
              )
            )}
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={phoneNumber.length !== 10 || !amount}
          className="w-full bg-[#B0FC51] text-[#181818] rounded-2xl py-5 font-semibold text-lg hover:bg-[#a0ec41] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isConfirmed ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Transfer Initiated
            </>
          ) : (
            "Confirm Transfer"
          )}
        </button>
      </main>
    </div>
  );
}