import { Box, Typography, Button, Container, Grid, Card, CardContent, CardMedia } from "@mui/material"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "./context/UserContext"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import StarIcon from "@mui/icons-material/Star"

const Home = () => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error("Home must be used within a UserProvider")
  }

  const { state } = context
  const isLoggedIn = !!state.Id

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
            p: 4,
            borderRadius: 3,
            backgroundColor: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: "#D19A9A",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            אתר המתכונים שלנו
          </Typography>

          <Typography
            variant="h5"
            sx={{
              color: "#666",
              mb: 4,
            }}
          >
            ברוכים הבאים לאתר המתכונים! כאן תמצאו מגוון רחב של מתכונים טעימים ומיוחדים
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mb: 4 }}>
            <Button
              component={Link}
              to="/RecipeList"
              variant="contained"
              size="large"
              startIcon={<RestaurantIcon />}
              sx={{
                bgcolor: "#D19A9A",
                color: "white",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                "&:hover": {
                  bgcolor: "#C48B8B",
                },
              }}
            >
              צפה במתכונים
            </Button>

            {isLoggedIn && (
              <Button
                component={Link}
                to="/AddRecipe"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "#D19A9A",
                  color: "#D19A9A",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  "&:hover": {
                    borderColor: "#C48B8B",
                    bgcolor: "rgba(209, 154, 154, 0.1)",
                  },
                }}
              >
                הוסף מתכון חדש
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", borderRadius: 2 }}>
              
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <RestaurantIcon sx={{ color: "#D19A9A", mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
                    מתכונים מגוונים
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  מצאו מתכונים לכל סוגי הארוחות, מנות עיקריות, קינוחים, ומאפים. אצלנו תוכלו למצוא מתכונים לכל טעם ולכל
                  אירוע.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <StarIcon sx={{ color: "#D19A9A", mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
                    שתפו את היצירות שלכם
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  הוסיפו את המתכונים האהובים עליכם ושתפו אותם עם הקהילה. תוכלו לערוך ולשפר את המתכונים שלכם בכל עת.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AccessTimeIcon sx={{ color: "#D19A9A", mr: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
                    קל לשימוש
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ color: "#666" }}>
                  ממשק ידידותי למשתמש המאפשר חיפוש, סינון וניהול מתכונים בקלות. מצאו בדיוק את המתכון שאתם מחפשים
                  במהירות.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Home
