'use client';

import { useState, useEffect } from 'react';

export function useCompany() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const workspaceCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('os_active_workspace='));
    
    if (workspaceCookie) {
      setCompanyId(workspaceCookie.split('=')[1]);
    }
    setLoading(false);
  }, []);

  return { companyId, loading };
}
