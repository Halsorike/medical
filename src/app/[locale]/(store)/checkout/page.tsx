"use client";
import { useState } from "react";
import { useRouter } from "@/navigation";
import { useCart } from "@/components/store/cart-context";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [pay, setPay] = useState("card");
  const [submitting, setSubmitting] = useState(false);
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 6.99;
  const tax = Math.round(subtotal * 0.07 * 100) / 100;
  const total = subtotal + shipping + tax;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "pending",
        total,
        items: items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          qty: item.qty,
          price: item.product.price,
        })),
        shippingAddress: {
          name: `${formData.get("firstName") ?? ""} ${formData.get("lastName") ?? ""}`.trim(),
          email: String(formData.get("email") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          line1: String(formData.get("address") ?? ""),
          city: String(formData.get("city") ?? ""),
          zip: String(formData.get("zip") ?? ""),
          country: String(formData.get("country") ?? "US"),
        },
        payment: pay === "cod" ? "unpaid" : "paid",
      }),
    });

    setSubmitting(false);

    if (!response.ok) {
      toast.error("Checkout failed. Please try again.");
      return;
    }

    clear();
    router.push("/checkout/success");
  }

  if (items.length === 0)
    return <div className="container py-16 text-center"><h1 className="text-xl font-semibold">Your cart is empty.</h1></div>;

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <p className="mb-4 font-semibold">Contact</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
              <div><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" type="tel" required /></div>
            </div>
          </div>
          <div className="rounded-lg border bg-white p-6">
            <p className="mb-4 font-semibold">Shipping address</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div><Label htmlFor="fn">First name</Label><Input id="fn" name="firstName" required /></div>
              <div><Label htmlFor="ln">Last name</Label><Input id="ln" name="lastName" required /></div>
              <div className="md:col-span-2"><Label htmlFor="addr">Address</Label><Input id="addr" name="address" required /></div>
              <div><Label htmlFor="city">City</Label><Input id="city" name="city" required /></div>
              <div><Label htmlFor="zip">Postal code</Label><Input id="zip" name="zip" required /></div>
              <div className="md:col-span-2">
                <Label>Country</Label>
                <Select defaultValue="US" name="country"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="US">United States</SelectItem><SelectItem value="CA">Canada</SelectItem><SelectItem value="UK">United Kingdom</SelectItem>
                </SelectContent></Select>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-white p-6">
            <p className="mb-4 font-semibold">Payment</p>
            <div className="space-y-2">
              {[["card","Credit / debit card"],["paypal","PayPal"],["cod","Cash on delivery"]].map(([v,l]) => (
                <label key={v} className="flex items-center gap-2 rounded-md border p-3 text-sm">
                  <input type="radio" name="pay" checked={pay === v} onChange={() => setPay(v)} className="accent-brand-teal" />{l}
                </label>
              ))}
            </div>
            {pay === "card" && (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="md:col-span-2"><Label htmlFor="cc">Card number</Label><Input id="cc" placeholder="4242 4242 4242 4242" required /></div>
                <div><Label htmlFor="exp">Expiry</Label><Input id="exp" placeholder="MM/YY" required /></div>
                <div><Label htmlFor="cvv">CVV</Label><Input id="cvv" required /></div>
              </div>
            )}
          </div>
        </div>
        <aside className="h-fit rounded-lg border bg-white p-6">
          <p className="mb-4 font-semibold">Order summary</p>
          <ul className="mb-3 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.product.id} className="flex justify-between"><span className="truncate">{i.product.name} x {i.qty}</span><span>{formatCurrency(i.qty * i.product.price)}</span></li>
            ))}
          </ul>
          <div className="border-t pt-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(tax)}</span></div>
            <div className="mt-2 flex justify-between text-lg font-bold"><span>Total</span><span>{formatCurrency(total)}</span></div>
          </div>
          <Button type="submit" variant="gradient" className="mt-4 w-full" disabled={submitting}>{submitting ? "Placing orderâ€¦" : "Place order"}</Button>
        </aside>
      </form>
    </div>
  );
}
