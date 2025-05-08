export const LogoStyles = {
    container: (isHovered: boolean, isPressed: boolean) => ({
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      transform: isHovered ? "scale(1.1)" : isPressed ? "scale(0.9)" : "scale(1)",
      transition: "transform 0.3s ease",
    }),
    iconContainer: (isHovered: boolean) => ({
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: "linear-gradient(45deg, #FF9A9E 0%, #FAD0C4 99%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 15px rgba(255, 154, 158, 0.4)",
      transform: isHovered ? "rotate(10deg)" : "rotate(0deg)",
      transition: "transform 0.3s ease",
    }),
    text: {
      fontWeight: "bold",
      background: "linear-gradient(45deg, #FF9A9E 30%, #FAD0C4 90%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textShadow: "0px 2px 4px rgba(0,0,0,0.1)",
      letterSpacing: "0.5px",
    },
  }
  