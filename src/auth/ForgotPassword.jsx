import { useState } from 'react';
import { TextField, Card, Typography } from '@mui/material';
import ApiCall from './ApiCall';
import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import MailLockIcon from '@mui/icons-material/MailLock';

const ForgotPassword =  () => {
    const { http, } = ApiCall();
    const [successMessage, setSuccessMessage] = useState(null);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [error, setError] = useState(null);

    const closeSnackBar = () => {
        setOpenSnackBar(false);
      }
    

    const formik = useFormik({
        initialValues: {      
            email: "",
        },
        validationSchema: yup.object({
            email: yup.string().email().required('Email Address is required'),
        }),
        validateOnBlur: true,
        enableReinitialize: false,
        onSubmit: async (values)=> {
            await http.post('/auth/forgot-password', values)
            .then((res) => {        
              setSuccessMessage(res?.data?.message);
              setOpenSnackBar(true);
              setError(null)
              formik.setSubmitting(false);
            })
            .catch((e) => {
              setError(e.response?.data?.message);
            })
        }
      })

    return (
        <div className='flex items-center mt-20 justify-center'>
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
            <div className='flex items-center justify-center lg:justify-between p-5 mt-5 w-full'>
                <div className='hidden lg:block text-left'>
                    <Typography variant='h4' sx={{ lineHeight:"70px" }}>
                        <span className='text-blue-300'>Forgotten</span> password meant<br/> to be <span className='text-blue-300'>recovered</span>.
                    </Typography>
                    <div>
                        <MailLockIcon sx={{ height:"200px", width:"200px", color:"#6DB3F2" }}/>
                    </div>
                </div>
                <div>
                    <Card 
                        elevation={3}
                        sx={{ padding:"35px" }}
                    >
                         <div className='whitespace-nowrap self-start text-start lg:hidden'>
                            <Typography variant='h6'>
                                <span className='text-blue-300'>Forgotten</span> password meant<br/> to be <span className='text-blue-300'>recovered</span>.
                            </Typography>
                        </div>
                        <form onSubmit={formik.handleSubmit}>
                            <TextField
                                variant="outlined"
                                label="Email"
                                className='w-64'
                                name='email'
                                sx={{ marginTop:"20px" }}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                                error={
                                    formik.touched.email &&
                                        Boolean(formik.errors.email)
                                    }
                                    helperText={
                                    formik.touched.email &&
                                        (formik.errors.email)
                                    }
                            />
                            <div className='text-start'>
                                {<p style={{ color: "#BD271E" }}>{error}</p>} 
                            </div>
                            <div className='mt-20'>
                                <LoadingButton 
                                    loading={formik.isSubmitting}
                                    variant='contained' 
                                    sx={{ 
                                        width:"100%"
                                    }}
                                    type="submit"
                                >
                                Submit
                                </LoadingButton>
                            </div>
                            
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;