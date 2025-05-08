export const HomeStyles = {
    heroSection: {
      textAlign: "center",
      mb: 6,
      p: 4,
      borderRadius: 3,
      backgroundColor: "#fff",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      position: "relative",
      overflow: "hidden",
    },
    heroTitle: {
      color: "#D19A9A",
      fontWeight: "bold",
      mb: 2,
      textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
    },
    heroSubtitle: {
      color: "#666",
      mb: 4,
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: 3,
      mb: 4,
      flexWrap: "wrap",
    },
    primaryButton: {
      bgcolor: "#D19A9A",
      color: "white",
      px: 4,
      py: 1.5,
      fontSize: "1.1rem",
      transition: "transform 0.2s",
      "&:hover": {
        transform: "translateY(-3px)",
        bgcolor: "#D19A9A",
        boxShadow: "0 6px 15px rgba(209, 154, 154, 0.4)",
      },
    },
    secondaryButton: {
      borderColor: "#FF9A9E",
      color: "#D19A9A",
      px: 4,
      py: 1.5,
      fontSize: "1.1rem",
      transition: "transform 0.2s",
      "&:hover": {
        transform: "translateY(-3px)",
        borderColor: "#e57373",
        bgcolor: "rgba(209, 154, 154, 0.1)",
        boxShadow: "0 6px 15px rgba(209, 154, 154, 0.2)",
      },
    },
    featureCard: {
      height: "100%",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      borderRadius: 2,
      transition: "transform 0.3s, box-shadow 0.3s",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 8px 20px rgba(209, 154, 154, 0.3)",
      },
    },
  }
  