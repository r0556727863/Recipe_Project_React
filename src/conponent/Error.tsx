import { Alert, Snackbar } from "@mui/material"

interface ErrorSnackbarProps {
  error: any
  open: boolean
  onClose: () => void
}

const ErrorSnackbar = ({ error, open, onClose }: ErrorSnackbarProps) => {
  const getErrorMessage = () => {
    if (!error) {
      return "אירעה שגיאה לא צפויה."
    }

    if (typeof error === "string") {
      return error
    }

    if (!error.response) {
      return "אירעה שגיאה לא צפויה."
    }

    switch (error.response?.status) {
      case 400:
        return "שגיאה: פרטים לא תקינים, נסה שנית."
      case 401:
        return "שגיאה: אין הרשאה לגשת למשאב זה."
      case 403:
        return "שגיאה: הגישה נדחתה."
      case 500:
        return "שגיאת שרת, נסה שנית מאוחר יותר."
      default:
        return "אירעה שגיאה לא צפויה."
    }
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity="error"
        variant="filled"
        sx={{
          width: "100%",
          fontWeight: "bold",
        }}
        onClose={onClose}
      >
        {getErrorMessage()}
      </Alert>
    </Snackbar>
  )
}

export default ErrorSnackbar
