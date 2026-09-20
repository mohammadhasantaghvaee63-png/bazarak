"use client";

import { useEffect, useState } from "react";

type Supplier = {
  id: number;
  name?: string;
  phone?: string;
  city?: string;
};

type Order = {
  id: number;
  productId?: number;
  product?: {
    name?: string;
    price?: number;
    unit?: string;
  };
  supplierId?: number | null;
  supplier?: {
    name?: string;
    phone?: string;
    city?: string;
  };
  customerName?: string;
  customerPhone?: string;
  quantity?: number;
  unit?: string;
  offeredPrice?: number | null;
  finalPrice?: number | null;
  commissionPercent?: number | null;
  commissionAmount?: number | null;
  status?: string;
  message?: string;
};

function formatPrice(value?: number | null) {
  if (value === null || value === undefined) return "نامشخص";
  return `${value.toLocaleString("fa-IR")} تومان`;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const [supplierValues, setSupplierValues] = useState<
    Record<number, string>
  >({});
  const [priceValues, setPriceValues] = useState<Record<number, string>>({});
  const [commissionValues, setCommissionValues] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:4000/orders").then((res) => {
        if (!res.ok) throw new Error("خطا در دریافت سفارش‌ها");
        return res.json();
      }),
      fetch("http://localhost:4000/suppliers").then((res) => {
        if (!res.ok) throw new Error("خطا در دریافت تأمین‌کننده‌ها");
        return res.json();
      }),
    ])
      .then(([ordersData, suppliersData]) => {
        const orderList = Array.isArray(ordersData)
          ? ordersData
          : ordersData.orders || [];

        const supplierList = Array.isArray(suppliersData)
          ? suppliersData
          : suppliersData.suppliers || [];

        setOrders(orderList);
        setSuppliers(supplierList);

        const initialSuppliers: Record<number, string> = {};
        const initialPrices: Record<number, string> = {};
        const initialCommissions: Record<number, string> = {};

        orderList.forEach((order: Order) => {
          if (order.supplierId != null) {
            initialSuppliers[order.id] = String(order.supplierId);
          }

          if (order.finalPrice != null) {
            initialPrices[order.id] = String(order.finalPrice);
          } else if (order.offeredPrice != null) {
            initialPrices[order.id] = String(order.offeredPrice);
          } else if (order.product?.price != null) {
            initialPrices[order.id] = String(order.product.price);
          }

          if (order.commissionPercent != null) {
            initialCommissions[order.id] = String(order.commissionPercent);
          } else {
            initialCommissions[order.id] = "3";
          }
        });

        setSupplierValues(initialSuppliers);
        setPriceValues(initialPrices);
        setCommissionValues(initialCommissions);
      })
      .catch(() => {
        setOrders([]);
        setSuppliers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function completeOrder(orderId: number) {
    const supplierId = Number(supplierValues[orderId]);
    const finalPrice = Number(priceValues[orderId]);
    const commissionPercent = Number(commissionValues[orderId]);

    if (!supplierId) {
      alert("لطفاً تأمین‌کننده را انتخاب کنید.");
      return;
    }

    if (!finalPrice || finalPrice <= 0) {
      alert("لطفاً قیمت نهایی را وارد کنید.");
      return;
    }

    if (
      Number.isNaN(commissionPercent) ||
      commissionPercent < 0
    ) {
      alert("درصد پورسانت معتبر نیست.");
      return;
    }

    setSavingId(orderId);

    try {
      const res = await fetch(
        `http://localhost:4000/orders/${orderId}/complete`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supplierId,
            finalPrice,
            commissionPercent,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("خطا در تکمیل سفارش");
      }

      const updatedOrder = await res.json();

      setOrders((current) =>
        current.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      );

      alert("سفارش با موفقیت تکمیل شد.");
    } catch {
      alert("ثبت سفارش انجام نشد. اتصال API را بررسی کنید.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">

        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">
            📦 مدیریت سفارش‌ها
          </h1>

          <a
            href="/"
            className="rounded-xl bg-white px-4 py-2 font-bold text-slate-700 shadow-sm"
          >
            بازگشت به داشبورد
          </a>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            در حال دریافت سفارش‌ها...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mb-2 text-4xl">📭</div>

            <h2 className="text-lg font-bold text-slate-800">
              هنوز سفارشی ثبت نشده است
            </h2>

            <p className="mt-2 text-slate-500">
              سفارش‌های ثبت‌شده در این قسمت نمایش داده می‌شوند.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const price =
                order.finalPrice ??
                order.offeredPrice ??
                order.product?.price ??
                null;

              const total =
                price !== null && order.quantity
                  ? price * order.quantity
                  : null;

              const editPrice = Number(priceValues[order.id] || 0);
              const editCommission = Number(
                commissionValues[order.id] || 0
              );

              const editTotal =
                editPrice > 0 && order.quantity
                  ? editPrice * order.quantity
                  : 0;

              const editCommissionAmount =
                (editTotal * editCommission) / 100;

              return (
                <div
                  key={order.id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-lg font-bold text-slate-800">
                      سفارش #{order.id}
                    </div>

                    <span className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                      وضعیت: {order.status || "در انتظار"}
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">

                    <div>
                      <div className="text-sm text-slate-500">
                        محصول
                      </div>
                      <div className="font-bold">
                        {order.product?.name || "نامشخص"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-500">
                        تعداد
                      </div>
                      <div className="font-bold">
                        {order.quantity ?? "نامشخص"}{" "}
                        {order.unit || order.product?.unit || ""}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-500">
                        قیمت فعلی
                      </div>
                      <div className="font-bold">
                        {formatPrice(price)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-500">
                        مبلغ کل فعلی
                      </div>
                      <div className="text-xl font-bold text-green-700">
                        {formatPrice(total)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-500">
                        پورسانت بازارک
                      </div>
                      <div className="font-bold text-orange-600">
                        {formatPrice(order.commissionAmount)}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-500">
                        درصد پورسانت
                      </div>
                      <div className="font-bold">
                        {order.commissionPercent != null
                          ? `${order.commissionPercent}٪`
                          : "نامشخص"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-500">
                        مشتری
                      </div>
                      <div className="font-bold">
                        {order.customerName || "نامشخص"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-500">
                        تلفن مشتری
                      </div>
                      <div className="font-bold">
                        {order.customerPhone || "نامشخص"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-slate-500">
                        تأمین‌کننده فعلی
                      </div>
                      <div className="font-bold">
                        {order.supplier?.name || "هنوز تعیین نشده"}
                      </div>
                    </div>

                  </div>

                  {order.message && (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                      <div className="text-sm text-slate-500">
                        توضیحات سفارش
                      </div>
                      <div className="mt-1 font-medium text-slate-700">
                        {order.message}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                    <div className="mb-4 text-lg font-bold text-slate-800">
                      ⚙️ مدیریت این سفارش
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">

                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-600">
                          انتخاب تأمین‌کننده
                        </label>

                        <select
                          value={supplierValues[order.id] || ""}
                          onChange={(e) =>
                            setSupplierValues((current) => ({
                              ...current,
                              [order.id]: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none"
                        >
                          <option value="">
                            انتخاب تأمین‌کننده
                          </option>

                          {suppliers.map((supplier) => (
                            <option
                              key={supplier.id}
                              value={supplier.id}
                            >
                              {supplier.name || `تأمین‌کننده #${supplier.id}`}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-600">
                          قیمت نهایی هر واحد
                        </label>

                        <input
                          type="number"
                          value={priceValues[order.id] || ""}
                          onChange={(e) =>
                            setPriceValues((current) => ({
                              ...current,
                              [order.id]: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none"
                          placeholder="مثلاً 230000"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-600">
                          درصد پورسانت
                        </label>

                        <input
                          type="number"
                          step="0.1"
                          value={commissionValues[order.id] || ""}
                          onChange={(e) =>
                            setCommissionValues((current) => ({
                              ...current,
                              [order.id]: e.target.value,
                            }))
                          }
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none"
                          placeholder="مثلاً 3"
                        />
                      </div>

                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">

                      <div className="rounded-xl bg-white p-4">
                        <div className="text-sm text-slate-500">
                          مبلغ نهایی سفارش
                        </div>
                        <div className="mt-1 text-lg font-bold text-green-700">
                          {formatPrice(editTotal)}
                        </div>
                      </div>

                      <div className="rounded-xl bg-white p-4">
                        <div className="text-sm text-slate-500">
                          پورسانت بازارک
                        </div>
                        <div className="mt-1 text-lg font-bold text-orange-600">
                          {formatPrice(editCommissionAmount)}
                        </div>
                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() => completeOrder(order.id)}
                      disabled={savingId === order.id}
                      className="mt-4 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingId === order.id
                        ? "در حال ثبت..."
                        : "✅ ثبت و تکمیل سفارش"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
