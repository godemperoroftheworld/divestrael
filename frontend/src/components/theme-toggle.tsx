'use client';

import { useTheme } from 'next-themes';
import { Switch, SwitchProps } from '@headlessui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { noop } from 'lodash';

export default function ThemeToggle(props: SwitchProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = useMemo(() => resolvedTheme === 'dark', [resolvedTheme]);
  const toggleDarkMode = useCallback(() => {
    console.log('click: ' + resolvedTheme);
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const className =
    'group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition';

  if (!mounted) {
    return (
      <Switch
        {...props}
        className={className}
        checked={false}
        onChange={noop}>
        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
      </Switch>
    );
  }

  return (
    <Switch
      {...props}
      checked={isDarkMode}
      onChange={toggleDarkMode}
      className={className}>
      <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
    </Switch>
  );
}
