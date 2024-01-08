import { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Paper, Grid, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import MyLogo from "../assets/my-logo.png"
import ApiCall from "./ApiCall";

const LoginPage = () => {
const { http, setToken } = ApiCall();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [emptyUsername, setEmptyUsername] = useState(null);
  const [emptyPassword, setEmptyPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = () => {
    setError(null);
    http.post('/auth/login', { email: username, password: password })
      .then((res) => {
        setToken(res.data.user, res.data.access_token);
      })
      .catch((e) => {
        if (e?.response?.data?.errors?.email?.length > 0) {
          setEmptyUsername(e?.response?.data?.errors?.email[0]);
        }

        if (e?.response?.data?.errors?.password?.length > 0) {
          setEmptyPassword(e?.response?.data?.errors?.password[0])
        }

        if (e.response?.status === 401) {
          setError(e.response?.data?.message);
        } else {
          setError("An error occurred. Please try again later.");
        }
      });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    if (username !== null) {
      setEmptyUsername(null)
    }

    if (password !== null) {
      setEmptyPassword(null)
    }
  }, [password, username])

  return (
    <Container 
      component="main" 
      maxWidth="xs" 
      sx={{
          display: 'flex',
          alignItems: 'center',
          height: '80vh' 
      }}
    >
      <Paper 
        elevation={3} 
        style={{ 
            padding: 20, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            width: '100%', 
            height: "70vh",
            marginTop:"4rem"
            }}
        >
            <Box
                component="img"
                className='h-24'
                alt="my logo."
                src={MyLogo}
                
            />
            {!emptyUsername && !emptyPassword && (
              <div className='text-start'>
                {<p style={{ color: "#BD271E" }}>{error}</p>} 
              </div>
            )}
        <form style={{ width: '100%', marginTop: 16 }}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value === '' ? null : e.target.value)}
              />
              <div className='text-start'>
                {<p style={{ color: "#BD271E" }}>{emptyUsername}</p>} 
              </div>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value === '' ? null : e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <div className='text-start'>
                {<p style={{ color: "#BD271E" }}>{emptyPassword}</p>} 
              </div>
            </Grid>
          </Grid>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
            style={{ marginTop: 50 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
