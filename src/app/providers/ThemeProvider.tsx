import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { Appearance } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getPalette, Palette } from '../../theme';

type ThemeContextValue = {
  dark: boolean;
  c: Palette;
  toggleDark: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  dark: false,
  c: getPalette(false),
  toggleDark: () => {},
});

const STORAGE_KEY = 'dark_mode';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let mounted = true;
    SecureStore.getItemAsync(STORAGE_KEY)
      .then((raw) => {
        if (!mounted) return;
        if (raw !== null) setDark(JSON.parse(raw));
        else setDark(Appearance.getColorScheme() === 'dark');
      })
      .catch(() => {
        if (mounted) setDark(Appearance.getColorScheme() === 'dark');
      });

    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      SecureStore.getItemAsync(STORAGE_KEY).then((raw) => {
        if (mounted && raw === null) setDark(colorScheme === 'dark');
      });
    });
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      dark,
      c: getPalette(dark),
      toggleDark: () => {
        setDark((prev) => {
          const next = !prev;
          SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
          return next;
        });
      },
    }),
    [dark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
