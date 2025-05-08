import type React from "react"
import { useContext, useState } from "react"
import { Avatar, Box, Tooltip, Menu, MenuItem, ListItemIcon, Typography } from "@mui/material"
import { UserContext } from "./context/UserContext"
import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { UserNameStyles } from "../styles/user-name.styles"

export const UserName = () => {
  const context = useContext(UserContext)
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  if (!context) {
    throw new Error("UserName must be used within a UserProvider")
  }
  const { state, dispatch } = context

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch({ type: "RESET_USER" })
    navigate("/")
    handleClose()
  }

  return (
    <Box sx={UserNameStyles.container}>
      <Tooltip title="לחץ לפתיחת תפריט" arrow>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Avatar onClick={handleClick} sx={UserNameStyles.avatar}>
            {state.Name ? state.Name.charAt(0).toUpperCase() : "א"}
          </Avatar>
        </motion.div>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: UserNameStyles.menuPaper,
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={UserNameStyles.userInfo}>
          <Typography variant="subtitle1" fontWeight="bold">
            {state.Name || "אורח"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {state.Email || ""}
          </Typography>
        </Box>
        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <LogOut size={18} color="#f44336" />
          </ListItemIcon>
          התנתק
        </MenuItem>
      </Menu>
    </Box>
  )
}
