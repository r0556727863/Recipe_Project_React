import { Box, Typography } from "@mui/material"
import { useState } from "react"
import { LogoStyles } from "../styles/logo.styles"

const Logo = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <Box sx={LogoStyles.container(isHovered, isPressed)}>
        <Box sx={LogoStyles.iconContainer(isHovered)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C10.3431 2 9 3.34315 9 5V8H15V5C15 3.34315 13.6569 2 12 2Z"
              fill="white"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 8H9C7.89543 8 7 8.89543 7 10V21C7 21.5523 7.44772 22 8 22H16C16.5523 22 17 21.5523 17 21V10C17 8.89543 16.1046 8 15 8Z"
              fill="white"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M12 15V18" stroke="#FF9A9E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12H15" stroke="#FF9A9E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Box>
        <Typography variant="h5" sx={LogoStyles.text}>
          מתכונים
        </Typography>
      </Box>
    </div>
  )
}

export default Logo
