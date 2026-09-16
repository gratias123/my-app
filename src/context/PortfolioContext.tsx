import React, { createContext, useContext } from 'react';
import { CustomPortfolioData } from '../types/portfolioBuilder';
import { SEMAKO_MODEL_DATA } from '../utils/portfolioModelAdapter';

interface PortfolioContextValue {
  data: CustomPortfolioData;
  isCustom: boolean;
  onOpenPrint: () => void;
  onOpenBuilder: () => void;
  onViewOriginalModel?: () => void;
}

const PortfolioContext = createContext<PortfolioContextValue>({
  data: SEMAKO_MODEL_DATA,
  isCustom: false,
  onOpenPrint: () => {},
  onOpenBuilder: () => {},
});

export const PortfolioProvider: React.FC<{
  value: PortfolioContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
