import { styled, TextField, FormControl } from "@mui/material"

// Styled components for better form styling
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#FF9A9E",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FF9A9E",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#FF9A9E",
  },
  "& .MuiInputLabel-root": {
    background: "white",
    padding: "0 5px",
  },
}))

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#FF9A9E",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FF9A9E",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#FF9A9E",
  },
  "& .MuiInputLabel-root": {
    background: "white",
    padding: "0 5px",
  },
}))

export const AddRecipeStyles = {
  StyledTextField,
  StyledFormControl,
  card: {
    maxWidth: 600,
    mx: "auto",
    borderRadius: 4,
    boxShadow: "0 10px 30px rgba(255, 154, 158, 0.2)",
    overflow: "visible",
    background: "linear-gradient(135deg, #fff 0%, #fff5f5 100%)",
    position: "relative",
  },
  decorativeElement1: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "linear-gradient(45deg, #FF9A9E 0%, #FAD0C4 99%, #FAD0C4 100%)",
    opacity: 0.3,
    zIndex: 0,
  },
  decorativeElement2: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: "50%",
    background: "linear-gradient(45deg, #FF9A9E 0%, #FAD0C4 99%, #FAD0C4 100%)",
    opacity: 0.3,
    zIndex: 0,
  },
  cardContent: {
    p: { xs: 2, sm: 3 },
    position: "relative",
    zIndex: 1,
  },
  cardTitle: {
    mb: 3,
    textAlign: "center",
    color: "#FF9A9E",
    fontWeight: "bold",
  },
  stepLabel: (activeStep: number, index: number) => ({
    "& .MuiStepLabel-label": {
      color: activeStep === index ? "#FF9A9E" : "inherit",
      fontWeight: activeStep === index ? "bold" : "normal",
    },
    "& .MuiStepIcon-root": {
      color: activeStep === index ? "#FF9A9E" : "rgba(0, 0, 0, 0.38)",
    },
  }),
  primaryButton: {
    background: "linear-gradient(45deg, #FF9A9E 0%, #FAD0C4 99%, #FAD0C4 100%)",
    color: "white",
    mr: 1,
    boxShadow: "0 4px 15px rgba(255, 154, 158, 0.4)",
    "&:hover": {
      background: "linear-gradient(45deg, #FF9A9E 30%, #FAD0C4 90%)",
      boxShadow: "0 6px 20px rgba(255, 154, 158, 0.6)",
    },
  },
  addButton: {
    borderColor: "#FF9A9E",
    color: "#FF9A9E",
    "&:hover": {
      borderColor: "#FF9A9E",
      backgroundColor: "rgba(255, 154, 158, 0.1)",
    },
  },
  ingredientsPaper: {
    p: 2,
    borderRadius: 2,
    backgroundColor: "rgba(255, 154, 158, 0.05)",
    mb: 2,
    maxHeight: "200px",
    overflowY: "auto",
  },
  ingredientItem: (index: number, length: number) => ({
    display: "flex",
    gap: 1,
    mb: index < length - 1 ? 1.5 : 0,
    alignItems: "center",
    flexDirection: { xs: "column", sm: "row" },
  }),
  instructionsPaper: {
    p: 2,
    borderRadius: 2,
    backgroundColor: "rgba(255, 154, 158, 0.05)",
    mb: 2,
    maxHeight: "200px",
    overflowY: "auto",
  },
  instructionItem: {
    display: "flex",
    gap: 1,
    mb: 1.5,
    alignItems: "center",
  },
}
