"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  adminConfigured,
  adminCookieName,
  adminCookieSettings,
  createAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function adminLogin(formData: FormData): Promise<void> {
  if (!adminConfigured()) redirect("/admin?error=setup");

  const passphrase = formData.get("passphrase");
  if (!verifyAdminPassword(passphrase)) {
    // Use a strong random passphrase. Enable Vercel WAF login rate limiting
    // before handling real customer data.
    redirect("/admin?error=invalid");
  }

  const jar = await cookies();
  jar.set(adminCookieName(), createAdminSession(), adminCookieSettings);
  redirect("/admin");
}

export async function adminLogout(): Promise<void> {
  const jar = await cookies();
  jar.set(adminCookieName(), "", { ...adminCookieSettings, maxAge: 0 });
  redirect("/admin");
}
