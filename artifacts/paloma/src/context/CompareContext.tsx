import { createContext, useContext, useState, ReactNode } from "react";

interface CompareContextType {
  compareIds: number[];
  addToCompare: (id: number) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  isInCompare: (id: number) => boolean;
}

const CompareContext = createContext<CompareContextType>({
  compareIds: [],
  addToCompare: () => {},
  removeFromCompare: () => {},
  clearCompare: () => {},
  isInCompare: () => false,
});

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<number[]>([]);

  const addToCompare = (id: number) => {
    setCompareIds(prev => {
      if (prev.includes(id) || prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const removeFromCompare = (id: number) => {
    setCompareIds(prev => prev.filter(i => i !== id));
  };

  const clearCompare = () => setCompareIds([]);

  const isInCompare = (id: number) => compareIds.includes(id);

  return (
    <CompareContext.Provider value={{ compareIds, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
