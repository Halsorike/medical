import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Jordan Hearing & Speech Therapy website and services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="bg-white py-16">
      <div className="container max-w-3xl">
        <h1 className="gradient-text mb-8 text-[38px] font-semibold">Terms of Use</h1>
        <p className="mb-4 text-[15px] font-light leading-relaxed text-[#42526b]">
          Last updated: January 2025
        </p>

        <section className="mb-8">
          <h2 className="mb-3 text-[20px] font-semibold text-[#061c3d]">1. Acceptance of Terms</h2>
          <p className="text-[15px] font-light leading-relaxed text-[#42526b]">
            By accessing and using the Jordan Hearing &amp; Speech Therapy website, you accept and agree to be bound by these terms. If you do not agree, please do not use this site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-[20px] font-semibold text-[#061c3d]">2. Medical Disclaimer</h2>
          <p className="text-[15px] font-light leading-relaxed text-[#42526b]">
            The information provided on this website is for general informational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional for diagnosis and treatment. The online hearing evaluation tool provides a screening indication only â€” it is not a clinical diagnosis.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-[20px] font-semibold text-[#061c3d]">3. Appointments</h2>
          <p className="text-[15px] font-light leading-relaxed text-[#42526b]">
            Booking an appointment through our website is subject to confirmation from our clinic. We reserve the right to reschedule or cancel appointments with reasonable notice. Patients are asked to provide at least 24 hours notice for cancellations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-[20px] font-semibold text-[#061c3d]">4. Intellectual Property</h2>
          <p className="text-[15px] font-light leading-relaxed text-[#42526b]">
            All content on this website, including text, images, and logos, is the property of Jordan Hearing &amp; Speech Therapy and may not be reproduced without permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-[20px] font-semibold text-[#061c3d]">5. Contact</h2>
          <p className="text-[15px] font-light leading-relaxed text-[#42526b]">
            Questions about these terms? Contact us at{" "}
            <a href="mailto:info@jordanhearing.com" className="text-[#9b1fe1] underline">
              info@jordanhearing.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
