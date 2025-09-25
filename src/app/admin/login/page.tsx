import { LoginForm } from "@/components/admin/login/login-form";

export default function LoginPage() {
  return (
    <div className="bg-card mx-auto my-12 max-w-xl rounded-md border p-4 shadow">
      <h1 className="text-2xl font-bold">Admin Login Ulmiversität</h1>
      <LoginForm className="mt-8 w-full" />
    </div>
  );
}
