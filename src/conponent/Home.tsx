import { Box, Typography, Button, Container, Grid, Card, CardContent } from "@mui/material"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "./context/UserContext"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import StarIcon from "@mui/icons-material/Star"
import { motion } from "framer-motion"
import { HomeStyles } from "../styles/home.styles"

const Home = () => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error("Home must be used within a UserProvider")
  }

  const { state } = context
  const isLoggedIn = !!state.Id

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Box sx={HomeStyles.heroSection}>
              <Typography variant="h2" component="h1" sx={HomeStyles.heroTitle}>
                אתר המתכונים שלנו
              </Typography>

              <Typography variant="h5" sx={HomeStyles.heroSubtitle}>
                ברוכים הבאים לאתר המתכונים! כאן תמצאו מגוון רחב של מתכונים טעימים ומיוחדים
              </Typography>

              <Box sx={HomeStyles.buttonContainer}>
                <Button
                  component={Link}
                  to="/RecipeList"
                  variant="contained"
                  size="large"
                  startIcon={<RestaurantIcon />}
                  sx={HomeStyles.primaryButton}
                >
                  צפה במתכונים
                </Button>

                {isLoggedIn && (
                  <Button
                    component={Link}
                    to="/AddRecipe"
                    variant="outlined"
                    size="large"
                    sx={HomeStyles.secondaryButton}
                  >
                    הוסף מתכון חדש
                  </Button>
                )}
              </Box>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Card sx={HomeStyles.featureCard}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <RestaurantIcon sx={{ color: "#D19A9A", mr: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
                        מתכונים מגוונים
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: "#666" }}>
                      מצאו מתכונים לכל סוגי הארוחות, מנות עיקריות, קינוחים, ומאפים. אצלנו תוכלו למצוא מתכונים לכל טעם
                      ולכל אירוע.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Card sx={HomeStyles.featureCard}>
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
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Card sx={HomeStyles.featureCard}>
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
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  )
}

export default Home
