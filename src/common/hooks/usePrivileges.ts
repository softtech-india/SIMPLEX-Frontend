'use client'

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Privilege, Permissions } from '@/common/types/privilege.types';


function findPrivileges(
  privileges: Privilege[],
  path: string
): Privilege | null {
  for (const p of privileges) {

    if (
      p.path &&
      (path === p.path || path.startsWith(p.path + '/'))
    ) {
      return p;
    }

    if (p.items?.length) {
      const found = findPrivileges(p.items, path);
      if (found) return found;
    }
  }

  return null;
}

export function usePrivileges(customPath?: string): Permissions {
  const router = useRouter();
  const [privilege, setPrivilege] = useState<Privilege | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('userPriviledge');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      const list: Privilege[] = parsed.rawPriviledges || parsed;

      const path = (customPath || router.asPath).replace(/\/$/, '');
      const found = findPrivileges(list, path);

      setPrivilege(found);
    } catch (err) {
      console.error('Privilege parse error:', err);
      setPrivilege(null);
    }
  }, [router.asPath, customPath]);

  return useMemo(() => {
    if (!privilege) {
      return {
        canAdd: false,
        canEdit: false,
        canDelete: false,
        canView: false,
        canPrint: false,
        canExport: false,
        canEmail: false,
        hasAnyAccess: false,
      };
    }

    const permissions: Permissions = {
      canAdd: privilege.isadded === true,
      canEdit: privilege.isupdated === true,
      canDelete: privilege.isdeleted === true,
      canView: privilege.isviewed === true,
      canPrint: privilege.isprinted === true,
      canExport: privilege.isexported === true,
      canEmail: privilege.isemailed === true,
      hasAnyAccess:
        !!(
          privilege.isadded ||
          privilege.isupdated ||
          privilege.isdeleted ||
          privilege.isviewed ||
          privilege.isprinted ||
          privilege.isexported
        ),
    };

    return permissions;
  }, [privilege]);
}