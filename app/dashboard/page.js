"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [balances, setBalances] = useState({ toman: 0, usdt: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
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
    }

    // بارگذاری تراکنش‌ها
    const savedTx = localStorage.getItem(`transactions_${parsedUser.phone}`);
    if (savedTx) {
      setTransactions(JSON.parse(savedTx));
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-gray-600">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800" dir="rtl">
      {/* هدر */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-700">بیتمان</div>
          
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <a href="/dashboard" className="text-blue-600">داشبورد</a>
            <a href="/trade" className="hover:text-blue-600 transition">خرید و فروش</a>
            <a href="/wallet" className="hover:text-blue-600 transition">کیف پول</a>
            <a href="/kyc" className="hover:text-blue-600 transition">احراز هویت</a>
            <a href="/support" className="hover:text-blue-600 transition">پشتیبانی</a>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.phone}</span>
            <button 
              onClick={handleLogout}
              className="text-sm text-red-500 hover:underline"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* خوش‌آمدگویی */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            سلام، خوش آمدید
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            شماره موبایل: {user?.phone}
          </p>
        </div>

        {/* موجودی‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-sm text-gray-500 mb-1">موجودی تومان</div>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              {balances.toman.toLocaleString()} تومان
            </div>
            <div className="flex gap-3">
              <a href="/wallet" className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm hover:bg-blue-700 transition text-center">
                واریز
              </a>
              <a href="/wallet" className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition text-center">
                برداشت
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-sm text-gray-500 mb-1">موجودی تتر</div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {balances.usdt.toFixed(2)} USDT
            </div>
            <div className="text-sm text-gray-500 mb-4">
              ≈ {(balances.usdt * rate).toLocaleString()} تومان
            </div>
            <div className="flex gap-3">
              <a href="/trade" className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm hover:bg-blue-700 transition text-center">
                خرید
              </a>
              <a href="/trade" className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition text-center">
                فروش
              </a>
            </div>
          </div>
        </div>

        {/* دسترسی سریع */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <a href="/trade" className="bg-white border border-gray-100 rounded-xl py-4 text-sm font-medium text-center hover:shadow-md transition">
            خرید تتر
          </a>
          <a href="/trade" className="bg-white border border-gray-100 rounded-xl py-4 text-sm font-medium text-center hover:shadow-md transition">
            فروش تتر
          </a>
          <a href="/wallet" className="bg-white border border-gray-100 rounded-xl py-4 text-sm font-medium text-center hover:shadow-md transition">
            واریز تومان
          </a>
          <a href="/wallet" className="bg-white border border-gray-100 rounded-xl py-4 text-sm font-medium text-center hover:shadow-md transition">
            برداشت تومان
          </a>
        </div>

        {/* آخرین تراکنش‌ها */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">آخرین تراکنش‌ها</h2>
          </div>
          
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              هنوز تراکنشی انجام نداده‌اید.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-right py-3 px-6 font-medium">تاریخ</th>
                    <th className="text-right py-3 px-6 font-medium">نوع</th>
                    <th className="text-right py-3 px-6 font-medium">مقدار</th>
                    <th className="text-right py-3 px-6 font-medium">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.slice(0, 10).map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-3 px-6">{tx.date}</td>
                      <td className="py-3 px-6">{tx.type}</td>
                      <td className="py-3 px-6">{tx.amount}</td>
                      <td className="py-3 px-6">
                        <span className="text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}