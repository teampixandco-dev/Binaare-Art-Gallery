import { currentAdmin } from "@/lib/admin-auth";
import { getContent } from "@/lib/content-store";
import AdminDashboard from "@/components/admin/AdminDashboard";
import LoginForm from "@/components/admin/LoginForm";
import "./admin.css";
export const dynamic = "force-dynamic";
export const metadata = { title: "Gallery Studio | Binaare Admin", robots: { index: false, follow: false } };
export default async function AdminPage() {
  const username = await currentAdmin();
  return username ? <AdminDashboard initial={getContent()} username={username} /> : <LoginForm />;
}
