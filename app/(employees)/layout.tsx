
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Employee Management',
  description: 'Employee Management Application.',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex justify-center items-center h-full">
      {children}
    </div>
  );
}
