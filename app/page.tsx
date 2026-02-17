import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootRedirectPage() {
  const acceptLanguage = (await headers()).get("accept-language")?.toLowerCase() ?? "";
  const targetLang = acceptLanguage.includes("en") ? "en" : "zh";
  redirect(`/${targetLang}`);
}
