"use client"

import { useState, useContext, useEffect } from "react"
import { Modal, Box, Typography, Button, IconButton, Chip, Divider, Grid, Paper } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import AssignmentIcon from "@mui/icons-material/Assignment"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { UserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import { recipeStore, type Recipise } from "../store/RecipeStore"

interface RecipeModalProps {
  open: boolean
  onClose: () => void
  recipe: Recipise | null
}

const RecipeModal = ({ open, onClose, recipe }: RecipeModalProps) => {
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)
  const [currentRecipe, setCurrentRecipe] = useState<Recipise | null>(null)
  const context = useContext(UserContext)

  // Update currentRecipe when recipe prop changes or modal opens
  useEffect(() => {
    if (open && recipe) {
      // Find the most up-to-date version of the recipe
      const freshRecipe = recipeStore.recipes.find((r) => r.Id === recipe.Id)
      if (freshRecipe) {
        setCurrentRecipe(JSON.parse(JSON.stringify(freshRecipe)))
      } else {
        setCurrentRecipe(JSON.parse(JSON.stringify(recipe)))
      }
    }
  }, [recipe, open])

  if (!context) {
    throw new Error("RecipeModal must be used within a UserProvider")
  }

  const { state } = context

  if (!currentRecipe) {
    return null
  }

  const canEdit = state.Id === currentRecipe.UserId

  const handleEdit = () => {
    navigate(`/edit-recipe/${currentRecipe.Id}`)
    onClose()
  }

  const handleDelete = () => {
    recipeStore.deleteRecipe(currentRecipe.Id, state.Id)
    onClose()
    navigate("/RecipeList")
  }

  const getDifficultyText = (difficulty: number | string) => {
    if (typeof difficulty === "number") {
      return ["קלה", "בינונית", "קשה"][difficulty - 1] || difficulty
    }
    return difficulty
  }

  const placeholderImage = "/placeholder.svg?height=300&width=500"
  const imageUrl =
    currentRecipe.Img && currentRecipe.Img.startsWith("http") && !imageError ? currentRecipe.Img : placeholderImage

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="recipe-modal-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "90%",
          maxWidth: 900,
          maxHeight: "90vh",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflow: "auto",
        }}
      >
        {/* Close button */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "error.main",
            bgcolor: "rgba(255,255,255,0.8)",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.9)",
            },
            zIndex: 10,
          }}
        >
          <CloseIcon />
        </IconButton>

        <Grid container spacing={3}>
          {/* Image and title section */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                width: "100%",
                height: 250,
                borderRadius: 2,
                overflow: "hidden",
                mb: 2,
              }}
            >
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={currentRecipe.Name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={() => setImageError(true)}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              <Chip
                icon={<AccessTimeIcon />}
                label={`זמן הכנה: ${currentRecipe.Duration} דקות`}
                variant="outlined"
                color="primary"
              />
              <Chip
                icon={<AssignmentIcon />}
                label={`רמת קושי: ${getDifficultyText(currentRecipe.Difficulty)}`}
                variant="outlined"
                color="secondary"
              />
            </Box>

            {canEdit && (
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Button startIcon={<EditIcon />} onClick={handleEdit} variant="outlined" size="small" color="primary">
                  עריכה
                </Button>
                <Button startIcon={<DeleteIcon />} onClick={handleDelete} variant="outlined" size="small" color="error">
                  מחיקה
                </Button>
              </Box>
            )}
          </Grid>

          {/* Recipe details section */}
          <Grid item xs={12} md={7}>
            <Typography
              id="recipe-modal-title"
              variant="h4"
              component="h2"
              fontWeight="bold"
              color="#333"
              dir="rtl"
              sx={{ mb: 2 }}
            >
              {currentRecipe.Name}
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph dir="rtl" sx={{ mb: 3 }}>
              {currentRecipe.Description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" fontWeight="bold" color="#333" dir="rtl" sx={{ mb: 2 }}>
              מרכיבים:
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "rgba(0,0,0,0.02)",
                mb: 3,
              }}
            >
              {Array.isArray(currentRecipe.Ingridents) && currentRecipe.Ingridents.length > 0 ? (
                currentRecipe.Ingridents.map((ingredient, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: index % 2 === 0 ? "rgba(0,0,0,0.01)" : "transparent",
                      mb: 1,
                      display: "flex",
                      justifyContent: "flex-start",
                      direction: "rtl",
                    }}
                  >
                    <Typography variant="body1">
                      {ingredient.Count} {ingredient.Type} {ingredient.Name}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  לא נמצאו מרכיבים.
                </Typography>
              )}
            </Paper>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" fontWeight="bold" color="#333" dir="rtl" sx={{ mb: 2 }}>
              הוראות הכנה:
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "rgba(0,0,0,0.02)",
              }}
            >
              {Array.isArray(currentRecipe.Instructions) && currentRecipe.Instructions.length > 0 ? (
                <Box component="ol" sx={{ pl: 2, direction: "rtl", m: 0 }}>
                  {currentRecipe.Instructions.map((instruction, index) => (
                    <Box
                      component="li"
                      key={index}
                      sx={{
                        mb: 2,
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: index % 2 === 0 ? "rgba(0,0,0,0.01)" : "transparent",
                      }}
                    >
                      <Typography variant="body1">{instruction.Name}</Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  לא נמצאו הוראות הכנה.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default RecipeModal
