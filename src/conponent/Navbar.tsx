import { Link } from "react-router-dom"
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material"
import HomeIcon from "@mui/icons-material/Home"
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import { NavbarStyles } from "../styles/navbar.styles"

interface NavbarProps {
  isLoggedIn: boolean
}

const Navbar = ({ isLoggedIn }: NavbarProps) => {
  return (
    <AppBar position="fixed" sx={NavbarStyles.appBar}>
      <Toolbar sx={NavbarStyles.toolbar}>
        <Typography variant="h5" component="div" sx={NavbarStyles.title}></Typography>

        <Box sx={NavbarStyles.buttonsContainer}>
          <Button color="inherit" component={Link} to="/" startIcon={<HomeIcon />} sx={NavbarStyles.navButton}>
            דף הבית
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/RecipeList"
            startIcon={<RestaurantMenuIcon />}
            sx={NavbarStyles.navButton}
          >
            מתכונים
          </Button>

          {isLoggedIn && (
            <Button
              color="inherit"
              component={Link}
              to="/AddRecipe"
              startIcon={<AddCircleOutlineIcon />}
              sx={NavbarStyles.navButton}
            >
              הוסף מתכון
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
