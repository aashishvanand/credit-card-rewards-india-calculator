import { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  CircularProgress,
  Box,
  useTheme,
  Alert,
} from "@mui/material";
import CreditCardItem from "./CreditCardItem";
import useCardImagesData from "../../../core/hooks/useCardImagesData";

const CardList = ({ cards, onDeleteCard }) => {
  const theme = useTheme();
  const { cardImagesData, isLoading, error } = useCardImagesData();
  const [horizontalCards, setHorizontalCards] = useState([]);
  const [verticalCards, setVerticalCards] = useState([]);

  useEffect(() => {
    if (cardImagesData.length > 0) {
      const horizontal = [];
      const vertical = [];

      cards.forEach((card) => {
        if (card && card.bank && card.cardName) {
          const cardDetails = cardImagesData.find(
            (item) =>
              item.bank.toLowerCase() === card.bank.toLowerCase() &&
              item.cardName.toLowerCase() === card.cardName.toLowerCase()
          );

          if (cardDetails) {
            if (cardDetails.orientation === "horizontal") {
              horizontal.push(card);
            } else {
              vertical.push(card);
            }
          }
        }
      });

      setHorizontalCards(horizontal);
      setVerticalCards(vertical);
    }
  }, [cards, cardImagesData]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error loading card data. Please try again later.
      </Alert>
    );
  }

  if (cards.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          px: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            fontWeight: "medium",
          }}
        >
          You haven&apos;t added any cards yet. Click &quot;Add New Card&quot;
          to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {horizontalCards.length > 0 && (
        <Grid container spacing={2}>
          {horizontalCards.map((card) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={`${card.bank}_${card.cardName}`}
            >
              <CreditCardItem
                card={card}
                onDelete={() => onDeleteCard(card.bank, card.cardName)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {verticalCards.length > 0 && (
        <Grid container spacing={2} sx={{ mt: horizontalCards.length ? 4 : 0 }}>
          {verticalCards.map((card) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={2}
              key={`${card.bank}_${card.cardName}`}
            >
              <CreditCardItem
                card={card}
                onDelete={() => onDeleteCard(card.bank, card.cardName)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CardList;