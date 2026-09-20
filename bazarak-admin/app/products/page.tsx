"use client";

import { useEffect, useState } from "react";

type Supplier = {
  id: number;
  name: string;
  city: string;
  type: string;
  address?: string;
};

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  supplierId: number;
  supplier?: Supplier;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    unit: "",
    supplierId: "",
  });

  const loadSuppliers = async () => {
    try {
      const res = await fetch("http://localhost:3002/suppliers");
      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Suppliers error:", error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);

    try {
      const url = search.trim()
        ? `http://localhost:3002/suppliers/products?search=${encodeURIComponent(search)}`
        : "http://localhost:3002/suppliers/products";

      const res = await fetch(url);
      const data = await res.json();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Products error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadSuppliers();
  }, [search]);

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3002/suppliers/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          description: form.description,
          price: Number(form.price),
          unit: form.unit,
          supplierId: Number(form.supplierId),
        }),
      });

      if (!res.ok) {
        throw new Error("خطا در افزودن محصول");
      }

      setForm({
        name: "",
        category: "",
        description: "",
        price: "",
        unit: "",
        supplierId: "",
      });

      setShowForm(false);
      loadProducts();
    loadSuppliers();
    } catch (error) {
      console.error(error);
      alert("افزودن محصول انجام نشد.");
    }
  };

  return (
    <main
      className="min-h-screen bg-slate-100 p-6 text-slate-900"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-700">
                مدیریت محصولات
              </h1>

              <p className="mt-2 text-slate-600">
                مدیریت محصولات و تأمین‌کنندگان بازارک
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-sm hover:bg-blue-700"
            >
              {showForm ? "بستن فرم" : "➕ افزودن محصول"}
            </button>
          </div>
        </header>

        {showForm && (
          <form
            onSubmit={addProduct}
            className="mb-8 rounded-2xl bg-white p-6 shadow-sm"
          >
            <h2 className="mb-5 text-xl font-bold text-slate-800">
              افزودن محصول جدید
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                required
                placeholder="نام محصول"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="rounded-xl border p-3"
              />

              <input
                placeholder="دسته‌بندی"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="rounded-xl border p-3"
              />

              <input
                required
                type="number"
                placeholder="قیمت"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                className="rounded-xl border p-3"
              />

              <input
                placeholder="واحد؛ مثال: کیلو"
                value={form.unit}
                onChange={(e) =>
                  setForm({ ...form, unit: e.target.value })
                }
                className="rounded-xl border p-3"
              />

              <select
                required
                value={form.supplierId}
                onChange={(e) =>
                  setForm({ ...form, supplierId: e.target.value })
                }
                className="rounded-xl border p-3"
              >
                <option value="">انتخاب تأمین‌کننده</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name} - {supplier.city}
                  </option>
                ))}
              </select>

              <input
                placeholder="توضیحات"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="rounded-xl border p-3"
              />
            </div>

            <button
              type="submit"
              className="mt-5 rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
            >
              ثبت محصول
            </button>
          </form>
        )}

        <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <input
            type="text"
            placeholder="🔎 جستجوی محصول، دسته‌بندی یا توضیحات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border p-4 outline-none focus:border-blue-500"
          />
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            در حال دریافت محصولات...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            محصولی پیدا نشد.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold">
                    {product.name}
                  </h2>

                  <span className="rounded-lg bg-blue-50 px-3 py-1 text-sm text-blue-700">
                    #{product.id}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-slate-600">
                  <p>📦 دسته: {product.category || "نامشخص"}</p>

                  <p>
                    💰 قیمت:{" "}
                    {Number(product.price).toLocaleString()} تومان
                  </p>

                  <p>⚖️ واحد: {product.unit || "نامشخص"}</p>

                  <p>
                    🏭 تأمین‌کننده:{" "}
                    {product.supplier?.name || "نامشخص"}
                  </p>

                  <p>
                    📍 شهر:{" "}
                    {product.supplier?.city || "نامشخص"}
                  </p>

                  <p>
                    🏠 آدرس:{" "}
                    {product.supplier?.address || "نامشخص"}
                  </p>
                </div>

                {product.description && (
                  <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                    {product.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
