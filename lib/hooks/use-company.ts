'use client';

import { useState, useEffect } from 'react';

export function useCompany() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const workspaceCookie = cookies.find(c => c.trim().startsWith('os_active_workspace='));
    
    if (workspaceCookie) {
      setCompanyId(workspaceCookie.trim().split('=')[1]);
    }
    setLoading(false);
  }, []);

  return { companyId, loading };
}
