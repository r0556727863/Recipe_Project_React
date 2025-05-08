import { Link } from "react-router-dom"
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material"
import HomeIcon from "@mui/icons-material/Home"
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"

interface NavbarProps {
  isLoggedIn: boolean
}

const Navbar = ({ isLoggedIn }: NavbarProps) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "#D19A9A",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        height: "64px",
      }}
    >
      <Toolbar sx={{ height: "100%", display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            display: { xs: "none", md: "block" },
            fontWeight: "bold",
            color: "white",
          }}
        >
          אתר המתכונים
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            color="inherit"
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            sx={{
              color: "#ffffff",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            דף הבית
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/RecipeList"
            startIcon={<RestaurantMenuIcon />}
            sx={{
              color: "#ffffff",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            מתכונים
          </Button>

          {isLoggedIn && (
            <Button
              color="inherit"
              component={Link}
              to="/AddRecipe"
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                color: "#ffffff",
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
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
