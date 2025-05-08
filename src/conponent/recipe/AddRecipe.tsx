import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import ErrorSnackbar from "../Error"
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Grid,
  Paper,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  styled,
  Alert,
} from "@mui/material"
import { UserContext } from "../context/UserContext"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import { recipeStore } from "../store/RecipeStore"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

// הגדרת ממשק עבור הנתונים
interface RecipeForm {
  Name: string
  Img: string
  Duration: number
  Difficulty: number
  Description: string
  Ingridents: {
    Name: string
    Count: number | string
    Type: string
  }[]
  Instructions: {
    Name: string
  }[]
  UserId: number
  CategoryId: number
}

// Styled components for better form styling
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#D19A9A",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#D19A9A",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#D19A9A",
  },
  "& .MuiInputLabel-root": {
    background: "white",
    padding: "0 5px",
  },
}))

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#D19A9A",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#D19A9A",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#D19A9A",
  },
  "& .MuiInputLabel-root": {
    background: "white",
    padding: "0 5px",
  },
}))

const AddRecipe = () => {
  const navigate = useNavigate()
  const [error, setError] = useState<any>(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [nameError, setNameError] = useState<string | null>(null)

  const context = useContext(UserContext)
  if (!context) {
    throw new Error("AddRecipe must be used within a UserProvider")
  }
  const { state } = context

  useEffect(() => {
    // Use categories from the store
    setCategories(recipeStore.categories)

    if (recipeStore.categories.length === 0) {
      recipeStore.fetchCategories().then(() => {
        setCategories(recipeStore.categories)
      })
    }
  }, [])

  // הגדרת ערכי ברירת מחדל
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RecipeForm>({
    defaultValues: {
      Name: "",
      Img: "",
      Duration: 30,
      Difficulty: 1,
      Description: "",
      Ingridents: [{ Name: "", Count: 1, Type: "" }],
      Instructions: [{ Name: "" }],
      UserId: state.Id,
      CategoryId: 1,
    },
  })

  // Set default values explicitly to avoid controlled/uncontrolled warnings
  useEffect(() => {
    setValue("Name", "")
    setValue("Img", "")
    setValue("Duration", 30)
    setValue("Difficulty", 1)
    setValue("Description", "")
    setValue("CategoryId", 1)
  }, [setValue])

  const {
    fields: ingridents,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "Ingridents",
  })

  const {
    fields: instructions,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control,
    name: "Instructions",
  })

  // Watch the name field to validate in real-time
  const watchName = watch("Name")

  // Check for duplicate name when name changes
  useEffect(() => {
    if (watchName && watchName.trim() !== "") {
      const existingRecipe = recipeStore.recipes.find(
        (recipe) => recipe.Name.trim().toLowerCase() === watchName.trim().toLowerCase(),
      )

      if (existingRecipe) {
        setNameError("שם המתכון כבר קיים במערכת. אנא בחר שם אחר.")
      } else {
        setNameError(null)
      }
    } else {
      setNameError(null)
    }
  }, [watchName, recipeStore.recipes])

  const onSubmit: SubmitHandler<RecipeForm> = async (data) => {
    if (!state.Id) {
      alert("עליך להתחבר כדי להוסיף מתכון")
      navigate("/")
      return
    }

    // בדיקה אם שם המתכון כבר קיים
    const existingRecipe = recipeStore.recipes.find(
      (recipe) => recipe.Name.trim().toLowerCase() === data.Name.trim().toLowerCase(),
    )

    if (existingRecipe) {
      setNameError("שם המתכון כבר קיים במערכת. אנא בחר שם אחר.")
      return
    }

    setLoading(true)

    const recipeData = {
      Id: 0,
      Name: data.Name,
      UserId: state.Id,
      Categoryid: data.CategoryId,
      Img: data.Img || "/placeholder.svg?height=240&width=800",
      Duration: data.Duration,
      Difficulty: data.Difficulty,
      Description: data.Description,
      Ingridents: data.Ingridents.map((ingredient) => ({
        Name: ingredient.Name,
        Count: ingredient.Count.toString(),
        Type: ingredient.Type,
      })),
      Instructions: data.Instructions.map((instruction) => ({
        Name: instruction.Name,
      })),
    }

    try {
      await recipeStore.addRecipe(recipeData)
      alert("המתכון נוסף בהצלחה!")
      navigate("/RecipeList")
    } catch (error: any) {
      console.error("Error adding recipe:", error.response ? error.response.data : error.message)

      // טיפול בשגיאות ספציפיות מהשרת
      if (error.response && error.response.data && typeof error.response.data === "string") {
        if (error.response.data.includes("Name")) {
          setNameError("שם המתכון כבר קיים במערכת. אנא בחר שם אחר.")
        } else {
          setError(error)
          setOpenSnackbar(true)
        }
      } else {
        setError(error)
        setOpenSnackbar(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ py: 4 }}>
      <Card
        sx={{
          maxWidth: 700,
          mx: "auto",
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          overflow: "visible",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              mb: 3,
              textAlign: "center",
              color: "#D19A9A",
              fontWeight: "bold",
            }}
          >
            הוספת מתכון חדש
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StyledTextField
                  label="שם המתכון"
                  fullWidth
                  size="small"
                  {...register("Name", { required: "שם המתכון הוא שדה חובה" })}
                  error={!!errors.Name || !!nameError}
                  helperText={errors.Name?.message as string}
                  InputProps={{
                    sx: { direction: "rtl" },
                  }}
                  InputLabelProps={{
                    sx: { right: 14, left: "auto", transformOrigin: "right top" },
                    shrink: true,
                  }}
                />
                {nameError && (
                  <Alert severity="error" sx={{ mt: 1, fontSize: "0.85rem" }}>
                    {nameError}
                  </Alert>
                )}
              </Grid>

              <Grid item xs={12}>
                <StyledTextField
                  label="כתובת תמונה (URL)"
                  fullWidth
                  size="small"
                  {...register("Img")}
                  placeholder="https://example.com/image.jpg"
                  InputProps={{
                    sx: { direction: "rtl" },
                  }}
                  InputLabelProps={{
                    sx: { right: 14, left: "auto", transformOrigin: "right top" },
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="זמן הכנה (דקות)"
                  type="number"
                  fullWidth
                  size="small"
                  {...register("Duration", {
                    required: "זמן הכנה הוא שדה חובה",
                    min: { value: 1, message: "זמן הכנה חייב להיות לפחות דקה אחת" },
                  })}
                  error={!!errors.Duration}
                  helperText={errors.Duration?.message as string}
                  InputProps={{
                    sx: { direction: "rtl" },
                    endAdornment: <InputAdornment position="end">דקות</InputAdornment>,
                  }}
                  InputLabelProps={{
                    sx: { right: 14, left: "auto", transformOrigin: "right top" },
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <StyledFormControl fullWidth error={!!errors.Difficulty} size="small">
                  <InputLabel
                    id="difficulty-label"
                    sx={{ right: 14, left: "auto", transformOrigin: "right top" }}
                    shrink
                  >
                    רמת קושי
                  </InputLabel>
                  <Select
                    labelId="difficulty-label"
                    {...register("Difficulty", { required: "רמת קושי היא שדה חובה" })}
                    label="רמת קושי"
                    sx={{ direction: "rtl" }}
                    defaultValue={1}
                  >
                    <MenuItem value={1}>קלה</MenuItem>
                    <MenuItem value={2}>בינונית</MenuItem>
                    <MenuItem value={3}>קשה</MenuItem>
                  </Select>
                  {errors.Difficulty && (
                    <Typography variant="caption" color="error">
                      {errors.Difficulty.message as string}
                    </Typography>
                  )}
                </StyledFormControl>
              </Grid>

              <Grid item xs={12}>
                <StyledFormControl fullWidth error={!!errors.CategoryId} size="small">
                  <InputLabel id="category-label" sx={{ right: 14, left: "auto", transformOrigin: "right top" }} shrink>
                    קטגוריה
                  </InputLabel>
                  <Select
                    labelId="category-label"
                    {...register("CategoryId", { required: "קטגוריה היא שדה חובה" })}
                    label="קטגוריה"
                    sx={{ direction: "rtl" }}
                    defaultValue={1}
                  >
                    {Array.isArray(categories) && categories.length > 0
                      ? categories.map((category) => (
                          <MenuItem key={category.Id} value={category.Id}>
                            {category.Name}
                          </MenuItem>
                        ))
                      : [
                          <MenuItem key="1" value={1}>
                            חלבי
                          </MenuItem>,
                          <MenuItem key="2" value={2}>
                            בשרי
                          </MenuItem>,
                          <MenuItem key="3" value={3}>
                            פרווה
                          </MenuItem>,
                          <MenuItem key="4" value={4}>
                            קינוחים
                          </MenuItem>,
                          <MenuItem key="5" value={5}>
                            מאפים
                          </MenuItem>,
                        ]}
                  </Select>
                  {errors.CategoryId && (
                    <Typography variant="caption" color="error">
                      {errors.CategoryId.message as string}
                    </Typography>
                  )}
                </StyledFormControl>
              </Grid>

              <Grid item xs={12}>
                <StyledTextField
                  label="תיאור המתכון"
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                  {...register("Description", { required: "תיאור המתכון הוא שדה חובה" })}
                  error={!!errors.Description}
                  helperText={errors.Description?.message as string}
                  InputProps={{
                    sx: { direction: "rtl" },
                  }}
                  InputLabelProps={{
                    sx: { right: 14, left: "auto", transformOrigin: "right top" },
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="#333">
                    מרכיבים:
                  </Typography>
                  <Button
                    type="button"
                    onClick={() => appendIngredient({ Name: "", Count: 1, Type: "" })}
                    variant="outlined"
                    startIcon={<AddIcon />}
                    size="small"
                    sx={{
                      borderColor: "#D19A9A",
                      color: "#D19A9A",
                      "&:hover": {
                        borderColor: "#C48B8B",
                        backgroundColor: "rgba(209, 154, 154, 0.1)",
                      },
                    }}
                  >
                    הוסף מרכיב
                  </Button>
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "rgba(0,0,0,0.02)",
                    mb: 2,
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {ingridents.map((ingredient, index) => (
                    <Box
                      key={ingredient.id}
                      sx={{
                        display: "flex",
                        gap: 1,
                        mb: index < ingridents.length - 1 ? 1.5 : 0,
                        alignItems: "center",
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <StyledTextField
                        placeholder="שם המרכיב"
                        size="small"
                        {...register(`Ingridents.${index}.Name` as const, { required: "שם המרכיב הוא שדה חובה" })}
                        error={!!errors.Ingridents?.[index]?.Name}
                        helperText={errors.Ingridents?.[index]?.Name?.message as string}
                        fullWidth
                        InputProps={{ sx: { direction: "rtl" } }}
                        InputLabelProps={{ shrink: true }}
                      />

                      <StyledTextField
                        type="number"
                        placeholder="כמות"
                        size="small"
                        {...register(`Ingridents.${index}.Count` as const, {
                          required: "כמות היא שדה חובה",
                          min: { value: 0.1, message: "כמות חייבת להיות חיובית" },
                        })}
                        error={!!errors.Ingridents?.[index]?.Count}
                        helperText={errors.Ingridents?.[index]?.Count?.message as string}
                        sx={{ width: { xs: "100%", sm: "25%" } }}
                        InputProps={{ sx: { direction: "rtl" } }}
                        InputLabelProps={{ shrink: true }}
                      />

                      <StyledTextField
                        placeholder="יחידת מידה"
                        size="small"
                        {...register(`Ingridents.${index}.Type` as const, { required: "יחידת מידה היא שדה חובה" })}
                        error={!!errors.Ingridents?.[index]?.Type}
                        helperText={errors.Ingridents?.[index]?.Type?.message as string}
                        sx={{ width: { xs: "100%", sm: "25%" } }}
                        InputProps={{ sx: { direction: "rtl" } }}
                        InputLabelProps={{ shrink: true }}
                      />

                      <IconButton onClick={() => removeIngredient(index)} color="error" sx={{ mt: { xs: 1, sm: 0 } }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="#333">
                    הוראות הכנה:
                  </Typography>
                  <Button
                    type="button"
                    onClick={() => appendInstruction({ Name: "" })}
                    variant="outlined"
                    startIcon={<AddIcon />}
                    size="small"
                    sx={{
                      borderColor: "#D19A9A",
                      color: "#D19A9A",
                      "&:hover": {
                        borderColor: "#C48B8B",
                        backgroundColor: "rgba(209, 154, 154, 0.1)",
                      },
                    }}
                  >
                    הוסף הוראת הכנה
                  </Button>
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "rgba(0,0,0,0.02)",
                    mb: 2,
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {instructions.map((instruction, index) => (
                    <Box
                      key={instruction.id}
                      sx={{
                        display: "flex",
                        gap: 1,
                        mb: index < instructions.length - 1 ? 1.5 : 0,
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ minWidth: 24, fontWeight: "bold" }}>{index + 1}.</Typography>

                      <StyledTextField
                        placeholder="הוראת הכנה"
                        size="small"
                        {...register(`Instructions.${index}.Name` as const, { required: "הוראת הכנה היא שדה חובה" })}
                        error={!!errors.Instructions?.[index]?.Name}
                        helperText={errors.Instructions?.[index]?.Name?.message as string}
                        fullWidth
                        InputProps={{ sx: { direction: "rtl" } }}
                        InputLabelProps={{ shrink: true }}
                      />

                      <IconButton onClick={() => removeInstruction(index)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Paper>
              </Grid>

              <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                <Box>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    startIcon={<ArrowBackIcon />}
                    size="small"
                    sx={{
                      color: "#666",
                      borderColor: "#ccc",
                      mr: 1,
                      "&:hover": {
                        borderColor: "#999",
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    חזור
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => navigate("/RecipeList")}
                    size="small"
                    sx={{
                      color: "#666",
                      borderColor: "#ccc",
                      "&:hover": {
                        borderColor: "#999",
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    ביטול
                  </Button>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !!nameError}
                  size="small"
                  sx={{
                    backgroundColor: "#D19A9A",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#C48B8B",
                    },
                  }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : "שמור מתכון"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <ErrorSnackbar error={error} open={openSnackbar} onClose={() => setOpenSnackbar(false)} />
    </Box>
  )
}
export default AddRecipe