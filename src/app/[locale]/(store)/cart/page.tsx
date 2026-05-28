"use client";
import { useState } from "react";
import { Link } from "@/navigation";
import { useRouter } from "@/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/store/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const COUPONS: Record<string, number> = {
  CLINIC10: 0.1,
  HEARING20: 0.2,
  WELCOME5: 0.05,
};

type PaymentErrors = {
  cardName?: string;
  cardNum?: string;
  expiry?: string;
  cvc?: string;
};

export default function CartPage() {
  const router = useRouter();
  const { items, remove, setQty, subtotal, clear } = useCart();
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; rate: number } | null>(null);
  const [couponMessage, setCouponMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [errors, setErrors] = useState<PaymentErrors>({});
  const [payMethod, setPayMethod] = useState<"paypal" | "card">("card");
  const [form, setForm] = useState({
    firstName: "", lastName: "", address: "", apt: "", city: "",
    country: "", cityS: "", zip: "",
    cardName: "", cardNum: "", month: "", year: "", cvc: "",
    saveCard: true,
  });

  const discount = appliedCoupon ? subtotal * appliedCoupon.rate : 0;
  const shipping = 0;
  const total = Math.max(0, subtotal - discount + shipping);

  function formatCardNumber(value: string) {
    return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }

  function validatePayment() {
    if (payMethod !== "card") {
      setErrors({});
      return true;
    }

    const nextErrors: PaymentErrors = {};
    const cardDigits = form.cardNum.replace(/\D/g, "");
    const month = Number(form.month);
    const year = Number(form.year);
    const now = new Date();
    const expiry = new Date(year, month, 0);

    if (!form.cardName.trim()) nextErrors.cardName = "Cardholder name is required.";
    if (cardDigits.length !== 16) nextErrors.cardNum = "Enter a valid 16-digit card number.";
    if (!month || month < 1 || month > 12 || !year || expiry <= now) nextErrors.expiry = "Enter a future expiry date.";
    if (!/^\d{3,4}$/.test(form.cvc)) nextErrors.cvc = "CVC must be 3-4 digits.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    const rate = COUPONS[code];

    if (!rate) {
      setAppliedCoupon(null);
      setCouponMessage({ type: "error", text: "Invalid coupon code" });
      return;
    }

    setAppliedCoupon({ code, rate });
    setCouponMessage({ type: "success", text: `Coupon applied! You saved ${formatCurrency(subtotal * rate)}` });
  }

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!validatePayment()) {
      return;
    }

    const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
    window.localStorage.setItem("lastOrder", JSON.stringify({
      orderNumber,
      items,
      subtotal,
      discount,
      shipping,
      total,
    }));
    toast.success("Order placed successfully!");
    clear();
    router.push(`/checkout/success?order=${orderNumber}`);
  }

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <p className="text-2xl font-bold text-gray-700">Your cart is empty</p>
        <p className="mt-2 text-muted-foreground">Add products from the shop to get started.</p>
        <Link href="/shop" className="mt-6 inline-block">
          <Button variant="gradient" className="rounded-full px-10">Browse Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Page hero */}
      <div className="relative overflow-hidden bg-purple-50 pb-8 pt-6">
        <div className="container">
          <h1 className="text-2xl font-bold text-purple-600">Cart</h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg viewBox="0 0 1440 30" className="w-full fill-white">
            <path d="M0,15 C360,30 1080,0 1440,15 L1440,30 L0,30 Z" />
          </svg>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left â€” items + order summary */}
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-4 rounded-2xl border border-purple-100 bg-white p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    loading="lazy"
                    className="h-16 w-16 rounded-xl object-cover bg-purple-50 shrink-0"
                  />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{item.product.name}</p>
                  <p className="text-xs text-muted-foreground">Quantity: {item.qty}</p>
                  <p className="mt-1 font-bold">{formatCurrency(item.product.price * item.qty)}</p>
                </div>
                <div className="flex flex-col items-end justify-between gap-2">
                  <button
                    onClick={() => remove(item.product.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex items-center rounded-full border border-gray-200">
                    <button
                      onClick={() => setQty(item.product.id, item.qty - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-purple-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-medium">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.product.id, item.qty + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-purple-50"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Order Summary */}
            <div className="rounded-2xl border border-purple-100 bg-white p-5">
              <h3 className="mb-4 font-semibold text-gray-800">Order Summary</h3>
              <div className="mb-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code here"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="rounded-lg border-gray-200"
                  />
                  <Button type="button" variant="outline" className="rounded-lg" onClick={applyCoupon}>
                    Apply
                  </Button>
                </div>
                {couponMessage && (
                  <p className={`mt-2 text-xs font-medium ${couponMessage.type === "success" ? "text-green-600" : "text-red-600"}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground">Free delivery within Amman</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium">{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>Total</span>
                  <span className="text-purple-700">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Link href="/shop" className="text-sm text-purple-600 hover:underline">â† Continue shopping</Link>
              <Button variant="ghost" size="sm" onClick={clear} className="text-sm text-red-500">Clear cart</Button>
            </div>
          </div>

          {/* Right â€” shipping + payment */}
          <form onSubmit={handlePay} className="rounded-2xl border border-purple-100 bg-white p-6 space-y-5 h-fit">
            <h3 className="font-semibold text-gray-800">Shipping Information</h3>

            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="rounded-lg" required />
              <Input placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="rounded-lg" required />
            </div>
            <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-lg" required />
            <Input placeholder="Apartment, suite, etc. (optional)" value={form.apt} onChange={(e) => setForm({ ...form, apt: e.target.value })} className="rounded-lg" />
            <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-lg" required />
            <div className="grid grid-cols-3 gap-3">
              <Input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="rounded-lg" required />
              <Input placeholder="City" value={form.cityS} onChange={(e) => setForm({ ...form, cityS: e.target.value })} className="rounded-lg" />
              <Input placeholder="Zipcode" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className="rounded-lg" />
            </div>

            {/* Payment method toggle */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPayMethod("paypal")}
                className={`rounded-xl border py-3 text-sm font-medium transition-colors ${payMethod === "paypal" ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 text-gray-500 hover:border-purple-300"}`}
              >
                PayPal
              </button>
              <button
                type="button"
                onClick={() => setPayMethod("card")}
                className={`rounded-xl border py-3 text-sm font-medium transition-colors ${payMethod === "card" ? "border-purple-500 bg-purple-50 text-purple-700" : "border-gray-200 text-gray-500 hover:border-purple-300"}`}
              >
                Credit Card
              </button>
            </div>

            {payMethod === "card" && (
              <>
                <h3 className="font-semibold text-gray-800">Payment Details</h3>
                <div>
                  <Input placeholder="Cardholder Name" value={form.cardName} onChange={(e) => setForm({ ...form, cardName: e.target.value })} className="rounded-lg" />
                  {errors.cardName && <p className="mt-1 text-xs text-red-600">{errors.cardName}</p>}
                </div>
                <div>
                  <Input placeholder="Card Number" value={form.cardNum} onChange={(e) => setForm({ ...form, cardNum: formatCardNumber(e.target.value) })} className="rounded-lg" maxLength={19} />
                  {errors.cardNum && <p className="mt-1 text-xs text-red-600">{errors.cardNum}</p>}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Input placeholder="Month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} className="rounded-lg" />
                  <Input placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="rounded-lg" />
                  <Input placeholder="CVC" value={form.cvc} onChange={(e) => setForm({ ...form, cvc: e.target.value })} className="rounded-lg" maxLength={4} />
                </div>
                {errors.expiry && <p className="text-xs text-red-600">{errors.expiry}</p>}
                {errors.cvc && <p className="text-xs text-red-600">{errors.cvc}</p>}
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.saveCard}
                    onChange={(e) => setForm({ ...form, saveCard: e.target.checked })}
                    className="accent-purple-600"
                  />
                  Save card data for future payments
                </label>
              </>
            )}

            <Button type="submit" variant="gradient" className="w-full rounded-full py-3 text-base font-semibold">
              Pay {formatCurrency(total)}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
