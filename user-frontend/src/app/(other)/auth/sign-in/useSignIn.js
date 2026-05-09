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

  const normalizeResponse = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.results)) return res.results;
    if (Array.isArray(res?.data?.results)) return res.data.results;
    return [];
  };

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
      const tokenRes = await axios.post(
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

      const accessToken = tokenRes?.data?.access || tokenRes?.access;
      const refreshToken = tokenRes?.data?.refresh || tokenRes?.refresh;

      if (!accessToken || !refreshToken) {
        throw new Error('Login failed. Token not received.');
      }

      const [usersRes, driversRes] = await Promise.all([
        axios.get(API_URL('/api/users/'), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
        axios.get(API_URL('/api/drivers/'), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      ]);

      const users = normalizeResponse(usersRes);
      const drivers = normalizeResponse(driversRes);

      const loggedInUser = users.find(
        (user) =>
          String(user.username || '').toLowerCase() ===
          String(values.username).trim().toLowerCase()
      );

      if (!loggedInUser) {
        throw new Error('User profile not found.');
      }

      if (loggedInUser.is_staff) {
        throw new Error('Admin users cannot access the driver panel.');
      }

      const matchedDriver = drivers.find(
        (driver) => Number(driver.user) === Number(loggedInUser.id)
      );

      if (!matchedDriver) {
        throw new Error('Driver profile not found. Please contact admin.');
      }

      const sessionData = {
        user_id: loggedInUser.id,
        driver_id: matchedDriver.id,
        username: loggedInUser.username,
        email: loggedInUser.email,
        driver_name: matchedDriver.user_name,
        access: accessToken,
        refresh: refreshToken,
      };

      saveSession(sessionData);

      localStorage.setItem('access', accessToken);
      localStorage.setItem('refresh', refreshToken);
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
        message:
          e?.response?.data?.detail ||
          e.message ||
          'Login failed',
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