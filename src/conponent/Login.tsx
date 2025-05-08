import type React from "react"
import { useContext, useState } from "react"
import { TextField, Button, Modal, Box, CircularProgress, Typography, InputAdornment, IconButton } from "@mui/material"
import axios from "axios"
import { UserContext } from "./context/UserContext"
import ErrorSnackbar from "./Error"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"

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
        התחברות
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} aria-labelledby="login-modal-title">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: 3,
            width: 400,
            maxWidth: "90%",
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          <Typography
            id="login-modal-title"
            variant="h5"
            component="h2"
            sx={{
              mb: 3,
              textAlign: "center",
              color: "#D19A9A",
              fontWeight: "bold",
            }}
          >
            התחברות לאתר
          </Typography>

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
            InputProps={{ sx: { direction: "ltr" } }}
          />

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

          {error && (
            <Typography color="error" variant="body2" sx={{ marginBottom: 1, textAlign: "center" }}>
              {error}
            </Typography>
          )}

          <Button
            onClick={handleLogin}
            disabled={loading}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#D19A9A",
              color: "white",
              padding: 1.5,
              mt: 2,
              "&:hover": {
                backgroundColor: "#C48B8B",
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "התחבר"}
          </Button>
        </Box>
      </Modal>

      <ErrorSnackbar error={error} open={openSnackbar} onClose={() => setOpenSnackbar(false)} />
    </>
  )
}
