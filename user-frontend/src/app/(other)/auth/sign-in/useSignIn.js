// import { yupResolver } from '@hookform/resolvers/yup';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import * as yup from 'yup';
// import { useAuthContext } from '@/context/useAuthContext';
// import { useNotificationContext } from '@/context/useNotificationContext';
// import axios from 'axios';

// const useSignIn = () => {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { saveSession } = useAuthContext();
//   const [searchParams] = useSearchParams();
//   const { showNotification } = useNotificationContext();

//   const loginFormSchema = yup.object({
//     username: yup.string().required('Please enter your username'),
//     password: yup.string().required('Please enter your password'),
//   });

//   const { control, handleSubmit } = useForm({
//     resolver: yupResolver(loginFormSchema),
//     defaultValues: {
//       username: '',
//       password: '',
//     },
//   });

//   const redirectUser = () => {
//     const redirectLink = searchParams.get('redirectTo');
//     if (redirectLink) {
//       navigate(redirectLink);
//     } else {
//       navigate('/dashboard');
//     }
//   };

//   const login = handleSubmit(async (values) => {
//     setLoading(true);

//     try {
//       const res = await axios.post(
//         'http://localhost:8000/api/token/',
//         {
//           username: values.username.trim(),
//           password: values.password.trim(),
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       console.log('LOGIN SUCCESS RESPONSE:', res.data);

//       const sessionData = {
//         username: values.username.trim(),
//         access: res.data.access,
//         refresh: res.data.refresh,
//       };

//       console.log('Before saveSession');
//       saveSession(sessionData);
//       console.log('After saveSession');

//       console.log('Before localStorage access');
//       localStorage.setItem('access', res.data.access);
//       console.log('After localStorage access');

//       localStorage.setItem('refresh', res.data.refresh);
//       localStorage.setItem('authUser', JSON.stringify(sessionData));

//       console.log('Before notification');
//       showNotification({
//         message: 'Successfully logged in. Redirecting...',
//         variant: 'success',
//       });
//       console.log('After notification');

//       console.log('Before redirect');
//       redirectUser();
//       console.log('After redirect');
//     } catch (e) {
//       console.error('FULL USER LOGIN ERROR:', e);
//       console.error('ERROR RESPONSE:', e?.response?.data);

//       showNotification({
//         message: e?.response?.data?.detail || e.message || 'Login failed',
//         variant: 'danger',
//       });
//     } finally {
//       setLoading(false);
//     }
//   });

//   return {
//     loading,
//     login,
//     control,
//   };
// };

// export default useSignIn;

import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';
import { API_URL } from '@/helpers/apiConfig';
import axios from 'axios';

const useSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveSession } = useAuthContext();
  const [searchParams] = useSearchParams();
  const { showNotification } = useNotificationContext();

  const loginFormSchema = yup.object({
    username: yup.string().required('Please enter your username'),
    password: yup.string().required('Please enter your password'),
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const redirectUser = () => {
    const redirectLink = searchParams.get('redirectTo');
    if (redirectLink) {
      navigate(redirectLink);
    } else {
      navigate('/dashboard');
    }
  };

  const login = handleSubmit(async (values) => {
    setLoading(true);

    try {
      const res = await axios.post(
        API_URL('/api/token/'),
        {
          username: values.username.trim(),
          password: values.password.trim(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const sessionData = {
        username: values.username.trim(),
        access: res.data.access,
        refresh: res.data.refresh,
      };

      saveSession(sessionData);

      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      localStorage.setItem('authUser', JSON.stringify(sessionData));

      showNotification({
        message: 'Successfully logged in. Redirecting...',
        variant: 'success',
      });

      redirectUser();
    } catch (e) {
      console.error('FULL USER LOGIN ERROR:', e);
      console.error('ERROR RESPONSE:', e?.response?.data);

      showNotification({
        message: e?.response?.data?.detail || e.message || 'Login failed',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  });

  return {
    loading,
    login,
    control,
  };
};

export default useSignIn;