import { HashRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import { BudgetProvider } from "./context/BudgetContext";
import AppRoutes from "./AppRoutes";
import { PortfolioProvider } from "./context/PortfolioContext";

function App() {
  return (
    <ThemeContextProvider>
      <HashRouter>
        <AuthProvider>
            <BudgetProvider>
              <AppRoutes />
            </BudgetProvider>
        </AuthProvider>
      </HashRouter>
    </ThemeContextProvider>  
  );
}

export default App;



