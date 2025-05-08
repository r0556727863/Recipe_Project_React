const styles = {
    container: {
      position: "relative",
      minHeight: "100vh",
      py: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    background: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      zIndex: -2,
      filter: "brightness(0.9)",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(135deg, rgba(245, 169, 184, 0.7) 0%, rgba(169, 222, 245, 0.7) 100%)`,
      zIndex: -1,
    },
    contentContainer: {
      position: "relative",
      zIndex: 1,
    },
    paper: {
      p: 4,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderRadius: 4,
      background: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(10px)",
    },
    avatar: {
      m: 1,
      bgcolor: "#ff758c",
      width: 70,
      height: 70,
    },
    avatarIcon: {
      fontSize: 40,
    },
    title: {
      fontWeight: "bold",
      color: "#333",
    },
    form: {
      width: "100%",
    },
    textField: {
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
      },
    },
    alert: {
      mt: 2,
    },
    submitButton: {
      mt: 3,
      borderRadius: 2,
      py: 1.5,
      background: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
    },
    registerLink: {
      textAlign: "center",
      mt: 2,
    },
    link: {
      color: "#ff758c",
      fontWeight: "bold",
    },
  }
  
  export default styles
  