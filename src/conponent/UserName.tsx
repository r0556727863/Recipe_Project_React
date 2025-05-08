import { useContext } from "react"
import { Avatar, Box, Typography } from "@mui/material"
import { UserContext } from "./context/UserContext"

export const UserName = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("UserName must be used within a UserProvider")
  }
  const { state } = context

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Avatar
        sx={{
          bgcolor: "#D19A9A",
          width: 36,
          height: 36,
          fontWeight: "bold",
          fontSize: "1rem",
        }}
      >
        {state.Name ? state.Name.charAt(0).toUpperCase() : "G"}
      </Avatar>
      <Typography
        variant="subtitle1"
        sx={{
          color: "white",
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        {state.Name || "אורח"}
      </Typography>
    </Box>
  )
}
