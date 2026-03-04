import React from "react";
import { Card, CardContent, Typography, LinearProgress } from "@mui/material";

function BudgetCard({ budget }) {
  const percentage = Math.min((budget.spent / budget.limit) * 100, 100);

  return (
    <Card sx={{ width: 250 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {budget.name}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          ${budget.spent} / ${budget.limit}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={percentage}
          color={percentage >= 100 ? "error" : "primary"}
        />
      </CardContent>
    </Card>
  );
}

export default BudgetCard;