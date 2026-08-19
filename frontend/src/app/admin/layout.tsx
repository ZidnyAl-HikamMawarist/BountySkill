import React from 'react';
import { RoleGuard } from '@/components/auth/role-guard';
import { AdminSidebar } from '@/components/ui/admin-sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['ADMIN']} pageTitle="Pusat Moderasi Admin Hub">
      <div className="flex min-h-[calc(100vh-64px)]">
        <AdminSidebar />
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
