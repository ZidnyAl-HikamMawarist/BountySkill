import React from 'react';
import { RoleGuard } from '@/components/auth/role-guard';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['CLIENT']} pageTitle="Dashboard Klien">
      {children}
    </RoleGuard>
  );
}
