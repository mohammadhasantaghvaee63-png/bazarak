"use client";

import { useEffect, useState } from "react";

type Supplier = {
  id: number;
  name: string;
  city: string;
  category: string;
  type: string;
  phone: string;
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3002/suppliers")
      .then((res) => res.json())
      .then((data) => {
        setSuppliers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Suppliers error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700">
            مدیریت تأمین‌کنندگان
          </h1>
          <p className="mt-2 text-slate-600">
            کارخانه‌ها و عمده‌فروشان بازارک
          </p>
        </header>

        {loading ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            در حال دریافت اطلاعات...
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-bold">{supplier.name}</h2>

                <div className="mt-4 space-y-2 text-slate-600">
                  <p>📍 شهر: {supplier.city}</p>
                  <p>🏭 دسته: {supplier.category}</p>
                  <p>👤 نوع: {supplier.type}</p>
                  <p>📞 تلفن: {supplier.phone}</p>
                </div>

                <button className="mt-5 w-full rounded-xl bg-blue-700 px-4 py-3 font-bold text-white">
                  مشاهده محصولات
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
