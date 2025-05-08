import type React from "react"
import { useState, useContext } from "react"
import {
  TextField,
  Button,
  Modal,
  Box,
  CircularProgress,
  Typography,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material"
import axios from "axios"
import { UserContext } from "./context/UserContext"
import ErrorSnackbar from "./Error"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"

export const Register = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("Register must be used within a UserProvider")
  }
  const { dispatch } = context

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    tz: "",
  })
  const [error, setError] = useState<any>(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [errors, setErrors] = useState<any>({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    tz: "",
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when user types
    setErrors({ ...errors, [name]: "" })

    // Check password strength when password field changes
    if (name === "password") {
      checkPasswordStrength(value)
    }
  }

  const checkPasswordStrength = (password: string) => {
    // Simple password strength checker
    let strength = 0
    let feedback = ""

    if (password.length >= 6) strength += 1
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    if (strength === 0) feedback = "סיסמה חלשה מאוד"
    else if (strength <= 2) feedback = "סיסמה חלשה"
    else if (strength <= 4) feedback = "סיסמה בינונית"
    else feedback = "סיסמה חזקה"

    setPasswordStrength(strength)
    setPasswordFeedback(feedback)
  }

  const getPasswordColor = () => {
    if (passwordStrength <= 2) return "error"
    if (passwordStrength <= 4) return "warning"
    return "success"
  }

  const validateForm = () => {
    const newErrors: any = {}
    let isValid = true

    if (!formData.username) {
      newErrors.username = "שם משתמש הוא שדה חובה"
      isValid = false
    }

    if (!formData.name) {
      newErrors.name = "שם הוא שדה חובה"
      isValid = false
    }

    if (!formData.email) {
      newErrors.email = "אימייל הוא שדה חובה"
      isValid = false
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
      newErrors.email = "אנא הזן כתובת אימייל תקינה"
      isValid = false
    }

    if (!formData.phone) {
      newErrors.phone = "טלפון הוא שדה חובה"
      isValid = false
    } else if (!/^\d{9,10}$/.test(formData.phone)) {
      newErrors.phone = "מספר טלפון חייב להכיל 9-10 ספרות"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "סיסמה היא שדה חובה"
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "סיסמה חייבת להכיל לפחות 6 תווים"
      isValid = false
    }

    if (!formData.tz) {
      newErrors.tz = "תעודת זהות היא שדה חובה"
      isValid = false
    } else if (!/^\d{9}$/.test(formData.tz)) {
      newErrors.tz = "תעודת זהות חייבת להכיל 9 ספרות"
      isValid = false
    } 

    setErrors(newErrors)
    return isValid
  }

  // פונקציה לבדיקת תקינות ת"ז ישראלית
  const validateIsraeliID = (id: string) => {
    // Convert to number array
    const idArray = id.split("").map(Number)

    // Check if all characters are digits
    if (idArray.some(isNaN)) return false

    // Calculate checksum
    let sum = 0
    for (let i = 0; i < 9; i++) {
      let digit = idArray[i]
      // Multiply odd positions by 1, even positions by 2
      if (i % 2 === 0) {
        digit *= 1
      } else {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      sum += digit
    }

    // Valid ID if sum is divisible by 10
    return sum % 10 === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const res = await axios.post("http://localhost:8080/api/user/sighin", {
        UserName: formData.username,
        Name: formData.name,
        Password: formData.password,
        Phone: formData.phone,
        Email: formData.email,
        Tz: formData.tz,
      })

      dispatch({ type: "CREATE_USER", payload: res.data })
      alert("ההרשמה הושלמה בהצלחה!")
      setFormData({ username: "", name: "", email: "", phone: "", password: "", tz: "" })
      setOpen(false)
    } catch (error: any) {
      console.error("Registration error:", error)

      // Handle specific server errors
      if (error.response) {
        if (error.response.status === 400) {
          // Check if server returned specific field errors
          if (error.response.data && typeof error.response.data === "string") {
            if (error.response.data.includes("UserName")) {
              setErrors({ ...errors, username: "שם משתמש כבר קיים במערכת" })
            } else if (error.response.data.includes("Email")) {
              setErrors({ ...errors, email: "כתובת אימייל כבר קיימת במערכת" })
            } else if (error.response.data.includes("Tz")) {
              setErrors({ ...errors, tz: "תעודת זהות כבר קיימת במערכת" })
            } else {
              setError(error.response.data || "שגיאה בהרשמה, אנא נסה שנית")
              setOpenSnackbar(true)
            }
          } else {
            setError("שגיאה בהרשמה, אנא נסה שנית")
            setOpenSnackbar(true)
          }
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
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.2)",
          color: "white",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.3)",
          },
        }}
      >
        הרשמה
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="registration-modal-title">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: 3,
            width: 400,
            maxWidth: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          <Typography
            id="registration-modal-title"
            variant="h5"
            component="h2"
            sx={{
              mb: 3,
              textAlign: "center",
              color: "#D19A9A",
              fontWeight: "bold",
            }}
          >
            הרשמה לאתר
          </Typography>

          <TextField
            label="שם משתמש"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
            error={!!errors.username}
            helperText={errors.username}
            InputProps={{
              sx: { direction: "ltr" },
              endAdornment: formData.username ? (
                <InputAdornment position="end">
                  {errors.username ? <ErrorIcon color="error" /> : <CheckCircleIcon color="success" />}
                </InputAdornment>
              ) : null,
            }}
          />

          <TextField
            label="שם מלא"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
            error={!!errors.name}
            helperText={errors.name}
            InputProps={{
              sx: { direction: "ltr" },
              endAdornment: formData.name ? (
                <InputAdornment position="end">
                  {errors.name ? <ErrorIcon color="error" /> : <CheckCircleIcon color="success" />}
                </InputAdornment>
              ) : null,
            }}
          />

          <TextField
            label="אימייל"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            fullWidth
            sx={{ marginBottom: 2 }}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              sx: { direction: "ltr" },
              endAdornment: formData.email ? (
                <InputAdornment position="end">
                  {errors.email ? <ErrorIcon color="error" /> : <CheckCircleIcon color="success" />}
                </InputAdornment>
              ) : null,
            }}
          />

          <TextField
            label="טלפון"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 2 }}
            error={!!errors.phone}
            helperText={errors.phone}
            InputProps={{
              sx: { direction: "ltr" },
              endAdornment: formData.phone ? (
                <InputAdornment position="end">
                  {errors.phone ? <ErrorIcon color="error" /> : <CheckCircleIcon color="success" />}
                </InputAdornment>
              ) : null,
            }}
          />

          <TextField
            label="סיסמה"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            fullWidth
            sx={{ marginBottom: 1 }}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              sx: { direction: "ltr" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {formData.password && (
            <Box sx={{ mb: 2, mt: 0.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Box
                  sx={{
                    height: 4,
                    flexGrow: 1,
                    borderRadius: 2,
                    bgcolor: "grey.300",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${(passwordStrength / 5) * 100}%`,
                      bgcolor:
                        passwordStrength <= 2 ? "error.main" : passwordStrength <= 4 ? "warning.main" : "success.main",
                      transition: "width 0.3s",
                    }}
                  />
                </Box>
              </Box>
              <FormHelperText
                sx={{
                  color:
                    getPasswordColor() === "error"
                      ? "error.main"
                      : getPasswordColor() === "warning"
                        ? "warning.main"
                        : "success.main",
                }}
              >
                {passwordFeedback}
              </FormHelperText>
            </Box>
          )}

          <TextField
            label="תעודת זהות"
            name="tz"
            value={formData.tz}
            onChange={handleChange}
            fullWidth
            sx={{ marginBottom: 3 }}
            error={!!errors.tz}
            helperText={errors.tz}
            InputProps={{
              sx: { direction: "ltr" },
              endAdornment: formData.tz ? (
                <InputAdornment position="end">
                  {errors.tz ? <ErrorIcon color="error" /> : <CheckCircleIcon color="success" />}
                </InputAdornment>
              ) : null,
            }}
          />

          <Button
            onClick={handleSave}
            disabled={loading}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#D19A9A",
              color: "white",
              padding: 1.5,
              "&:hover": {
                backgroundColor: "#C48B8B",
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "הרשם"}
          </Button>
        </Box>
      </Modal>

      <ErrorSnackbar error={error} open={openSnackbar} onClose={() => setOpenSnackbar(false)} />
    </>
  )
}
