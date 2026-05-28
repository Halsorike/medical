import { ok } from "@/lib/api";
import { clearPatientSessionCookie } from "@/lib/patient-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = ok({ loggedOut: true });
  clearPatientSessionCookie(response);
  return response;
}
