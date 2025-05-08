import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import { useContext, useEffect, useState } from "react"
import { Box, Container } from "@mui/material"
import { Login } from "./Login"
import { Register } from "./Registration"
import { UserName } from "./UserName"
import { UserContext } from "./context/UserContext"
import { motion } from "framer-motion"
import Logo from "./Logo"
import { AppLayoutStyles } from "../styles/app-layout.styles"
const AppLayout = () => {
  const navigate = useNavigate()
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("AppLayout must be used within a UserProvider")
  }
  const { state } = context
  const [isLoggedIn, setIsLoggedIn] = useState(!!state.Id)
  useEffect(() => {
    setIsLoggedIn(!!state.Id)
  }, [state.Id])
  
  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }
  return (
    <Box sx={AppLayoutStyles.container}>
      {/* אנימציות רקע של כלי מטבח */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 0.7,
            scale: [0.8, 1, 0.8],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            delay: i * 0.3,
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={AppLayoutStyles.kitchenUtensil(i)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d={AppLayoutStyles.kitchenUtensils[i % AppLayoutStyles.kitchenUtensils.length]}
              stroke="#FF9A9E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      ))}
      <Navbar isLoggedIn={isLoggedIn} />
      <Box sx={AppLayoutStyles.logoContainer}>
        <Logo />
        {isLoggedIn ? (
          <UserName />
        ) : (
          <>
            <Login onLoginSuccess={handleLoginSuccess} />
            <Register />
          </>
        )}
      </Box>

      <Container maxWidth="xl" sx={AppLayoutStyles.content}>
        <Outlet />
      </Container>
    </Box>
  )
}

export default AppLayout