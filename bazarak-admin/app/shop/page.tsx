"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  description?: string;
  price: number;
  unit: string;
  supplierId: number;
  supplier?: {
    name: string;
  };
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("همه");
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [quantity, setQuantity] = useState("1");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");

  const categories = ["همه", ...Array.from(new Set(products.map((product) => product.category)))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || product.category.toLowerCase().includes(search.toLowerCase()) || (product.supplier?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "همه" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const money = (value: number) =>
    new Intl.NumberFormat("fa-IR").format(value) + " تومان";

  useEffect(() => {
    fetch("http://localhost:4000/suppliers/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) =>
        console.error("خطا در دریافت محصولات:", error)
      )
      .finally(() => setLoading(false));
  }, []);

  const submitOrder = async () => {
    if (!selectedProduct) {
      alert("لطفاً یک محصول انتخاب کنید.");
      return;
    }

    if (!customerName.trim()) {
      alert("لطفاً نام خود را وارد کنید.");
      return;
    }

    if (!customerPhone.trim()) {
      alert("لطفاً شماره تماس را وارد کنید.");
      return;
    }

    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      alert("تعداد واردشده صحیح نیست.");
      return;
    }

    setSending(true);
    setSuccess("");

    try {
      const res = await fetch("http://localhost:4000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          supplierId: selectedProduct.supplierId,
          customerName,
          customerPhone,
          quantity: qty,
          unit: selectedProduct.unit,
          offeredPrice: selectedProduct.price,
          message,
        }),
      });

      if (!res.ok) {
        throw new Error("ثبت سفارش ناموفق بود.");
      }

      const data = await res.json();

      setSuccess(
        `سفارش شما با شماره #${data.id} با موفقیت ثبت شد.`
      );

      setQuantity("1");
      setCustomerName("");
      setCustomerPhone("");
      setMessage("");
      setSelectedProduct(null);
    } catch (error) {
      console.error(error);
      alert("ثبت سفارش با خطا مواجه شد.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <main
        className="min-h-screen bg-slate-100 p-6"
        dir="rtl"
      >
        <h1 className="text-2xl font-bold text-blue-700">
          بازارک
        </h1>
        <p className="mt-6">
          در حال دریافت محصولات...
        </p>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-slate-100 p-6 text-slate-900"
      dir="rtl"
    >
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-l from-blue-700 via-blue-600 to-cyan-500 p-6 text-white shadow-lg">
          <a href="/" className="inline-flex items-center rounded-xl bg-white/15 px-4 py-2 text-sm font-bold hover:bg-white/25">
            ← بازگشت به داشبورد
          </a>
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-4xl font-black">🛒 بازارک</div>
              <p className="mt-2 text-blue-100">بازار عمده‌فروشی مواد غذایی</p>
              <p className="mt-1 text-sm text-blue-100">تولیدکنندگان و عمده‌فروشان را به خریداران متصل می‌کنیم</p>
            </div>
            <div className="rounded-2xl bg-white/15 px-5 py-4 text-center backdrop-blur-sm">
              <div className="text-2xl font-black">{products.length}</div>
              <div className="text-sm text-blue-100">محصول موجود</div>
            </div>
          </div>
        </div>

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5 text-green-700">
            ✅ {success}
          </div>
        )}

        <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-bold">🔎 جستجوی محصول یا تأمین‌کننده</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="مثلاً برنج، خرما، کارخانه..."
                className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block font-bold">🏷️ دسته‌بندی</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-xl border bg-white p-3 outline-none focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold">
                  {product.name}
                </h2>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                  {product.category}
                </span>
              </div>

              <p className="mt-3 text-gray-600">
                {product.description || "بدون توضیحات"}
              </p>

              <p className="mt-4 text-sm text-gray-500">
                تأمین‌کننده:
              </p>

              <p className="font-semibold">
                {product.supplier?.name || "-"}
              </p>

              <p className="mt-4 text-2xl font-bold text-green-600">
                {money(product.price)}
              </p>

              <p className="text-sm text-gray-500">
                به ازای هر {product.unit}
              </p>

              <button
                onClick={() => {
                  setSelectedProduct(product);
                  setSuccess("");
                }}
                className="mt-5 w-full rounded-xl bg-blue-700 px-4 py-3 font-bold text-white hover:bg-blue-800"
              >
                ثبت سفارش
              </button>
            </div>
          ))}

        </div>

        {selectedProduct && (
          <div className="mt-8 rounded-2xl border bg-white p-6 shadow">

            <h2 className="text-2xl font-bold">
              ثبت سفارش: {selectedProduct.name}
            </h2>

            <p className="mt-2 text-gray-600">
              قیمت فعلی:{" "}
              <span className="font-bold text-green-600">
                {money(selectedProduct.price)}
              </span>{" "}
              / {selectedProduct.unit}
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <div>
                <label className="mb-2 block font-semibold">
                  مقدار
                </label>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value)
                  }
                  className="w-full rounded-xl border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  نام مشتری
                </label>

                <input
                  type="text"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(e.target.value)
                  }
                  placeholder="نام و نام خانوادگی"
                  className="w-full rounded-xl border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  شماره تماس
                </label>

                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) =>
                    setCustomerPhone(e.target.value)
                  }
                  placeholder="مثلاً 09120000000"
                  className="w-full rounded-xl border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  پیام یا توضیحات
                </label>

                <input
                  type="text"
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  placeholder="مثلاً ارسال فوری"
                  className="w-full rounded-xl border p-3"
                />
              </div>

            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="text-gray-500">
                مبلغ تقریبی سفارش
              </p>

              <p className="mt-1 text-2xl font-bold">
                {money(
                  Number(quantity || 0) *
                    selectedProduct.price
                )}
              </p>
            </div>

            <div className="mt-6 flex gap-3">

              <button
                onClick={submitOrder}
                disabled={sending}
                className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white disabled:opacity-50"
              >
                {sending
                  ? "در حال ثبت..."
                  : "✅ ثبت نهایی سفارش"}
              </button>

              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-xl border px-6 py-3 font-bold"
              >
                انصراف
              </button>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}
