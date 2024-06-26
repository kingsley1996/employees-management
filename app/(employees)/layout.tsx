
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Dashboard | Athena',
  description: 'SaaS AI Platform.',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="h-full relative">
      {children}
    </div>
  );
}
