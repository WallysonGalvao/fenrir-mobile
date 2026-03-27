import { createContext, useContext } from 'react';

type DrawerLayoutContextValue = {
  isCollapsed: boolean;
  toggleCollapse: () => void;
};

const DrawerLayoutContext = createContext<DrawerLayoutContextValue | null>(null);

type DrawerLayoutProviderProps = DrawerLayoutContextValue & {
  children: React.ReactNode;
};

export function DrawerLayoutProvider({
  children,
  isCollapsed,
  toggleCollapse,
}: DrawerLayoutProviderProps) {
  return (
    <DrawerLayoutContext.Provider value={{ isCollapsed, toggleCollapse }}>
      {children}
    </DrawerLayoutContext.Provider>
  );
}

export function useDrawerLayout() {
  const context = useContext(DrawerLayoutContext);

  if (!context) {
    throw new Error('useDrawerLayout must be used within DrawerLayoutProvider');
  }

  return context;
}
