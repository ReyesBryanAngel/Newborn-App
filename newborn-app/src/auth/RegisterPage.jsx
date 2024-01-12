import { useState } from 'react';
import { 
  TextField, 
  Container, 
  Paper, 
  Grid, 
  InputAdornment, 
  IconButton, 
  Typography
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import KeyIcon from '@mui/icons-material/Key';
import { LoadingButton } from "@mui/lab";
import ApiCall from "./ApiCall";
import * as yup from 'yup';
import { useFormik } from 'formik';

const LoginPage = () => {
  const navigate = useNavigate();
  const { http } = ApiCall();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handleToggleConfirmPassVisibility = () => {
    setShowConfirmPass((prev) => !prev);
  }
  const closeSnackBar = () => {
    setOpenSnackBar(false);
  }

  const formik = useFormik({
    initialValues: {
        name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: ""
    },
    validationSchema: yup.object({
        name: yup.string().required('First Name is required'),
        last_name: yup.string().required('Last Name is required'),
        email: yup.string().required('Email Address is required'),
        password: yup.string().required('Password is required'),
        password_confirmation: yup.string().required('Password Confirmation is required'),
    }),
    validateOnBlur: true,
    enableReinitialize: false,
    onSubmit: (values)=> {
      register(values);
    }
  })

  const register = (values) => {
      http.post('/auth/register', values)
      .then((res) => {
          setSuccessMessage(res?.data?.message);
          if (res?.status === 200) { 
              setOpenSnackBar(true);
              setTimeout(() => {
                navigate("/login")
              }, 5000)
          }
      })
      .catch((e) => {
        if (e?.response?.data?.errors?.email?.length > 0) {
          setErrorMessage(e?.response?.data?.errors?.email[0]);
        }
        if (e?.response?.data?.errors?.password?.length > 0) {
          setErrorMessage(e?.response?.data?.errors?.password[0]);
        }
      })
  }

  return (
    <div>
      {openSnackBar && (
        <Snackbar 
            open={open} 
            autoHideDuration={5000} 
            onClose={closeSnackBar} 
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <MuiAlert
                elevation={6}
                variant="filled"
                onClose={closeSnackBar}
                severity="success"
            >
               {successMessage}
            </MuiAlert>
        </Snackbar>
      )}
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
              marginTop:"4rem",
              paddingBottom:"3rem"
              }}
          >
            <div className='self-start text-start'>
              <Typography variant='h5'>Sign up <br/>It&apos;s quick and easy.</Typography>
            </div>
              
          <form onSubmit={formik.handleSubmit}  style={{ width: '100%', marginTop: 16 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="First Name"
                  fullWidth
                  size='small'
                  name='name'
                  value={formik?.values?.name}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setErrorMessage(null);
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.name &&
                    Boolean(formik.errors.name)
                  }
                  helperText={
                      formik.touched.name &&
                      (formik.errors.name)
                  }
                />
              </Grid>
              <Grid item xs={12}>
              <TextField
                  variant="outlined"
                  label="Last Name"
                  fullWidth
                  size='small'
                  name='last_name'
                  value={formik.values.last_name}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setErrorMessage(null);
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.last_name &&
                    Boolean(formik.errors.last_name)
                  }
                  helperText={
                      formik.touched.name &&
                      (formik.errors.name)
                  }
                />
              </Grid>
              <Grid item xs={12}>
              <TextField
                  variant="outlined"
                  label="Email Address"
                  fullWidth
                  size='small'
                  name='email'
                  value={formik.values.email}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setErrorMessage(null);
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.email &&
                      Boolean(formik.errors.email)
                  }
                  helperText={
                    formik.touched.email &&
                      (formik.errors.email)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Password"
                  size='small'
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  name='password'
                  value={formik.values.password}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setErrorMessage(null);
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password &&
                      Boolean(formik.errors.password)
                  }
                  helperText={
                    formik.touched.password &&
                      (formik.errors.password)
                  }
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Confirm Password"
                  size='small'
                  type={showConfirmPass ? 'text' : 'password'}
                  fullWidth
                  name='password_confirmation'
                  value={formik.values.password_confirmation}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setErrorMessage(null);
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password_confirmation &&
                      Boolean(formik.errors.password_confirmation)
                  }
                  helperText={
                    formik.touched.password_confirmation &&
                      (formik.errors.password_confirmation)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleToggleConfirmPassVisibility} edge="end">
                          {showConfirmPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <div className='text-start text-sm'>
              {<p style={{ color: "#BD271E" }}>{errorMessage}</p>}
            </div>          
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: 50 }}
            >
              Regsiter
            </LoadingButton>
          </form>
        </Paper>
      </Container>
    </div>

  );
};

export default LoginPage;
