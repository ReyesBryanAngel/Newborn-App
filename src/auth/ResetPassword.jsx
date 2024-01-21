import { useState } from 'react';
import { TextField, 
    Paper, 
    Button,
    InputAdornment, 
    IconButton, 
  } from '@mui/material';
import ApiCall from './ApiCall';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import KeyIcon from '@mui/icons-material/Key';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const { http } = ApiCall();
    const { token } = useParams();
  
    const navigate = useNavigate();
  
    const closeSnackBar = () => {
      setOpenSnackBar(false);
    };
  
    const handleTogglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };
  
    const handleToggleConfirmPassVisibility = () => {
      setShowConfirmPass((prev) => !prev);
    };
  
    const resetPass = () => {
        http.post(`/auth/change-password`, {
            password: password,
            password_confirmation: confirmPassword,
            token: token,
          }).then((res) => {
            if (res?.status === 200) {
                setSuccessMessage(res?.data);
                setOpenSnackBar(true);
                setError(null);
                setTimeout(() => {
                    navigate("/login");
                }, 5000)
              }
          }).catch((e) => {
            setError(e.response?.data);
          });
        
    };
  
    return (
        <>
            <div className='flex items-center justify-center'>
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
                <div>
                    <Paper 
                        elevation={3} 
                        style={{ 
                            padding:"20px 50px 20px 50px",
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            marginTop:"4rem",
                            paddingBottom:"3rem",
                            height:"55vh"
                            
                        }}
                        
                    >
                        <form style={{ width: '100%', marginTop: 'auto', display:"flex", flexDirection:"column", height:"100%" }}>
                                <TextField
                                    variant="outlined"
                                    label="Password"
                                    className='md:w-80'
                                    name='password'
                                    type={showPassword ? 'text' : 'password'}
                                    sx={{ marginTop:"50px" }}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    value={password}
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
                                <TextField
                                    variant="outlined"
                                    label="Confirm Password"
                                    className='md:w-80'
                                    name='password_confirmation'
                                    type={showConfirmPass ? 'text' : 'password'}
                                    sx={{ marginTop:"50px" }}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                    }}
                                    value={confirmPassword}
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
                                <div className='text-start'>
                                    {<p style={{ color: "#BD271E" }}>{error}</p>} 
                                </div>
                                <Button
                                    variant='contained'
                                    onClick={resetPass}
                                    sx={{ 
                                        marginTop: '30px'
                                    }}
                                >
                                    Submit
                                </Button>
                        </form>
                    </Paper>
                </div>
            </div>
           
        </>
    )
}

export default ResetPassword;