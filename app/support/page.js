"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SupportPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title || !content) {
      setMessage("لطفاً عنوان و متن پیام را وارد کنید");
      return;
    }

    setMessage("تیکت شما با موفقیت ارسال شد. به زودی پاسخ داده می‌شود.");
    setTitle("");
    setContent("");
    
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
            <a href="/kyc" className="hover:text-blue-600 transition">احراز هویت</a>
            <a href="/support" className="text-blue-600">پشتیبانی</a>
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
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">پشتیبانی</h1>
            <p className="text-gray-600 text-sm">
              سوال یا مشکلی دارید؟ از طریق فرم زیر برای ما پیام بفرستید.
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-center text-sm ${
              message.includes("موفقیت") 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-2">موضوع</label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>مشکل در واریز یا برداشت</option>
                <option>مشکل در خرید و فروش</option>
                <option>احراز هویت</option>
                <option>پیشنهاد یا انتقاد</option>
                <option>سایر موارد</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">عنوان پیام</label>
              <input
                type="text"
                placeholder="موضوع پیام خود را بنویسید"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">متن پیام</label>
              <textarea
                rows="5"
                placeholder="توضیحات خود را اینجا بنویسید..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-medium transition"
            >
              ارسال تیکت
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">پیام‌های قبلی شما</h2>
          </div>
          <div className="p-6 text-center text-gray-500 text-sm">
            هنوز پیامی ارسال نکرده‌اید.
          </div>
        </div>
      </main>
    </div>
  );
}