import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import { useContext, useEffect, useState } from "react"
import { Box, Button, Container } from "@mui/material"
import { Login } from "./Login"
import { Register } from "./Registration"
import { UserName } from "./UserName"
import { UserContext } from "./context/UserContext"
import LogoutIcon from "@mui/icons-material/Logout"

const AppLayout = () => {
  const navigate = useNavigate()
  const context = useContext(UserContext)

  if (!context) {
    throw new Error("AppLayout must be used within a UserProvider")
  }

  const { state, dispatch } = context
  const [isLoggedIn, setIsLoggedIn] = useState(!!state.Id)

  useEffect(() => {
    setIsLoggedIn(!!state.Id)
  }, [state.Id])

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    dispatch({ type: "RESET_USER" })
    setIsLoggedIn(false)
    navigate("/")
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Navbar isLoggedIn={isLoggedIn} />

      <Box
        sx={{
          position: "fixed",
          top: 10,
          left: 10,
          zIndex: 1100,
          display: "flex",
          alignItems: "center",
          gap: 1,
          p: 1,
          borderRadius: 2,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(5px)",
        }}
      >
        {isLoggedIn ? (
          <>
            <UserName />
            <Button
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              variant="contained"
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.3)",
                },
              }}
            >
              התנתק
            </Button>
          </>
        ) : (
          <>
            <Login onLoginSuccess={handleLoginSuccess} />
            <Register />
          </>
        )}
      </Box>

      <Container maxWidth="xl" sx={{ flexGrow: 1, pt: 8, pb: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}

export default AppLayout
