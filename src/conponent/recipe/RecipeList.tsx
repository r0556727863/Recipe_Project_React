import type React from "react"
import { useEffect, useState, useContext } from "react"
import {
  Box,
  Typography,
  List,
  ListItemButton,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
} from "@mui/material"
import axios from "axios"
import ErrorSnackbar from "../Error"
import { UserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import { recipeStore } from "../store/RecipeStore"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import SearchIcon from "@mui/icons-material/Search"
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import { observer } from "mobx-react"
import RecipeModal from "./RecipeModel"

const RecipeList = observer(() => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [durationFilter, setDurationFilter] = useState<number | "">("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("")
  const [userFilter, setUserFilter] = useState<string>("")

  const context = useContext(UserContext)
  if (!context) {
    throw new Error("RecipeList must be used within a UserProvider")
  }
  const { state } = context

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/category")
        setCategories(response.data)
      } catch (err) {
        console.error("Error fetching categories:", err)
      }
    }

    fetchCategories()
    recipeStore.getRecipe()
    setLoading(false)
  }, [])

  const handleEdit = (id: number, userId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    if (userId !== state?.Id) {
      alert("אין לך הרשאות לערוך מתכון זה.")
      return
    }
    navigate(`/edit-recipe/${id}`)
  }

  const handleDelete = (id: number, userId: number, event: React.MouseEvent) => {
    event.stopPropagation()
    if (userId !== state?.Id) {
      alert("אין לך הרשאות למחוק מתכון זה.")
      return
    }
    recipeStore.deleteRecipe(id, state.Id)
  }

  const handleRecipeClick = (recipe: any) => {
    recipeStore.selectRecipe(recipe)
    setModalOpen(true)
  }

  let filteredRecipes: any[] = []
  try {
    filteredRecipes = recipeStore.recipes.filter((recipe) => {
      // Apply search term filter
      const matchesSearch =
        searchTerm === "" ||
        (recipe.Name && recipe.Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (recipe.Description && recipe.Description.toLowerCase().includes(searchTerm.toLowerCase()))

      return (
        matchesSearch &&
        (categoryFilter === "" || (recipe.Categoryid && recipe.Categoryid.toString() === categoryFilter)) &&
        (durationFilter === "" || (recipe.Duration && recipe.Duration <= durationFilter)) &&
        (difficultyFilter === "" || (recipe.Difficulty && recipe.Difficulty.toString() === difficultyFilter)) &&
        (userFilter === "" || (recipe.UserId && recipe.UserId.toString() === userFilter))
      )
    })
  } catch (err) {
    console.error("Error filtering recipes:", err)
    filteredRecipes = recipeStore.recipes
  }

  const getDifficultyText = (difficulty: number | string) => {
    if (typeof difficulty === "number") {
      return ["קלה", "בינונית", "קשה"][difficulty - 1] || difficulty
    }
    return difficulty
  }

  return (
    <Box sx={{ p: 3, pt: 10 }}>
      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
              סינון מתכונים
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="חיפוש"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} />,
                    sx: { direction: "rtl" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>קטגוריה</InputLabel>
                  <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} label="קטגוריה">
                    <MenuItem value="">הכל</MenuItem>
                    {Array.isArray(categories)
                      ? categories.map((category) => (
                          <MenuItem key={category.Id} value={category.Id.toString()}>
                            {category.Name}
                          </MenuItem>
                        ))
                      : null}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="זמן הכנה (עד דקות)"
                  type="number"
                  size="small"
                  value={durationFilter}
                  onChange={(e) => setDurationFilter(e.target.value ? Number(e.target.value) : "")}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>רמת קושי</InputLabel>
                  <Select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    label="רמת קושי"
                  >
                    <MenuItem value="">הכל</MenuItem>
                    <MenuItem value="1">קלה</MenuItem>
                    <MenuItem value="2">בינונית</MenuItem>
                    <MenuItem value="3">קשה</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>נוצר על ידי</InputLabel>
                  <Select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} label="נוצר על ידי">
                    <MenuItem value="">הכל</MenuItem>
                    {state.Id > 0 && <MenuItem value={state.Id.toString()}>המתכונים שלי</MenuItem>}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recipe List and Details */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              backgroundColor: "#fff",
              height: "calc(100vh - 220px)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ p: 2, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
              <Typography variant="h6" fontWeight="bold" textAlign="center">
                רשימת מתכונים
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body1" color="error">
                  {error}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ overflow: "auto", flexGrow: 1, p: 1 }}>
                {filteredRecipes.length > 0 ? (
                  <List disablePadding>
                    {filteredRecipes.map((recipe) => (
                      <Card
                        key={recipe.Id}
                        sx={{
                          mb: 1.5,
                          borderRadius: 1.5,
                          overflow: "hidden",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          },
                          border:
                            recipeStore.selectedRecipe?.Id === recipe.Id
                              ? "2px solid #D19A9A"
                              : "1px solid rgba(0,0,0,0.08)",
                        }}
                      >
                        <CardContent sx={{ p: "12px !important" }}>
                          <ListItemButton
                            onClick={() => handleRecipeClick(recipe)}
                            sx={{
                              p: 0,
                              borderRadius: 1,
                            }}
                          >
                            <Box sx={{ width: "100%" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mb: 1,
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                  sx={{
                                    direction: "rtl",
                                    textAlign: "right",
                                    color: "#333",
                                  }}
                                >
                                  {recipe.Name || "מתכון לא ידוע"}
                                </Typography>

                                {state && recipe.UserId === state.Id && (
                                  <Box>
                                    <IconButton
                                      onClick={(e) => handleEdit(recipe.Id, recipe.UserId, e)}
                                      size="small"
                                      color="primary"
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      onClick={(e) => handleDelete(recipe.Id, recipe.UserId, e)}
                                      size="small"
                                      color="error"
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                )}
                              </Box>

                              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                <Chip
                                  icon={<AccessTimeIcon fontSize="small" />}
                                  label={`${recipe.Duration} דקות`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 24 }}
                                />
                                <Chip
                                  label={getDifficultyText(recipe.Difficulty)}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 24 }}
                                />
                              </Box>
                              <Box
                              sx={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                backgroundColor: "#D19A9A",
                                color: "white",
                                fontSize: "0.7rem",
                                padding: "2px 6px",
                                borderTopLeftRadius: 8,
                                fontWeight: "bold",
                              }}
                            >
                              לחץ לפרטים
                            </Box>
                            </Box>
                          </ListItemButton>
                        </CardContent>
                      </Card>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <Typography variant="body1" color="text.secondary">
                      לא נמצאו מתכונים.
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recipe Details - Redesigned */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              height: "calc(100vh - 220px)",
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              backgroundColor: "#fff",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              p: 4,
              textAlign: "center",
              background: "linear-gradient(135deg, #fff 0%, #f9f2f2 100%)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                maxWidth: 500,
              }}
            >
              <MenuBookIcon sx={{ fontSize: 80, color: "#D19A9A", mb: 3 }} />

              <Typography variant="h4" sx={{ color: "#D19A9A", fontWeight: "bold", mb: 2 }}>
                ספר המתכונים שלנו
              </Typography>

              <Typography variant="body1" sx={{ color: "#666", mb: 4, fontSize: "1.1rem" }}>
                בחרו מתכון מהרשימה כדי לצפות בפרטים המלאים, או הוסיפו מתכון חדש משלכם
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                {state.Id > 0 && (
                  <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => navigate("/AddRecipe")}
                    sx={{
                      bgcolor: "#D19A9A",
                      "&:hover": {
                        bgcolor: "#C48B8B",
                      },
                      px: 3,
                      py: 1,
                    }}
                  >
                    הוסף מתכון חדש
                  </Button>
                )}

                <Button
                  variant="outlined"
                  startIcon={<RestaurantMenuIcon />}
                  onClick={() => {
                    if (filteredRecipes.length > 0) {
                      handleRecipeClick(filteredRecipes[0])
                    }
                  }}
                  disabled={filteredRecipes.length === 0}
                  sx={{
                    borderColor: "#D19A9A",
                    color: "#D19A9A",
                    "&:hover": {
                      borderColor: "#C48B8B",
                      bgcolor: "rgba(209, 154, 154, 0.05)",
                    },
                    px: 3,
                    py: 1,
                  }}
                >
                  צפה במתכון אקראי
                </Button>
              </Box>

              <Box sx={{ mt: 6, width: "100%" }}>
                <Divider sx={{ mb: 3 }}>
                  <Chip label="טיפים למשתמש" sx={{ bgcolor: "#D19A9A", color: "white" }} />
                </Divider>

                <Box sx={{ textAlign: "right", color: "#666" }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • לחצו על מתכון ברשימה כדי לצפות בפרטים המלאים
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • השתמשו בסינון כדי למצוא מתכונים לפי קטגוריה, זמן הכנה או רמת קושי
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    • המתכונים שלכם מסומנים עם אפשרויות עריכה ומחיקה
                  </Typography>
                  <Typography variant="body2">• הוסיפו מתכונים חדשים בקלות באמצעות לחצן "הוסף מתכון חדש"</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recipe Modal */}
      <RecipeModal open={modalOpen} onClose={() => setModalOpen(false)} recipe={recipeStore.selectedRecipe} />

      <ErrorSnackbar error={error} open={openSnackbar} onClose={() => setOpenSnackbar(false)} />
    </Box>
  )
})

export default RecipeList