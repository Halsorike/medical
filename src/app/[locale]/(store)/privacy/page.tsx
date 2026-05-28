import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Jordan Hearing & Speech Therapy â€” how we collect, use, and protect your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="bg-white py-16">
      <div className="container max-w-3xl">
        <h1 className="gradient-text mb-8 text-[38px] font-semibold">Privacy Policy</h1>
        <p className="mb-4 text-[15px] font-light leading-relaxed text-[#42526b]">
          Last updated: January 2025
        </p>

        <section className="mb-8">
          <h2 className="mb-3 text-[20px] font-semibold text-[#061c3d]">1. Information We Collect</h2>
          <p className="text-[15px] font-light leading-relaxed text-[#42526b]">
            We collect information you provide directly to us when you book an appointment, contact us, or register for an account. This includes your name, email address, phone number, and appointment details. We do not sell your personal information to third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-[20px] font-semibold text-[#061c3d]">2. How We Use Your Information</h2>
          <p className="text-[15px] font-light leading-relaxed text-[#42526b]">
            We use the information we collect to schedule and confirm appointments, respond to your inquiries, send you relevant health information with your consent, and improve our services. Medical information is handled in accordance with Jordanian health data regulations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-[20px] font-semibold text-[#061c3d]">3. Data Security</h2>
          <p className="text-[15px] font-light leading-relaxed text-[#42526b]">
            We take reasonable measures to protect your information from unauthorised access, alteration, or disclosure. All data is transmitted over HTTPS. Patient records are stored securely and accessible only to authorised clinical staff.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-[20px] font-semibold text-[#061c3d]">4. Contact Us</h2>
          <p className="text-[15px] font-light leading-relaxed text-[#42526b]">
            If you have any questions about this privacy policy, please contact us at{" "}
            <a href="mailto:info@jordanhearing.com" className="text-[#9b1fe1] underline">
              info@jordanhearing.com
            </a>{" "}
            or call +962 6 123 4567.
          </p>
        </section>
      </div>
    </div>
  );
}
