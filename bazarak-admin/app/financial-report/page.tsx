"use client";

import { useEffect, useState } from "react";

type Supplier = {
  id: number;
  name: string;
};

type Order = {
  id: number;
  product?: { name: string };
  supplier?: { name: string };
  quantity: number;
  unit?: string;
  finalPrice: number;
  commissionPercent: number;
  commissionAmount: number;
};

type Report = {
  totalOrders: number;
  totalSales: number;
  totalCommission: number;
  averageOrderValue: number;
  orders: Order[];
};

type SupplierReport = {
  supplierId: number;
  supplier: Supplier;
  totalOrders: number;
  totalSales: number;
  totalCommission: number;
  orders: Order[];
};

export default function FinancialReportPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierReport, setSupplierReport] =
    useState<SupplierReport | null>(null);

  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [loading, setLoading] = useState(true);
  const [supplierLoading, setSupplierLoading] = useState(false);

  const money = (value: number) =>
    new Intl.NumberFormat("fa-IR").format(value) + " تومان";

  const loadReport = async () => {
    try {
      const res = await fetch(
        "http://localhost:4000/orders/report/financial"
      );

      if (!res.ok) {
        throw new Error("خطا در دریافت گزارش مالی");
      }

      const data = await res.json();
      setReport(data);
    } catch (error) {
      console.error("خطا در دریافت گزارش:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const res = await fetch("http://localhost:4000/suppliers");

      if (!res.ok) {
        throw new Error("خطا در دریافت تأمین‌کنندگان");
      }

      const data = await res.json();
      setSuppliers(data);
    } catch (error) {
      console.error("خطا در دریافت تأمین‌کنندگان:", error);
    }
  };

  const loadSupplierReport = async (supplierId: string) => {
    if (!supplierId) {
      setSupplierReport(null);
      return;
    }

    setSupplierLoading(true);

    try {
      const res = await fetch(
        `http://localhost:4000/orders/report/supplier/${supplierId}`
      );

      if (!res.ok) {
        throw new Error("خطا در دریافت گزارش تأمین‌کننده");
      }

      const data = await res.json();
      setSupplierReport(data);
    } catch (error) {
      console.error("خطا در گزارش تأمین‌کننده:", error);
      setSupplierReport(null);
    } finally {
      setSupplierLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
    loadSuppliers();
  }, []);

  const handleSupplierChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedSupplier(value);
    loadSupplierReport(value);
  };

  if (loading) {
    return (
      <main
        className="min-h-screen bg-slate-100 p-6"
        dir="rtl"
      >
        <h1 className="text-2xl font-bold">
          گزارش مالی بازارک
        </h1>
        <p className="mt-6">در حال دریافت اطلاعات...</p>
      </main>
    );
  }

  if (!report) {
    return (
      <main
        className="min-h-screen bg-slate-100 p-6"
        dir="rtl"
      >
        <h1 className="text-2xl font-bold">
          گزارش مالی بازارک
        </h1>

        <p className="mt-6 text-red-600">
          دریافت گزارش با خطا مواجه شد.
        </p>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-slate-100 p-6 text-slate-900"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl">

        <div className="mb-6">
          <a
            href="/"
            className="text-blue-600 hover:underline"
          >
            ← بازگشت به داشبورد
          </a>

          <h1 className="mt-4 text-3xl font-bold text-blue-700">
            📊 گزارش مالی بازارک
          </h1>

          <p className="mt-2 text-gray-600">
            خلاصه معاملات و درآمد پورسانت بازارک
          </p>
        </div>

        {/* گزارش کلی */}
        <h2 className="mb-4 text-xl font-bold">
          📈 گزارش کلی بازارک
        </h2>

        <div className="grid gap-4 md:grid-cols-4">

          <div className="rounded-xl border bg-white p-5 shadow">
            <p className="text-gray-500">
              تعداد معاملات
            </p>

            <p className="mt-2 text-3xl font-bold">
              {report.totalOrders}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow">
            <p className="text-gray-500">
              مجموع فروش
            </p>

            <p className="mt-2 text-xl font-bold">
              {money(report.totalSales)}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow">
            <p className="text-gray-500">
              درآمد پورسانت بازارک
            </p>

            <p className="mt-2 text-xl font-bold text-green-600">
              {money(report.totalCommission)}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow">
            <p className="text-gray-500">
              میانگین ارزش سفارش
            </p>

            <p className="mt-2 text-xl font-bold">
              {money(report.averageOrderValue)}
            </p>
          </div>

        </div>

        {/* انتخاب تأمین کننده */}
        <div className="mt-8 rounded-xl border bg-white p-5 shadow">

          <h2 className="text-xl font-bold">
            🏭 گزارش اختصاصی تأمین‌کننده
          </h2>

          <p className="mt-2 text-gray-500">
            یک تأمین‌کننده را انتخاب کنید تا فروش و پورسانت او نمایش داده شود.
          </p>

          <select
            value={selectedSupplier}
            onChange={handleSupplierChange}
            className="mt-4 w-full rounded-lg border p-3 md:w-1/2"
          >
            <option value="">
              انتخاب تأمین‌کننده
            </option>

            {suppliers.map((supplier) => (
              <option
                key={supplier.id}
                value={supplier.id}
              >
                {supplier.name}
              </option>
            ))}
          </select>

        </div>

        {/* گزارش تأمین کننده */}
        {supplierLoading && (
          <div className="mt-6 rounded-xl border bg-white p-5 shadow">
            در حال دریافت گزارش تأمین‌کننده...
          </div>
        )}

        {supplierReport && !supplierLoading && (
          <div className="mt-6">

            <h2 className="mb-4 text-xl font-bold">
              🏭 {supplierReport.supplier.name}
            </h2>

            <div className="grid gap-4 md:grid-cols-3">

              <div className="rounded-xl border bg-white p-5 shadow">
                <p className="text-gray-500">
                  تعداد معاملات
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {supplierReport.totalOrders}
                </p>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow">
                <p className="text-gray-500">
                  مجموع فروش
                </p>

                <p className="mt-2 text-xl font-bold">
                  {money(supplierReport.totalSales)}
                </p>
              </div>

              <div className="rounded-xl border bg-white p-5 shadow">
                <p className="text-gray-500">
                  پورسانت بازارک
                </p>

                <p className="mt-2 text-xl font-bold text-green-600">
                  {money(supplierReport.totalCommission)}
                </p>
              </div>

            </div>

            <div className="mt-6 overflow-x-auto rounded-xl border bg-white shadow">

              <table className="w-full text-right">

                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="p-4">
                      سفارش
                    </th>

                    <th className="p-4">
                      محصول
                    </th>

                    <th className="p-4">
                      تعداد
                    </th>

                    <th className="p-4">
                      قیمت نهایی
                    </th>

                    <th className="p-4">
                      پورسانت
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {supplierReport.orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b"
                    >
                      <td className="p-4">
                        #{order.id}
                      </td>

                      <td className="p-4">
                        {order.product?.name ?? "-"}
                      </td>

                      <td className="p-4">
                        {order.quantity}{" "}
                        {order.unit ?? ""}
                      </td>

                      <td className="p-4">
                        {money(order.finalPrice)}
                      </td>

                      <td className="p-4 font-semibold text-green-600">
                        {money(order.commissionAmount)}

                        <div className="text-xs text-gray-500">
                          {order.commissionPercent}٪
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

          </div>
        )}

        {/* همه معاملات */}
        <div className="mt-10">

          <h2 className="mb-4 text-xl font-bold">
            🛒 همه معاملات بازارک
          </h2>

          <div className="overflow-x-auto rounded-xl border bg-white shadow">

            <table className="w-full text-right">

              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-4">
                    سفارش
                  </th>

                  <th className="p-4">
                    محصول
                  </th>

                  <th className="p-4">
                    تأمین‌کننده
                  </th>

                  <th className="p-4">
                    تعداد
                  </th>

                  <th className="p-4">
                    قیمت نهایی
                  </th>

                  <th className="p-4">
                    پورسانت
                  </th>
                </tr>
              </thead>

              <tbody>
                {report.orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b"
                  >
                    <td className="p-4">
                      #{order.id}
                    </td>

                    <td className="p-4">
                      {order.product?.name ?? "-"}
                    </td>

                    <td className="p-4">
                      {order.supplier?.name ?? "-"}
                    </td>

                    <td className="p-4">
                      {order.quantity}{" "}
                      {order.unit ?? ""}
                    </td>

                    <td className="p-4">
                      {money(order.finalPrice)}
                    </td>

                    <td className="p-4 font-semibold text-green-600">
                      {money(order.commissionAmount)}

                      <div className="text-xs text-gray-500">
                        {order.commissionPercent}٪
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </div>

      </div>
    </main>
  );
}
