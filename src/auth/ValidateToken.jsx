import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, CircularProgress} from "@mui/material";
import ResetPassword from './ResetPassword';
import ApiCall from './ApiCall';

const ValidateToken = () => {
  const { token } = useParams();
  const { http } = ApiCall();
  const navigate = useNavigate();
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await http.get(`/auth/reset-password/${token}`);
        if (res?.status === 200) {
          setIsValidToken(true);
        }
      } catch (error) {
        navigate("token-invalid");
      }
    };

    validateToken();
  }, [token, navigate, http]);

  return (
    <div>
      {isValidToken ? (
        <ResetPassword />
      ) : (
        <Box sx={{ height: '80vh', display: 'flex', alignItems: 'center' }}>
            <Typography>Token Validating...</Typography>
            <CircularProgress />
        </Box>
      )}
    </div>
  );
};



export default ValidateToken;
