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
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    city: "تهران",
    category: "مواد غذایی",
    type: "factory",
    phone: "",
  });

  const loadSuppliers = async () => {
    try {
      const res = await fetch("http://localhost:3002/suppliers");
      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Suppliers error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const addSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("http://localhost:3002/suppliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("ثبت تأمین‌کننده ناموفق بود");
      }

      setForm({
        name: "",
        city: "تهران",
        category: "مواد غذایی",
        type: "factory",
        phone: "",
      });

      setShowForm(false);
      await loadSuppliers();
    } catch (error) {
      console.error("Add supplier error:", error);
      alert("ثبت تأمین‌کننده انجام نشد");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">
              مدیریت تأمین‌کنندگان
            </h1>
            <p className="mt-2 text-slate-600">
              کارخانه‌ها و عمده‌فروشان بازارک
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white"
          >
            {showForm ? "بستن فرم" : "＋ افزودن تأمین‌کننده"}
          </button>
        </header>

        {showForm && (
          <form
            onSubmit={addSupplier}
            className="mb-8 rounded-2xl bg-white p-6 shadow-sm"
          >
            <h2 className="mb-5 text-xl font-bold">
              افزودن تأمین‌کننده جدید
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                required
                placeholder="نام کارخانه یا عمده‌فروش"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="rounded-xl border p-3"
              />

              <input
                required
                placeholder="شهر"
                value={form.city}
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
                className="rounded-xl border p-3"
              />

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="rounded-xl border p-3"
              >
                <option value="مواد غذایی">مواد غذایی</option>
                <option value="خشکبار">خشکبار</option>
                <option value="نوشیدنی">نوشیدنی</option>
                <option value="سایر">سایر</option>
              </select>

              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
                className="rounded-xl border p-3"
              >
                <option value="factory">کارخانه / تولیدکننده</option>
                <option value="wholesaler">عمده‌فروش</option>
              </select>

              <input
                required
                placeholder="شماره تلفن"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className="rounded-xl border p-3"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-5 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white"
            >
              {saving ? "در حال ثبت..." : "ثبت تأمین‌کننده"}
            </button>
          </form>
        )}

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
                  <p>
                    👤 نوع:{" "}
                    {supplier.type === "factory"
                      ? "کارخانه / تولیدکننده"
                      : "عمده‌فروش"}
                  </p>
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
