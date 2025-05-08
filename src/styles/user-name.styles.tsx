export const UserNameStyles = {
    container: {
      display: "flex",
      alignItems: "center",
    },
    avatar: {
      width: 40,
      height: 40,
      fontWeight: "bold",
      fontSize: "1.2rem",
      cursor: "pointer",
      background: "linear-gradient(45deg, #FF9A9E 0%, #FAD0C4 99%, #FAD0C4 100%)",
      boxShadow: "0 4px 10px rgba(255, 154, 158, 0.3)",
    },
    menuPaper: {
      overflow: "visible",
      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
      mt: 1.5,
      borderRadius: 2,
      minWidth: 180,
      "& .MuiAvatar-root": {
        width: 32,
        height: 32,
        ml: -0.5,
        mr: 1,
      },
    },
    userInfo: {
      px: 2,
      py: 1,
      textAlign: "center",
    },
  }
  