"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TradePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("buy");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [balances, setBalances] = useState({ toman: 0, usdt: 0 });
  const rate = 172000;

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    // بارگذاری موجودی
    const savedBalances = localStorage.getItem(`balances_${parsedUser.phone}`);
    if (savedBalances) {
      setBalances(JSON.parse(savedBalances));
    } else {
      // موجودی اولیه برای کاربر جدید
      const initial = { toman: 50000000, usdt: 0 }; // ۵۰ میلیون تومان هدیه اولیه
      localStorage.setItem(`balances_${parsedUser.phone}`, JSON.stringify(initial));
      setBalances(initial);
    }
  }, [router]);

  const result = amount
    ? mode === "buy"
      ? (Number(amount) / rate).toFixed(2)
      : (Number(amount) * rate).toLocaleString()
    : "۰";

  const handleSubmit = () => {
    if (!amount || Number(amount) <= 0) {
      setMessage("لطفاً مبلغ معتبری وارد کنید");
      return;
    }

    const numAmount = Number(amount);
    let newBalances = { ...balances };
    let transaction = {};

    if (mode === "buy") {
      // خرید تتر
      if (numAmount > balances.toman) {
        setMessage("موجودی تومان شما کافی نیست");
        return;
      }
      const usdtReceived = numAmount / rate;
      newBalances.toman -= numAmount;
      newBalances.usdt += usdtReceived;

      transaction = {
        id: Date.now(),
        type: "خرید تتر",
        amount: `${usdtReceived.toFixed(2)} USDT`,
        status: "موفق",
        date: new Date().toLocaleString("fa-IR"),
      };
    } else {
      // فروش تتر
      if (numAmount > balances.usdt) {
        setMessage("موجودی تتر شما کافی نیست");
        return;
      }
      const tomanReceived = numAmount * rate;
      newBalances.usdt -= numAmount;
      newBalances.toman += tomanReceived;

      transaction = {
        id: Date.now(),
        type: "فروش تتر",
        amount: `${numAmount} USDT`,
        status: "موفق",
        date: new Date().toLocaleString("fa-IR"),
      };
    }

    // ذخیره موجودی جدید
    localStorage.setItem(`balances_${user.phone}`, JSON.stringify(newBalances));
    setBalances(newBalances);

    // ذخیره تراکنش
    const savedTx = localStorage.getItem(`transactions_${user.phone}`);
    const transactions = savedTx ? JSON.parse(savedTx) : [];
    transactions.unshift(transaction);
    localStorage.setItem(`transactions_${user.phone}`, JSON.stringify(transactions));

    setMessage(
      mode === "buy"
        ? `خرید ${ (numAmount / rate).toFixed(2) } تتر با موفقیت انجام شد`
        : `فروش ${numAmount} تتر با موفقیت انجام شد`
    );

    setTimeout(() => {
      setMessage("");
      setAmount("");
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-gray-600">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800" dir="rtl">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-700">بیتمان</div>
          
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="/dashboard" className="hover:text-blue-600 transition">داشبورد</a>
            <a href="/trade" className="text-blue-600">خرید و فروش</a>
            <a href="/kyc" className="hover:text-blue-600 transition">احراز هویت</a>
            <a href="/support" className="hover:text-blue-600 transition">پشتیبانی</a>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.phone}</span>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-12">
        {/* موجودی فعلی */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 flex justify-between text-sm">
          <div>
            <div className="text-gray-500">موجودی تومان</div>
            <div className="font-bold text-lg">{balances.toman.toLocaleString()} تومان</div>
          </div>
          <div className="text-left">
            <div className="text-gray-500">موجودی تتر</div>
            <div className="font-bold text-lg">{balances.usdt.toFixed(2)} USDT</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-center text-sm font-medium ${
              message.includes("موفقیت") || message.includes("انجام شد")
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          <div className="flex gap-2 mb-8">
            <button
              onClick={() => { setMode("buy"); setAmount(""); setMessage(""); }}
              className={`flex-1 py-3 rounded-xl font-medium transition ${
                mode === "buy"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              خرید
            </button>
            <button
              onClick={() => { setMode("sell"); setAmount(""); setMessage(""); }}
              className={`flex-1 py-3 rounded-xl font-medium transition ${
                mode === "sell"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              فروش
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-2">ارز</label>
              <select className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>تتر (USDT)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {mode === "buy" ? "مبلغ پرداختی (تومان)" : "مقدار فروش (USDT)"}
              </label>
              <input
                type="number"
                placeholder={mode === "buy" ? "مثلاً ۱۰٬۰۰۰٬۰۰۰" : "مثلاً ۱۰۰"}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {mode === "buy" ? "مقدار دریافتی" : "مبلغ دریافتی (تومان)"}
              </label>
              <input
                type="text"
                value={mode === "buy" ? `≈ ${result} USDT` : `≈ ${result} تومان`}
                disabled
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3.5 text-gray-700"
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>نرخ فعلی:</span>
                <span>{rate.toLocaleString()} تومان</span>
              </div>
              <div className="flex justify-between">
                <span>کارمزد:</span>
                <span>۰.۳٪</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium text-lg transition"
            >
              {mode === "buy" ? "تأیید و خرید" : "تأیید و فروش"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}