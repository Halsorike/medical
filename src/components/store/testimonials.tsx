import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Sara A.",
    role: "Parent",
    quote:
      "The team helped us understand our child's needs clearly and gave us a plan we could follow at home.",
    align: "left",
  },
  {
    name: "Maha K.",
    role: "Patient",
    quote:
      "A calm, professional experience from assessment to follow-up. The specialists were thoughtful and precise.",
    align: "right",
  },
  {
    name: "Omar H.",
    role: "Parent",
    quote:
      "Speech sessions became a turning point for our family. We felt supported every step of the way.",
    align: "left",
  },
];

export function Testimonials() {
  return (
    <section className="figma-section bg-brand-50/70">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="gradient-text text-[30px] font-semibold">Real Stories from Satisfied Customers</h2>
          <p className="mt-3 text-[18px] font-light text-[#42526b]">Families in Muscat sharing progress, care, and confidence.</p>
        </div>
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className={`flex items-start gap-4 ${testimonial.align === "right" ? "ml-auto flex-row-reverse text-right" : "mr-auto"}`}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-button-gradient text-lg font-bold text-white shadow-[0_8px_18px_rgba(0,153,168,0.18)]">
                {testimonial.name[0]}
              </div>
              <div className="figma-card relative max-w-[640px] p-6">
                <div className={`absolute top-6 h-4 w-4 rotate-45 bg-white ${testimonial.align === "right" ? "-right-2" : "-left-2"}`} />
                <p className="text-[15px] leading-7 text-[#42526b]">{testimonial.quote}</p>
                <p className="mt-4 font-semibold text-[#061c3d]">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 flex justify-center gap-3">
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-100 bg-white text-brand-teal shadow-sm" aria-label="Previous testimonial">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-teal text-white shadow-sm" aria-label="Next testimonial">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
