"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalSuppliers: number;
  totalProducts: number;
};

type Report = {
  totalOrders: number;
  totalSales: number;
  totalCommission: number;
  averageOrderValue: number;
};

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    totalSuppliers: 0,
    totalProducts: 0,
  });

  const [report, setReport] = useState<Report>({
    totalOrders: 0,
    totalSales: 0,
    totalCommission: 0,
    averageOrderValue: 0,
  });

  useEffect(() => {
    fetch("http://localhost:4000/suppliers/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Stats error:", err));

    fetch("http://localhost:4000/orders/report/financial")
      .then((res) => res.json())
      .then((data) => setReport(data))
      .catch((err) => console.error("Report error:", err));
  }, []);

  const money = (value: number) =>
    new Intl.NumberFormat("fa-IR").format(value);

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700">
            بازارک
          </h1>
          <p className="mt-2 text-slate-600">
            پنل مدیریت بازار عمده‌فروشان و کارخانه‌های مواد غذایی
          </p>
        </header>

        <nav className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a href="/" className="rounded-2xl bg-blue-700 p-5 text-center font-bold text-white shadow-sm">🏠 داشبورد</a>
          <a href="/suppliers" className="rounded-2xl bg-white p-5 text-center font-bold text-slate-800 shadow-sm">🏭 مدیریت تأمین‌کنندگان</a>
          <a href="/products" className="rounded-2xl bg-white p-5 text-center font-bold text-slate-800 shadow-sm">📦 مدیریت محصولات</a>
          <a href="/orders" className="rounded-2xl bg-white p-5 text-center font-bold text-slate-800 shadow-sm">🛒 مدیریت سفارش‌ها</a>
          <a href="/shop" className="rounded-2xl bg-green-600 p-5 text-center font-bold text-white shadow-sm">🛒 فروشگاه و ثبت سفارش</a>
          <a href="/financial-report" className="rounded-2xl bg-white p-5 text-center font-bold text-slate-800 shadow-sm">📊 گزارش مالی</a>
        </nav>
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">تعداد تأمین‌کنندگان</p>
            <p className="mt-3 text-3xl font-bold">
              {money(stats.totalSuppliers)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">تعداد محصولات</p>
            <p className="mt-3 text-3xl font-bold">
              {money(stats.totalProducts)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">سفارش‌های تکمیل‌شده</p>
            <p className="mt-3 text-3xl font-bold">
              {money(report.totalOrders)}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">پورسانت بازارک</p>
            <p className="mt-3 text-2xl font-bold text-green-600">
              {money(report.totalCommission)} تومان
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">گزارش فروش</h2>

            <div className="mt-5 space-y-4">
              <div className="flex justify-between border-b pb-3">
                <span>مجموع فروش</span>
                <strong>{money(report.totalSales)} تومان</strong>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span>میانگین ارزش سفارش</span>
                <strong>
                  {money(Math.round(report.averageOrderValue))} تومان
                </strong>
              </div>

              <div className="flex justify-between">
                <span>پورسانت بازارک</span>
                <strong className="text-green-600">
                  {money(report.totalCommission)} تومان
                </strong>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-blue-700 p-6 text-white shadow-sm">
            <h2 className="text-xl font-bold">بازارک تهران</h2>

            <p className="mt-4 leading-8 text-blue-100">
              شبکه ارتباطی کارخانه‌های تولید مواد غذایی و عمده‌فروشان.
              هدف بازارک، ایجاد ارتباط مستقیم و ثبت معاملات موفق است.
            </p>

            <button className="mt-6 rounded-xl bg-white px-5 py-3 font-bold text-blue-700">
              مدیریت بازارک
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">وضعیت سیستم</h2>

          <div className="mt-4 flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
            <span>اتصال به API بازارک فعال است</span>
          </div>
        </section>
      </div>
    </main>
  );
}
