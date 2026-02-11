import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Input,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { usePortfolioContext } from "../../context/PortfolioContext";
import { usePortfolio } from "../../hooks/usePortfolio";
// #TODO: add input validation
function CreatePortfolioPopOut({ open, onClose }) {
  const { setPortfolio } = usePortfolioContext();
  const { createPortfolio } = usePortfolio();
  const [portfolioName, setPortfolioName] = useState("");
  const [portfolioType, setPortfolioType] = useState("REAL");
  const [isHosting, setIsHosting] = useState(false);
  const [game_id, setGameId] = useState(null);
  const [cashBalance, setCashBalance] = useState(10000);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newPortfolio = await createPortfolio({
        name: portfolioName,
        portfolio_type: portfolioType || "REAL", 
        game_id: game_id, // need to create
        cash_balance: 100000,
    });

      onClose();
      setPortfolioName(""); 

      requestAnimationFrame(() => {
        setPortfolio(newPortfolio);
      });
    } catch (error) {
      console.error("Error creating portfolio:", error);
    }
  };

  useEffect(() => {
    if (portfolioType === "PROP") {
      setIsHosting(true);
    } else {
      setIsHosting(false);
    }
  }, [portfolioType]);

  return (
    <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        disableRestoreFocus
    >      
      <DialogTitle>Create New Portfolio</DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <InputLabel htmlFor="portfolio-name">
            Portfolio Name
          </InputLabel>

          <Input
            id="portfolio-name"
            fullWidth
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            required
          />
          <InputLabel htmlFor="portfolio-type" sx={{ mt: 2 }}>
            Portfolio Type
          </InputLabel>
          <Select
            defaultValue="REAL"
            id="portfolio-type"
            fullWidth
            value={portfolioType}
            onChange={(e) => setPortfolioType(e.target.value)}
          >
            <MenuItem value="REAL">Real</MenuItem>
            <MenuItem value="PROP">Game</MenuItem>
          </Select>
          

          {portfolioType === "PROP" && (
            <>
                <Select
                id="is-hosting"
                fullWidth
                value={isHosting ? "true" : "false"}
                onChange={(e) => setIsHosting(e.target.value === "true")}
                sx={{ mt: 2 }}
                >
                <MenuItem value="true">Hosting</MenuItem>
                <MenuItem value="false">Joining</MenuItem>
                </Select>

                {isHosting ? (
                <>
                    <InputLabel htmlFor="cash-balance" sx={{ mt: 2 }}>
                    Initial Cash Balance (USD)
                    </InputLabel>
                    <Input
                    id="cash-balance"
                    fullWidth
                    type="number"
                    defaultValue={10000}
                    value={cashBalance}
                    onChange={(e) => setCashBalance(Number(e.target.value))}
                    required
                    />
                </>
                ) : (
                <>
                    <InputLabel htmlFor="game-id" sx={{ mt: 2 }}>
                    Game ID
                    </InputLabel>
                    <Input
                    id="game-id"
                    fullWidth
                    value={game_id || ""}
                    onChange={(e) => setGameId(e.target.value)}
                    required
                    />
                </>
                )}
            </>
            )}

          <DialogActions sx={{ mt: 2, px: 0 }}>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" 
              onClick={() => {
                requestAnimationFrame(() => {
                  onClose();
                  window.location.reload();
                });
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePortfolioPopOut;
