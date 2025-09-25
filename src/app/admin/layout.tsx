interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="bg-background relative flex min-h-svh flex-col">
      <div className="mx-auto my-8 max-w-screen-xl px-4">{children}</div>
    </div>
  );
}
