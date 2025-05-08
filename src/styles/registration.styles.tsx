export const RegistrationStyles = {
    registerButton: {
      bgcolor: "rgba(255, 255, 255, 0.2)",
      color: "white",
      "&:hover": {
        bgcolor: "rgba(255, 255, 255, 0.3)",
      },
    },
    modalContainer: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1300,
    },
    modalBackdrop: {
        position: "fixed" as "fixed", // הוספת סוג
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: -1,
      },
      
      modalContent: {
        width: "90%",
        maxWidth: "400px", // מצמצם רוחב – נראה קומפקטי
        padding: "24px",
        overflow: "visible", // אין גלילה
      },      

    modalBox: {
      padding: 3,
      width: "100%",
      backgroundColor: "white",
      borderRadius: 4,
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      background: "linear-gradient(135deg, #fff 0%, #fff5f5 100%)",
      position: "relative",
      overflow: "hidden",
    },
    decorativeElement1: {
      position: "absolute",
      top: -30,
      right: -30,
      width: 120,
      height: 120,
      borderRadius: "50%",
      background: "linear-gradient(45deg, #FF9A9E 0%, #FAD0C4 99%, #FAD0C4 100%)",
      opacity: 0.3,
      zIndex: 0,
    },
    decorativeElement2: {
      position: "absolute",
      bottom: -40,
      left: -40,
      width: 150,
      height: 150,
      borderRadius: "50%",
      background: "linear-gradient(45deg, #FF9A9E 0%, #FAD0C4 99%, #FAD0C4 100%)",
      opacity: 0.3,
      zIndex: 0,
    },
    formContainer: {
      position: "relative",
      zIndex: 1,
    },
    formTitle: {
      mb: 3,
      textAlign: "center",
      color: "#FF9A9E",
      fontWeight: "bold",
    },
    formField: {
      opacity: 1,
      transform: "translateX(0)",
      transition: "opacity 0.3s, transform 0.3s",
    },
    textField: {
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
    },
    passwordStrengthBar: {
      height: 4,
      flexGrow: 1,
      borderRadius: 2,
      bgcolor: "grey.300",
      position: "relative",
      overflow: "hidden",
    },
    passwordStrengthIndicator: (strength: number) => ({
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: `${(strength / 5) * 100}%`,
      bgcolor: strength <= 2 ? "#f44336" : strength <= 4 ? "#ff9800" : "#4caf50",
      transition: "width 0.3s",
    }),
    submitButton: {
      background: "linear-gradient(45deg, #FF9A9E 0%, #FAD0C4 99%, #FAD0C4 100%)",
      color: "white",
      padding: 1.5,
      boxShadow: "0 4px 15px rgba(255, 154, 158, 0.4)",
      "&:hover": {
        background: "linear-gradient(45deg, #FF9A9E 30%, #FAD0C4 90%)",
        boxShadow: "0 6px 20px rgba(255, 154, 158, 0.6)",
      },
    },
    loginLink: {
      color: "#FF9A9E",
      fontWeight: "bold",
      textDecoration: "none",
      "&:hover": { textDecoration: "underline" },
    },
  }
  