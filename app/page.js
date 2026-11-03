"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [toman, setToman] = useState("");
  const [rates, setRates] = useState({ usdt: 0, btc: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("/api/rate");
        const data = await res.json();
        setRates(data);
      } catch (error) {
        console.log("خطا در دریافت نرخ");
        setRates({ usdt: 172000, btc: 0 });
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, []);

  const usdtAmount = toman && rates.usdt ? (Number(toman) / rates.usdt).toFixed(2) : "۰";

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800" dir="rtl">
      <header className="bg-blue-700 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">بیتمان</div>
          
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="/" className="hover:text-blue-200 transition">خانه</a>
            <a href="/trade" className="hover:text-blue-200 transition">خرید و فروش</a>
            <a href="/support" className="hover:text-blue-200 transition">پشتیبانی</a>
          </nav>

          <div className="flex gap-3">
            <a href="/login" className="px-4 py-2 border border-white rounded-lg text-sm hover:bg-white hover:text-blue-700 transition">
              ورود
            </a>
            <a href="/register" className="px-4 py-2 bg-white text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition">
              ثبت‌نام
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            خرید و فروش تتر و ارزهای دیجیتال
          </h1>
          <p className="text-gray-600 text-lg">
            سریع، ساده و امن با بیتمان
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto mb-16 border-t-4 border-blue-600">
          <h2 className="text-xl font-bold mb-2 text-center text-blue-700">ماشین‌حساب تبدیل</h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            {loading ? "در حال دریافت نرخ..." : `نرخ فعلی تتر: ${rates.usdt.toLocaleString()} تومان`}
          </p>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">مبلغ (تومان)</label>
              <input
                type="number"
                placeholder="مثلاً ۱۰٬۰۰۰٬۰۰۰"
                value={toman}
                onChange={(e) => setToman(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-left"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">مقدار تقریبی تتر</label>
              <input
                type="text"
                value={`≈ ${usdtAmount} USDT`}
                disabled
                className="w-full border-2 border-gray-100 bg-blue-50 rounded-xl px-4 py-3 text-blue-800 font-medium"
              />
            </div>

            <a
              href="/trade"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium text-center text-lg transition"
            >
              ادامه خرید
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-16">
          <div className="bg-blue-700 text-white px-6 py-4">
            <h2 className="text-xl font-bold">قیمت‌های لحظه‌ای</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-right py-4 px-6 font-medium">ارز</th>
                  <th className="text-right py-4 px-6 font-medium">قیمت (تومان)</th>
                  <th className="text-right py-4 px-6 font-medium">تغییرات</th>
                  <th className="text-center py-4 px-6 font-medium">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-blue-50 transition">
                  <td className="py-4 px-6 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">T</div>
                      <div>
                        <div>تتر</div>
                        <div className="text-xs text-gray-500">USDT</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold">
                    {loading ? "..." : rates.usdt.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-green-600 bg-green-100 px-2.5 py-1 rounded-full text-xs font-medium">زنده</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center gap-2">
                      <a href="/trade" className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">خرید</a>
                      <a href="/trade" className="px-4 py-1.5 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50">فروش</a>
                    </div>
                  </td>
                </tr>

                <tr className="hover:bg-blue-50 transition">
                  <td className="py-4 px-6 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">₿</div>
                      <div>
                        <div>بیت‌کوین</div>
                        <div className="text-xs text-gray-500">BTC</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold">
                    {loading ? "..." : rates.btc ? rates.btc.toLocaleString() : "---"}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-green-600 bg-green-100 px-2.5 py-1 rounded-full text-xs font-medium">زنده</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center gap-2">
                      <a href="/trade" className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">خرید</a>
                      <a href="/trade" className="px-4 py-1.5 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50">فروش</a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-2xl shadow-md text-center border-t-4 border-blue-500">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2">واریز و برداشت سریع</h3>
            <p className="text-gray-600 text-sm">تراکنش‌های شما در کوتاه‌ترین زمان انجام می‌شود.</p>
          </div>

          <div className="bg-white p-7 rounded-2xl shadow-md text-center border-t-4 border-green-500">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="font-bold text-lg mb-2">امنیت بالا</h3>
            <p className="text-gray-600 text-sm">از دارایی شما با بالاترین استانداردها محافظت می‌کنیم.</p>
          </div>

          <div className="bg-white p-7 rounded-2xl shadow-md text-center border-t-4 border-purple-500">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-bold text-lg mb-2">پشتیبانی ۲۴ ساعته</h3>
            <p className="text-gray-600 text-sm">تیم پشتیبانی همیشه پاسخگوی شماست.</p>
          </div>
        </div>
      </main>

      <footer className="bg-blue-700 text-white mt-12 py-8 text-center text-sm">
        © ۱۴۰۴ بیتمان – همه حقوق محفوظ است
      </footer>
    </div>
  );
}