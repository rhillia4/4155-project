import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {

    const [portfolio, setPortfolio] = useState(null);
    
    return (
        <PortfolioContext.Provider
        value={{
            portfolio,
            setPortfolio,
        }}
        >
        {children}
        </PortfolioContext.Provider>
    );
}

export const usePortfolioContext = () => useContext(PortfolioContext);
