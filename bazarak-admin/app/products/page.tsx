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
      const res = await fetch("http://localhost:4000/suppliers");
      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Suppliers error:", error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);

    try {
      const supplierId = new URLSearchParams(
        window.location.search
      ).get("supplierId");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (supplierId) {
        params.set("supplierId", supplierId);
      }

      const query = params.toString();

      const url = query
        ? `http://localhost:4000/suppliers/products?${query}`
        : "http://localhost:4000/suppliers/products";

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
      const res = await fetch(
        "http://localhost:4000/suppliers/products",
        {
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
        }
      );

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
    } catch (error) {
      console.error("Add product error:", error);
    }
  };

  return (
    <main dir="rtl" style={{ padding: 24 }}>
      <h1>مدیریت محصولات بازارک</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی محصول..."
          style={{
            padding: 10,
            width: "100%",
            maxWidth: 400,
            marginLeft: 10,
          }}
        />

        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: "10px 18px" }}
        >
          {showForm ? "بستن فرم" : "افزودن محصول"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={addProduct}
          style={{
            border: "1px solid #ddd",
            padding: 20,
            marginBottom: 25,
            maxWidth: 600,
          }}
        >
          <h2>افزودن محصول جدید</h2>

          <input
            required
            placeholder="نام محصول"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            style={{ display: "block", padding: 10, width: "100%", marginBottom: 10 }}
          />

          <input
            required
            placeholder="دسته‌بندی"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            style={{ display: "block", padding: 10, width: "100%", marginBottom: 10 }}
          />

          <input
            required
            placeholder="قیمت"
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            style={{ display: "block", padding: 10, width: "100%", marginBottom: 10 }}
          />

          <input
            required
            placeholder="واحد (مثلاً کیلو، عدد، کارتن)"
            value={form.unit}
            onChange={(e) =>
              setForm({ ...form, unit: e.target.value })
            }
            style={{ display: "block", padding: 10, width: "100%", marginBottom: 10 }}
          />

          <textarea
            placeholder="توضیحات محصول"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            style={{ display: "block", padding: 10, width: "100%", marginBottom: 10 }}
          />

          <select
            required
            value={form.supplierId}
            onChange={(e) =>
              setForm({ ...form, supplierId: e.target.value })
            }
            style={{ display: "block", padding: 10, width: "100%", marginBottom: 10 }}
          >
            <option value="">انتخاب فروشنده</option>

            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name} - {supplier.city}
              </option>
            ))}
          </select>

          <button
            type="submit"
            style={{ padding: "10px 20px" }}
          >
            ثبت محصول
          </button>
        </form>
      )}

      <section>
        <h2>لیست محصولات</h2>

        {loading ? (
          <p>در حال بارگذاری...</p>
        ) : products.length === 0 ? (
          <p>محصولی پیدا نشد.</p>
        ) : (
          <div>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  border: "1px solid #ddd",
                  padding: 16,
                  marginBottom: 12,
                  borderRadius: 8,
                }}
              >
                <h3>{product.name}</h3>
                <p>دسته‌بندی: {product.category}</p>
                <p>
                  قیمت: {product.price.toLocaleString()} تومان / {product.unit}
                </p>

                {product.description && (
                  <p>توضیحات: {product.description}</p>
                )}

                {product.supplier && (
                  <p>
                    فروشنده: {product.supplier.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
