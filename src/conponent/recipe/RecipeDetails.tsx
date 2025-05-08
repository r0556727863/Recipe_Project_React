import { Typography, Box, Card, CardContent, Chip, Button, Divider, Grid } from "@mui/material"
import { recipeStore } from "../store/RecipeStore"
import { observer } from "mobx-react"
import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import AssignmentIcon from "@mui/icons-material/Assignment"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

const RecipeDetails = observer(() => {
  const selectedRecipe = recipeStore.selectedRecipe
  const navigate = useNavigate()
  const context = useContext(UserContext)
  const [imageError, setImageError] = useState(false)

  if (!context) {
    throw new Error("RecipeDetails must be used within a UserProvider")
  }

  const { state } = context

  if (!selectedRecipe) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Typography variant="h6" color="text.secondary" align="center">
          בחר מתכון מהרשימה כדי לצפות בפרטים
        </Typography>
      </Box>
    )
  }

  const canEdit = state.Id === selectedRecipe.UserId

  const handleEdit = () => {
    navigate(`/edit-recipe/${selectedRecipe.Id}`)
  }

  const handleDelete = () => {
    recipeStore.deleteRecipe(selectedRecipe.Id, state.Id)
    navigate("/RecipeList")
  }

  const getDifficultyText = (difficulty: number | string) => {
    if (typeof difficulty === "number") {
      return ["קלה", "בינונית", "קשה"][difficulty - 1] || difficulty
    }
    return difficulty
  }

  const placeholderImage = "/placeholder.svg?height=400&width=800"
  const imageUrl =
    selectedRecipe.Img && selectedRecipe.Img.startsWith("http") && !imageError ? selectedRecipe.Img : placeholderImage

  return (
    <Card
      sx={{
        maxWidth: "100%",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Completely redesigned image container */}
      <div style={{ width: "100%", position: "relative", paddingTop: "50%" }}>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={selectedRecipe.Name}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={() => setImageError(true)}
        />
      </div>

      <CardContent sx={{ p: 3, flexGrow: 1, overflow: "auto" }}>
        <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="#333" dir="rtl">
            {selectedRecipe.Name}
          </Typography>

          {canEdit && (
            <Box>
              <Button
                startIcon={<EditIcon />}
                onClick={handleEdit}
                variant="outlined"
                size="small"
                sx={{ mr: 1 }}
                color="primary"
              >
                עריכה
              </Button>
              <Button startIcon={<DeleteIcon />} onClick={handleDelete} variant="outlined" size="small" color="error">
                מחיקה
              </Button>
            </Box>
          )}
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph dir="rtl" sx={{ mb: 3 }}>
          {selectedRecipe.Description}
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <Chip
            icon={<AccessTimeIcon />}
            label={`זמן הכנה: ${selectedRecipe.Duration} דקות`}
            variant="outlined"
            color="primary"
          />
          <Chip
            icon={<AssignmentIcon />}
            label={`רמת קושי: ${getDifficultyText(selectedRecipe.Difficulty)}`}
            variant="outlined"
            color="secondary"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" fontWeight="bold" color="#333" dir="rtl" sx={{ mb: 2 }}>
          מרכיבים:
        </Typography>

        <Grid container spacing={1} sx={{ mb: 3 }}>
          {Array.isArray(selectedRecipe.Ingridents) && selectedRecipe.Ingridents.length > 0 ? (
            selectedRecipe.Ingridents.map((ingredient, index) => (
              <Grid item xs={12} key={index}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    backgroundColor: "rgba(0,0,0,0.03)",
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
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                לא נמצאו מרכיבים.
              </Typography>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" fontWeight="bold" color="#333" dir="rtl" sx={{ mb: 2 }}>
          הוראות הכנה:
        </Typography>

        {Array.isArray(selectedRecipe.Instructions) && selectedRecipe.Instructions.length > 0 ? (
          <Box component="ol" sx={{ pl: 2, direction: "rtl" }}>
            {selectedRecipe.Instructions.map((instruction, index) => (
              <Box
                component="li"
                key={index}
                sx={{
                  mb: 2,
                  p: 1.5,
                  borderRadius: 1,
                  backgroundColor: "rgba(0,0,0,0.03)",
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
      </CardContent>
    </Card>
  )
})

export default RecipeDetails
