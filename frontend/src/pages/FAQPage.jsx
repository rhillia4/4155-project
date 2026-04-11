// pages/FAQ.jsx
import { Box, Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function FAQPage() {
  return (
    <Box sx={{ p: 4, maxWidth: 900, margin: "0 auto" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Frequently Asked Questions
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>How do I create a portfolio?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Click the "Create New Portfolio" button on the Portfolio page and
            fill in the required details.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Why is my portfolio empty?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            A new portfolio starts empty. You need to add holdings or wait for
            transactions to populate data.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Why do stock prices change?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Stock prices are fetched from a live market API and update based on
            current market conditions.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Can I delete a portfolio?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes, portfolios can be deleted, but this action is permanent and
            removes all associated data.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="body2">
            Still have questions? Contact support or check back for updates.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default FAQPage;