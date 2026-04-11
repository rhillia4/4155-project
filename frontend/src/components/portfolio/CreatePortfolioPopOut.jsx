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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!portfolioName.trim()) return;

    try {
      const newPortfolio = await createPortfolio({
        name: portfolioName,
      });
      setPortfolio(newPortfolio);
      setPortfolioName("");
      onClose();

    } catch (error) {
      console.error("Error creating portfolio:", error);
    }
  };
  
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
        <Box component="form" onSubmit={(e) => handleSubmit(e)}>
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

          <DialogActions sx={{ mt: 2, px: 0 }}>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePortfolioPopOut;
