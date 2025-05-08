import type React from "react"
import { useContext, useState } from "react"
import {TextField,Button,Modal,Box,CircularProgress,Typography,InputAdornment,IconButton,Link,
} from "@mui/material"
import axios from "axios"
import { UserContext } from "./context/UserContext"
import ErrorSnackbar from "./Error"
import { Eye, EyeOff, User, Lock } from "lucide-react"
import { LoginStyles } from "../styles/login.styles"

export const Login = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("Login must be used within a UserProvider")
  }
  const { dispatch } = context

  const [open, setOpen] = useState(false)
  const [UserName, setUserName] = useState("")
  const [Password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    setUsernameError(null)
    setPasswordError(null)
    setError(null)

    // בדיקות ולידציה
    if (!UserName) {
      setUsernameError("שם משתמש הוא שדה חובה")
    }
    if (!Password) {
      setPasswordError("סיסמה היא שדה חובה")
    }
    if (!UserName || !Password) {
      return
    }

    setLoading(true)
    try {
      const res = await axios.post("http://localhost:8080/api/user/login", {
        UserName,
        Password,
      })

      dispatch({
        type: "CREATE_USER",
        payload: res.data,
      })

      alert("התחברת בהצלחה!")
      setOpen(false)
      onLoginSuccess()

      setUserName("")
      setPassword("")
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setError("פרטי הכניסה אינם נכונים")
      } else if (error.response && error.response.status === 404) {
        setError("משתמש לא נמצא")
      } else {
        setError("אירעה שגיאה בהתחברות, אנא נסה שנית")
      }
      setOpenSnackbar(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained" sx={LoginStyles.loginButton}>
        התחברות
      </Button>

      {open && (
        <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="login-modal-title" closeAfterTransition>
          <Box sx={LoginStyles.modalContainer}>
            <div onClick={() => setOpen(false)} style={LoginStyles.modalBackdrop} />

            <div style={LoginStyles.modalContent}>
              <Box onClick={(e) => e.stopPropagation()} sx={LoginStyles.modalBox}>
                {/* Decorative elements */}
                <Box sx={LoginStyles.decorativeElement1} />
                <Box sx={LoginStyles.decorativeElement2} />

                <Box sx={LoginStyles.formContainer}>
                  <Typography id="login-modal-title" variant="h5" component="h2" sx={LoginStyles.formTitle}>
                    התחברות לאתר
                  </Typography>

                  <div style={LoginStyles.formField}>
                    <TextField
                      label="שם משתמש"
                      value={UserName}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setUserName(event.target.value)
                        setUsernameError(null)
                      }}
                      fullWidth
                      margin="normal"
                      error={!!usernameError}
                      helperText={usernameError}
                      InputProps={{
                        sx: { direction: "ltr" },
                        startAdornment: (
                          <InputAdornment position="start">
                            <User size={18} color="#FF9A9E" />
                          </InputAdornment>
                        ),
                      }}
                      sx={LoginStyles.textField}
                    />
                  </div>

                  <div style={LoginStyles.formField}>
                    <TextField
                      label="סיסמה"
                      value={Password}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setPassword(event.target.value)
                        setPasswordError(null)
                      }}
                      type={showPassword ? "text" : "password"}
                      fullWidth
                      margin="normal"
                      error={!!passwordError}
                      helperText={passwordError}
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
                      sx={LoginStyles.textField}
                    />
                  </div>

                  {error && (
                    <Typography color="error" variant="body2" sx={{ marginBottom: 1, textAlign: "center" }}>
                      {error}
                    </Typography>
                  )}

                  <div style={LoginStyles.submitButtonContainer}>
                    <Button
                      onClick={handleLogin}
                      disabled={loading}
                      variant="contained"
                      fullWidth
                      sx={LoginStyles.submitButton}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : "התחבר"}
                    </Button>
                  </div>

                  <div style={LoginStyles.formField}>
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                      <Typography variant="body2">
                        עדיין אין לך חשבון?{" "}
                        <Link
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setOpen(false)
                            document.querySelector<HTMLButtonElement>('[aria-label="open-register"]')?.click()
                          }}
                          sx={LoginStyles.registerLink}
                        >
                          הירשם עכשיו
                        </Link>
                      </Typography>
                    </Box>
                  </div>
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
