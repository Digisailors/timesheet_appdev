'use client';
import { useEffect } from 'react';
import { usePageTitle } from '@/contexts/PageTitleContext';

interface PageTitleProps {
  title: string;
}

export default function PageTitle({ title }: PageTitleProps) {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  return null; // This component doesn't render anything
}
