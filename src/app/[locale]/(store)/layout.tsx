import { StoreHeader } from "@/components/store/header";
import { StoreFooter } from "@/components/store/footer";
import { CartProvider } from "@/components/store/cart-context";
import { Toaster } from "sonner";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <StoreHeader />
      <main className="min-h-[60vh]">{children}</main>
      <StoreFooter />
      <Toaster richColors position="top-right" />
    </CartProvider>
  );
}
