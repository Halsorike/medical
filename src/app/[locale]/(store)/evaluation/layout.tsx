import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Hearing Evaluation",
  description: "Take our free online hearing screening to assess your hearing health. Not a clinical diagnosis.",
  alternates: { canonical: "/evaluation" },
};

export default function EvaluationLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
