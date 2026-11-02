"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!phone || !password) {
      setMessage("لطفاً همه فیلدها را پر کنید");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "خطایی رخ داد");
      } else {
        // ذخیره اطلاعات کاربر در مرورگر
        localStorage.setItem("user", JSON.stringify(data.user));
        
        setMessage("ورود با موفقیت انجام شد! در حال انتقال...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error) {
      setMessage("خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold text-blue-700 mb-2 inline-block">بیتمان</a>
          <h1 className="text-xl font-bold text-gray-800 mt-2">ورود به حساب کاربری</h1>
        </div>

        {message && (
          <div className={`mb-5 p-3 rounded-xl text-center text-sm ${
            message.includes("موفقیت") 
              ? "bg-green-50 text-green-700" 
              : "bg-red-50 text-red-700"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-2">شماره موبایل</label>
            <input
              type="tel"
              placeholder="09123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">رمز عبور</label>
            <input
              type="password"
              placeholder="رمز عبور خود را وارد کنید"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium transition disabled:opacity-50"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          حساب کاربری ندارید؟{" "}
          <a href="/register" className="text-blue-600 font-medium hover:underline">
            ثبت‌نام کنید
          </a>
        </div>

        <div className="mt-4 text-center">
          <a href="/" className="text-sm text-gray-500 hover:text-blue-600 transition">
            ← بازگشت به صفحه اصلی
          </a>
        </div>
      </div>
    </div>
  );
}