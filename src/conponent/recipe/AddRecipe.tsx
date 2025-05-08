import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import ErrorSnackbar from "../Error"
import {
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Grid,
  Paper,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material"
import { UserContext } from "../context/UserContext"
import { recipeStore } from "../store/RecipeStore"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Trash2,
  Plus,
  Save,
  X,
  ImageIcon,
  FileText,
  Utensils,
  ListOrdered,
  ChefHat,
  Bookmark,
} from "lucide-react"
import { AddRecipeStyles } from "../../styles/add-recipe.styles"

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

const AddRecipe = () => {
  const navigate = useNavigate()
  const [error, setError] = useState<any>(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [nameError, setNameError] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(0)

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
    trigger,
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

  const handleNext = async () => {
    const fieldsToValidate: any = {
      0: ["Name", "Description", "CategoryId"],
      1: ["Duration", "Difficulty", "Img"],
      2: ["Ingridents"],
    }

    const result = await trigger(fieldsToValidate[activeStep])
    if (result) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  const steps = [
    {
      label: "פרטי מתכון בסיסיים",
      icon: <FileText size={20} />,
      content: (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <AddRecipeStyles.StyledTextField
                  label="שם המתכון"
                  fullWidth
                  size="small"
                  {...register("Name", { required: "שם המתכון הוא שדה חובה" })}
                  error={!!errors.Name || !!nameError}
                  helperText={(errors.Name?.message as string) || nameError}
                  InputProps={{
                    sx: { direction: "rtl" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Bookmark size={18} color="#FF9A9E" />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    sx: { right: 14, left: "auto", transformOrigin: "right top" },
                    shrink: true,
                  }}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <AddRecipeStyles.StyledTextField
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
                    startAdornment: (
                      <InputAdornment position="start">
                        <FileText size={18} color="#FF9A9E" />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    sx: { right: 14, left: "auto", transformOrigin: "right top" },
                    shrink: true,
                  }}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <AddRecipeStyles.StyledFormControl fullWidth error={!!errors.CategoryId} size="small">
                  <InputLabel id="category-label" sx={{ right: 14, left: "auto", transformOrigin: "right top" }} shrink>
                    קטגוריה
                  </InputLabel>
                  <Select
                    labelId="category-label"
                    {...register("CategoryId", { required: "קטגוריה היא שדה חובה" })}
                    label="קטגוריה"
                    sx={{ direction: "rtl" }}
                    defaultValue={1}
                    startAdornment={
                      <InputAdornment position="start">
                        <Utensils size={18} color="#FF9A9E" />
                      </InputAdornment>
                    }
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
                </AddRecipeStyles.StyledFormControl>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      ),
    },
    {
      label: "פרטים נוספים",
      icon: <ImageIcon size={20} />,
      content: (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <motion.div variants={itemVariants}>
                <AddRecipeStyles.StyledTextField
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
                    startAdornment: (
                      <InputAdornment position="start">
                        <Clock size={18} color="#FF9A9E" />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">דקות</InputAdornment>,
                  }}
                  InputLabelProps={{
                    sx: { right: 14, left: "auto", transformOrigin: "right top" },
                    shrink: true,
                  }}
                />
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6}>
              <motion.div variants={itemVariants}>
                <AddRecipeStyles.StyledFormControl fullWidth error={!!errors.Difficulty} size="small">
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
                    startAdornment={
                      <InputAdornment position="start">
                        <ChefHat size={18} color="#FF9A9E" />
                      </InputAdornment>
                    }
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
                </AddRecipeStyles.StyledFormControl>
              </motion.div>
            </Grid>

            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <AddRecipeStyles.StyledTextField
                  label="כתובת תמונה (URL)"
                  fullWidth
                  size="small"
                  {...register("Img")}
                  placeholder="https://example.com/image.jpg"
                  InputProps={{
                    sx: { direction: "rtl" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <ImageIcon size={18} color="#FF9A9E" />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    sx: { right: 14, left: "auto", transformOrigin: "right top" },
                    shrink: true,
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      ),
    },
    {
      label: "מרכיבים",
      icon: <Utensils size={20} />,
      content: (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="subtitle1" fontWeight="bold" color="#333">
              מרכיבים:
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                onClick={() => appendIngredient({ Name: "", Count: 1, Type: "" })}
                variant="outlined"
                startIcon={<Plus size={16} />}
                size="small"
                sx={AddRecipeStyles.addButton}
              >
                הוסף מרכיב
              </Button>
            </motion.div>
          </Box>

          <Paper elevation={0} sx={AddRecipeStyles.ingredientsPaper}>
            <AnimatePresence>
              {ingridents.map((ingredient, index) => (
                <motion.div
                  key={ingredient.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box sx={AddRecipeStyles.ingredientItem(index, ingridents.length)}>
                    <AddRecipeStyles.StyledTextField
                      placeholder="שם המרכיב"
                      size="small"
                      {...register(`Ingridents.${index}.Name` as const, { required: "שם המרכיב הוא שדה חובה" })}
                      error={!!errors.Ingridents?.[index]?.Name}
                      helperText={errors.Ingridents?.[index]?.Name?.message as string}
                      fullWidth
                      InputProps={{ sx: { direction: "rtl" } }}
                      InputLabelProps={{ shrink: true }}
                    />

                    <AddRecipeStyles.StyledTextField
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

                    <AddRecipeStyles.StyledTextField
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
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          </Paper>
        </motion.div>
      ),
    },
    {
      label: "הוראות הכנה",
      icon: <ListOrdered size={20} />,
      content: (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="subtitle1" fontWeight="bold" color="#333">
              הוראות הכנה:
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                onClick={() => appendInstruction({ Name: "" })}
                variant="outlined"
                startIcon={<Plus size={16} />}
                size="small"
                sx={AddRecipeStyles.addButton}
              >
                הוסף הוראת הכנה
              </Button>
            </motion.div>
          </Box>

          <Paper elevation={0} sx={AddRecipeStyles.instructionsPaper}>
            <AnimatePresence>
              {instructions.map((instruction, index) => (
                <motion.div
                  key={instruction.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box sx={AddRecipeStyles.instructionItem}>
                    <Typography sx={{ minWidth: 24, fontWeight: "bold", color: "#FF9A9E" }}>{index + 1}.</Typography>

                    <AddRecipeStyles.StyledTextField
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
                      <Trash2 size={18} />
                    </IconButton>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          </Paper>
        </motion.div>
      ),
    },
  ]

  return (
    <Box sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card sx={AddRecipeStyles.card}>
          {/* Animated decorative elements */}
          <Box
            component={motion.div}
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 0.95, 1],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
            sx={AddRecipeStyles.decorativeElement1}
          />
          <Box
            component={motion.div}
            animate={{
              rotate: [0, -10, 10, 0],
              scale: [1, 0.95, 1.05, 1],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              delay: 0.5,
            }}
            sx={AddRecipeStyles.decorativeElement2}
          />

          <CardContent sx={AddRecipeStyles.cardContent}>
            <Typography variant="h5" gutterBottom sx={AddRecipeStyles.cardTitle}>
              הוספת מתכון חדש
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 3 }}>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconProps={{
                      icon: step.icon,
                    }}
                    sx={AddRecipeStyles.stepLabel(activeStep, index)}
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    {step.content}
                    <Box sx={{ mb: 2, mt: 2 }}>
                      <div>
                        <Button
                          variant="contained"
                          onClick={index === steps.length - 1 ? handleSubmit(onSubmit) : handleNext}
                          sx={AddRecipeStyles.primaryButton}
                          startIcon={index === steps.length - 1 ? <Save size={18} /> : <ArrowLeft size={18} />}
                          disabled={loading || !!nameError}
                        >
                          {index === steps.length - 1 ? (
                            loading ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              "שמור מתכון"
                            )
                          ) : (
                            "הבא"
                          )}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                          startIcon={<ArrowRight size={18} />}
                        >
                          חזרה
                        </Button>
                        <Button
                          onClick={() => navigate("/RecipeList")}
                          startIcon={<X size={18} />}
                          sx={{
                            color: "#666",
                          }}
                        >
                          ביטול
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>
      </motion.div>
      <ErrorSnackbar error={error} open={openSnackbar} onClose={() => setOpenSnackbar(false)} />
    </Box>
  )
}
export default AddRecipe