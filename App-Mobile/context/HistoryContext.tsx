import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TransactionType = 'withdrawal' | 'transfer';

export interface HistoryItem {
  id: string;
  type: TransactionType;
  amount: string;
  target: string; 
  operator: string;
  date: number; 
}

interface HistoryContextType {
  history: HistoryItem[];
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
  clearHistory: () => void;
  isLoading: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);
const STORAGE_KEY = '@transaction_history';

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Vérification de la présence du module natif
  const hasAsyncStorage = !!AsyncStorage?.getItem;

  useEffect(() => {
    const loadHistory = async () => {
      if (!hasAsyncStorage) {
        console.warn("AsyncStorage n'est pas lié nativement. L'historique sera temporaire.");
        setIsLoading(false);
        return;
      }
      try {
        const savedHistory = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Erreur chargement historique:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, [hasAsyncStorage]);

  useEffect(() => {
    if (!isLoading && hasAsyncStorage) {
      const saveHistory = async () => {
        try {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (error) {
          console.error('Erreur sauvegarde historique:', error);
        }
      };
      saveHistory();
    }
  }, [history, isLoading, hasAsyncStorage]);

  const addHistoryItem = (item: Omit<HistoryItem, 'id' | 'date'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      date: Date.now(),
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <HistoryContext.Provider value={{ history, addHistoryItem, clearHistory, isLoading }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
