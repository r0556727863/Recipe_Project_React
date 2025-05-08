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
  Link,
  Grid,
} from "@mui/material"
import axios from "axios"
import { UserContext } from "./context/UserContext"
import ErrorSnackbar from "./Error"
import { Eye, EyeOff, User, Mail, Phone, Lock, CreditCard, UserCircle, CheckCircle, AlertCircle } from "lucide-react"
import { RegistrationStyles } from "../styles/registration.styles"

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

    // ניקוי שגיאה כאשר המשתמש מקליד
    setErrors({ ...errors, [name]: "" })

    // בדיקת חוזק סיסמה כאשר שדה הסיסמה משתנה
    if (name === "password") {
      checkPasswordStrength(value)
    }
  }

  const checkPasswordStrength = (password: string) => {
    // בודק חוזק סיסמה פשוט
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

      // טיפול בשגיאות ספציפיות מהשרת
      if (error.response) {
        if (error.response.status === 400) {
          // בדיקה אם השרת החזיר שגיאות שדה ספציפיות
          if (error.response.data && typeof error.response.data === "string") {
            if (error.response.data.includes("UserName")) {
              setErrors({ ...errors, username: "שם משתמש כבר קיים במערכת" })
            } else if (error.response.data.includes("Email")) {
              setErrors({ ...errors, email: "כתובת אימייל כבר קיימת במערכת" })
            } else if (error.response.data.includes("Tz")) {
              setErrors({ ...errors, tz: "תעודת זהות כבר קיימת במערכת" })
            } else if (error.response.data.includes("phone")) {
              setErrors({ ...errors, phone: "מספר הטלפון כבר קיימת במערכת" })
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
        aria-label="open-register"
        sx={RegistrationStyles.registerButton}
      >
        הרשמה
      </Button>

      {open && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="registration-modal-title"
          closeAfterTransition
        >
          <Box sx={RegistrationStyles.modalContainer}>
            <div onClick={() => setOpen(false)} style={RegistrationStyles.modalBackdrop} />

            <div style={RegistrationStyles.modalContent}>
              <Box onClick={(e) => e.stopPropagation()} sx={RegistrationStyles.modalBox}>
                {/* אלמנטים דקורטיביים */}
                <Box sx={RegistrationStyles.decorativeElement1} />
                <Box sx={RegistrationStyles.decorativeElement2} />

                <Box sx={RegistrationStyles.formContainer}>
                  <Typography
                    id="registration-modal-title"
                    variant="h5"
                    component="h2"
                    sx={RegistrationStyles.formTitle}
                  >
                    הרשמה לאתר
                  </Typography>

                  <Grid container spacing={2} direction="column">
                    <Grid item xs={12}>
                      <div style={RegistrationStyles.formField}>
                        <TextField
                          label="שם משתמש"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          fullWidth
                          sx={RegistrationStyles.textField}
                          error={!!errors.username}
                          helperText={errors.username}
                          InputProps={{
                            sx: { direction: "ltr" },
                            startAdornment: (
                              <InputAdornment position="start">
                                <User size={18} color="#FF9A9E" />
                              </InputAdornment>
                            ),
                            endAdornment: formData.username ? (
                              <InputAdornment position="end">
                                {errors.username ? (
                                  <AlertCircle size={18} color="#f44336" />
                                ) : (
                                  <CheckCircle size={18} color="#4caf50" />
                                )}
                              </InputAdornment>
                            ) : null,
                          }}
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12}>
                      <div style={RegistrationStyles.formField}>
                        <TextField
                          label="שם מלא"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          fullWidth
                          sx={RegistrationStyles.textField}
                          error={!!errors.name}
                          helperText={errors.name}
                          InputProps={{
                            sx: { direction: "ltr" },
                            startAdornment: (
                              <InputAdornment position="start">
                                <UserCircle size={18} color="#FF9A9E" />
                              </InputAdornment>
                            ),
                            endAdornment: formData.name ? (
                              <InputAdornment position="end">
                                {errors.name ? (
                                  <AlertCircle size={18} color="#f44336" />
                                ) : (
                                  <CheckCircle size={18} color="#4caf50" />
                                )}
                              </InputAdornment>
                            ) : null,
                          }}
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12}>
                      <div style={RegistrationStyles.formField}>
                        <TextField
                          label="אימייל"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          type="email"
                          fullWidth
                          sx={RegistrationStyles.textField}
                          error={!!errors.email}
                          helperText={errors.email}
                          InputProps={{
                            sx: { direction: "ltr" },
                            startAdornment: (
                              <InputAdornment position="start">
                                <Mail size={18} color="#FF9A9E" />
                              </InputAdornment>
                            ),
                            endAdornment: formData.email ? (
                              <InputAdornment position="end">
                                {errors.email ? (
                                  <AlertCircle size={18} color="#f44336" />
                                ) : (
                                  <CheckCircle size={18} color="#4caf50" />
                                )}
                              </InputAdornment>
                            ) : null,
                          }}
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12}>
                      <div style={RegistrationStyles.formField}>
                        <TextField
                          label="טלפון"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          fullWidth
                          sx={RegistrationStyles.textField}
                          error={!!errors.phone}
                          helperText={errors.phone}
                          InputProps={{
                            sx: { direction: "ltr" },
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone size={18} color="#FF9A9E" />
                              </InputAdornment>
                            ),
                            endAdornment: formData.phone ? (
                              <InputAdornment position="end">
                                {errors.phone ? (
                                  <AlertCircle size={18} color="#f44336" />
                                ) : (
                                  <CheckCircle size={18} color="#4caf50" />
                                )}
                              </InputAdornment>
                            ) : null,
                          }}
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12}>
                      <div style={RegistrationStyles.formField}>
                        <TextField
                          label="סיסמה"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          type={showPassword ? "text" : "password"}
                          fullWidth
                          sx={RegistrationStyles.textField}
                          error={!!errors.password}
                          helperText={errors.password}
                          InputProps={{
                            sx: { direction: "ltr" },
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock size={18} color="#FF9A9E" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                    </Grid>

                    {formData.password && (
                      <Grid item xs={12}>
                        <div style={RegistrationStyles.formField}>
                          <Box sx={{ mb: 2, mt: 0.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                              <Box sx={RegistrationStyles.passwordStrengthBar}>
                                <Box sx={RegistrationStyles.passwordStrengthIndicator(passwordStrength)} />
                              </Box>
                            </Box>
                            <FormHelperText
                              sx={{
                                color:
                                  getPasswordColor() === "error"
                                    ? "#f44336"
                                    : getPasswordColor() === "warning"
                                      ? "#ff9800"
                                      : "#4caf50",
                              }}
                            >
                              {passwordFeedback}
                            </FormHelperText>
                          </Box>
                        </div>
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <div style={RegistrationStyles.formField}>
                        <TextField
                          label="תעודת זהות"
                          name="tz"
                          value={formData.tz}
                          onChange={handleChange}
                          fullWidth
                          sx={RegistrationStyles.textField}
                          error={!!errors.tz}
                          helperText={errors.tz}
                          InputProps={{
                            sx: { direction: "ltr" },
                            startAdornment: (
                              <InputAdornment position="start">
                                <CreditCard size={18} color="#FF9A9E" />
                              </InputAdornment>
                            ),
                            endAdornment: formData.tz ? (
                              <InputAdornment position="end">
                                {errors.tz ? (
                                  <AlertCircle size={18} color="#f44336" />
                                ) : (
                                  <CheckCircle size={18} color="#4caf50" />
                                )}
                              </InputAdornment>
                            ) : null,
                          }}
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12}>
                      <div style={RegistrationStyles.formField}>
                        <Button
                          onClick={handleSave}
                          disabled={loading}
                          variant="contained"
                          fullWidth
                          sx={RegistrationStyles.submitButton}
                        >
                          {loading ? <CircularProgress size={24} color="inherit" /> : "הרשם"}
                        </Button>
                      </div>
                    </Grid>

                    <Grid item xs={12}>
                      <div style={RegistrationStyles.formField}>
                        <Box sx={{ mt: 1, textAlign: "center" }}>
                          <Typography variant="body2">
                            כבר יש לך חשבון?{" "}
                            <Link
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                setOpen(false)
                                // מציאת כפתור ההתחברות ולחיצה עליו
                                const loginButtons = document.querySelectorAll("button")
                                for (const btn of loginButtons) {
                                  if (btn.textContent === "התחברות") {
                                    btn.click()
                                    break
                                  }
                                }
                              }}
                              sx={RegistrationStyles.loginLink}
                            >
                              התחבר עכשיו
                            </Link>
                          </Typography>
                        </Box>
                      </div>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </div>
          </Box>
        </Modal>
      )}

      <ErrorSnackbar error={error} open={openSnackbar} onClose={() => setOpenSnackbar(false)} />
    </>
  )
}
