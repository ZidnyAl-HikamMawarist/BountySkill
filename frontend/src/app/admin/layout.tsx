import React from 'react';
import { RoleGuard } from '@/components/auth/role-guard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={['ADMIN']} pageTitle="Pusat Moderasi Admin Hub">
      {children}
    </RoleGuard>
  );
}
