export const NavbarStyles = {
    appBar: {
      bgcolor: "#D0819C",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      height: "64px",
    },
    toolbar: {
      height: "100%",
      display: "flex",
      justifyContent: "space-between",
    },
    title: {
      display: { xs: "none", md: "block" },
      fontWeight: "bold",
      color: "white",
    },
    buttonsContainer: {
      display: "flex",
      gap: 1,
    },
    navButton: {
      color: "#ffffff",
      fontWeight: "bold",
      "&:hover": {
        bgcolor: "rgba(255, 255, 255, 0.1)",
      },
    },
  }
  