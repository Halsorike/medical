import { PageHeader } from "@/components/admin/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <>
      <PageHeader title="Settings" />
      <Tabs defaultValue="store">
        <TabsList><TabsTrigger value="store">Store</TabsTrigger><TabsTrigger value="payment">Payments</TabsTrigger><TabsTrigger value="shipping">Shipping</TabsTrigger><TabsTrigger value="email">Email</TabsTrigger></TabsList>
        <TabsContent value="store">
          <form className="space-y-4 rounded-lg border bg-white p-6 max-w-2xl">
            <div><Label>Store name</Label><Input defaultValue="Medical" /></div>
            <div><Label>Tagline</Label><Input defaultValue="Healthcare delivered to your door" /></div>
            <div><Label>Address</Label><Textarea rows={3} defaultValue="1 Health St, Boston MA 02115" /></div>
            <Button variant="gradient">Save</Button>
          </form>
        </TabsContent>
        <TabsContent value="payment"><div className="rounded-lg border bg-white p-6 max-w-2xl"><p className="font-semibold mb-3">Payment gateways</p><p className="text-sm text-muted-foreground">Configure Stripe, PayPal, and other gateways here.</p></div></TabsContent>
        <TabsContent value="shipping"><div className="rounded-lg border bg-white p-6 max-w-2xl"><p className="font-semibold mb-3">Shipping zones</p><p className="text-sm text-muted-foreground">Configure shipping zones and rates here.</p></div></TabsContent>
        <TabsContent value="email"><div className="rounded-lg border bg-white p-6 max-w-2xl"><p className="font-semibold mb-3">Email templates</p><p className="text-sm text-muted-foreground">Edit transactional emails (order confirmation, shipping, refund).</p></div></TabsContent>
      </Tabs>
    </>
  );
}
