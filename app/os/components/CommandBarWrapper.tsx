'use client';

import { useState, useEffect } from 'react';
import CommandBar from './CommandBar';

export default function CommandBarWrapper() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, []);

  if (!open) return null;
  return <CommandBar onClose={() => setOpen(false)} />;
}
