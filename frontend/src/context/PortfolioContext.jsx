import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {

    const [mode, setMode] = useState(
        localStorage.getItem("mode") || "REAL"
    );
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(false);

    const switchMode = (newMode) => {
        setMode(newMode);
        localStorage.setItem("mode", newMode);
        setPortfolio(null); // force reload
    };

    
    return (
        <PortfolioContext.Provider
        value={{
            mode,
            portfolio,
            loading,
            switchMode,
            setPortfolio,
        }}
        >
        {children}
        </PortfolioContext.Provider>
    );
}

export const usePortfolioContext = () => useContext(PortfolioContext);
