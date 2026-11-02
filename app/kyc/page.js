"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KycPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(savedUser));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleSubmit = () => {
    setMessage("اطلاعات شما با موفقیت ارسال شد و در حال بررسی است.");
    setTimeout(() => setMessage(""), 4000);
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
            <a href="/trade" className="hover:text-blue-600 transition">خرید و فروش</a>
            <a href="/kyc" className="text-blue-600">احراز هویت</a>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">احراز هویت</h1>
            <p className="text-gray-600 text-sm">
              برای افزایش سقف واریز و برداشت، احراز هویت خود را تکمیل کنید.
            </p>
          </div>

          {message && (
            <div className="mb-6 p-4 rounded-xl text-center text-sm bg-green-50 text-green-700 border border-green-200">
              {message}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-center">
            <div className="text-sm text-blue-700 mb-1">سطح فعلی شما</div>
            <div className="font-bold text-blue-800">سطح ۱ – پایه</div>
          </div>

          <div className="mb-8">
            <h2 className="font-bold text-gray-800 mb-4">مرحله ۱: اطلاعات شخصی</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">نام و نام خانوادگی</label>
                <input
                  type="text"
                  placeholder="نام کامل خود را وارد کنید"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">کد ملی</label>
                <input
                  type="text"
                  placeholder="کد ملی ۱۰ رقمی"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">تاریخ تولد</label>
                <input
                  type="text"
                  placeholder="مثلاً ۱۳۷۰/۰۵/۱۲"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-bold text-gray-800 mb-4">مرحله ۲: مدارک شناسایی</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">تصویر روی کارت ملی</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 text-sm cursor-pointer hover:border-blue-400 transition">
                  برای آپلود کلیک کنید یا فایل را اینجا رها کنید
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">تصویر پشت کارت ملی</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center text-gray-500 text-sm cursor-pointer hover:border-blue-400 transition">
                  برای آپلود کلیک کنید یا فایل را اینجا رها کنید
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium transition"
          >
            ارسال برای بررسی
          </button>
        </div>
      </main>
    </div>
  );
}