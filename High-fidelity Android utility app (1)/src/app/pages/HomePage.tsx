import { Link } from "react-router";
import { Wallet, ArrowRightLeft, CreditCard } from "lucide-react";

export default function HomePage() {
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
      <header className="px-6 py-6">
        <h1 className="text-[#B0FC51] text-3xl font-semibold tracking-tight">
          Money Tools
        </h1>
        <p className="text-gray-400 mt-1">Quick access to your services</p>
      </header>

      {/* Main Navigation Cards */}
      <main className="flex-1 px-6 pb-8">
        <div className="grid gap-6">
          {/* Withdrawal Card */}
          <Link to="/withdrawal">
            <div className="bg-[#202020] rounded-3xl p-8 hover:bg-[#252525] transition-all duration-300 border border-[#2a2a2a] active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#B0FC51]/10 flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-[#B0FC51]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-white text-xl font-medium">Withdrawal</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Mobile money withdrawal
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Transfer Card */}
          <Link to="/transfer">
            <div className="bg-[#202020] rounded-3xl p-8 hover:bg-[#252525] transition-all duration-300 border border-[#2a2a2a] active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#B0FC51]/10 flex items-center justify-center">
                  <ArrowRightLeft className="w-8 h-8 text-[#B0FC51]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-white text-xl font-medium">Transfer</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Money transfer between operators
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Recharge Card */}
          <Link to="/recharge">
            <div className="bg-[#202020] rounded-3xl p-8 hover:bg-[#252525] transition-all duration-300 border border-[#2a2a2a] active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#B0FC51]/10 flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-[#B0FC51]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-white text-xl font-medium">Recharge</h2>
                  <p className="text-gray-400 text-sm mt-1">
                    Scan and top-up credit
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="px-6 py-6 text-center">
        <p className="text-gray-500 text-xs">
          Offline utility • No account required
        </p>
      </footer>
    </div>
  );
}