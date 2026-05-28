import { products } from "@/data/products";
import { orders } from "@/data/orders";
import { customers } from "@/data/customers";
import { appointments } from "@/data/clinic";
import { posts } from "@/data/blog";
import { db } from "@/lib/db";

let seedPromise: Promise<void> | null = null;

export async function seedDatabase() {
  const productCount = await db.product.count();

  if (productCount > 0) {
    return;
  }

  await db.$transaction([
    ...products.map((product) =>
      db.product.create({
        data: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          stock: product.stock,
          category: product.category,
          description: product.description,
          images: JSON.stringify(product.images?.length ? product.images : [product.image]),
        },
      })
    ),
    ...orders.map((order) =>
      db.order.create({
        data: {
          id: order.id,
          status: order.status,
          total: order.total,
          items: JSON.stringify({
            count: order.items,
            code: order.code,
            customer: order.customer,
            email: order.email,
            payment: order.payment,
            date: order.date,
          }),
          shippingAddress: JSON.stringify({
            name: order.customer,
            line1: "123 Main St",
            city: "Boston",
            state: "MA",
            zip: "02115",
            country: "US",
          }),
          createdAt: new Date(order.date),
        },
      })
    ),
    ...customers.map((customer) =>
      db.customer.create({
        data: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: "123 Main St, Boston MA 02115",
          createdAt: new Date(customer.joined),
        },
      })
    ),
    ...appointments.map((appointment) =>
      db.appointment.create({
        data: {
          id: appointment.id,
          patientName: appointment.patientName,
          email: `${appointment.patientName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
          phone: "+1 555-0200",
          department: appointment.employee,
          service: appointment.details,
          date: appointment.date,
          slot: appointment.time,
          confirmation: "email",
          status: appointment.status,
        },
      })
    ),
    ...posts.map((post) =>
      db.blogPost.create({
        data: {
          id: String(post.id),
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: JSON.stringify(post.content),
          category: post.category,
          date: post.date,
          readTime: post.readTime,
        },
      })
    ),
  ]);
}

export async function ensureSeeded() {
  seedPromise ??= seedDatabase();
  await seedPromise;
}

if (process.argv[1]?.replace(/\\/g, "/").endsWith("/src/lib/seed.ts")) {
  seedDatabase()
    .then(async () => {
      await db.$disconnect();
      console.log("Database seeded");
    })
    .catch(async (error) => {
      await db.$disconnect();
      console.error(error);
      process.exit(1);
    });
}
