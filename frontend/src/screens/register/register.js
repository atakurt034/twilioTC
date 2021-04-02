import React from 'react'
import { Link } from 'react-router-dom'
import {
  Avatar,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Paper,
  Box,
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { useStyles } from './styles'

import { useForm } from 'react-hook-form'
import { Message } from '../../components/message'
import { ModalLoader } from '../../components/modalloader'
import { ModalMessage } from '../../components/modalmessage'

import { useDispatch, useSelector } from 'react-redux'
import { UA } from '../../actions/index'

export const Register = ({ history }) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const { register, handleSubmit, errors, watch } = useForm()

  const { userInfo } = useSelector((state) => state.userLogin)
  const { status, loading, error } = useSelector((state) => state.userRegister)

  React.useEffect(() => {
    if (userInfo) {
      history.push('/')
    }
    console.log(status)
  }, [userInfo, history, status])

  const sumbitHandler = (data) => {
    dispatch(UA.register(data))
  }

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={12}>
          <CssBaseline />
          {loading ? (
            <ModalLoader />
          ) : (
            error && <ModalMessage variant='error'>{error}</ModalMessage>
          )}
          <Typography
            className={classes.header}
            gutterBottom
            component='h1'
            variant='h5'
          >
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />{' '}
            </Avatar>{' '}
            Register
          </Typography>

          <form onSubmit={handleSubmit(sumbitHandler)}>
            <TextField
              inputRef={register({
                required: true,
                minLength: { value: 3, message: 'Minimum of 3 letters' },
                maxLength: { value: 30, message: 'Maximum of 30 letters' },
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: 'Please use only letters',
                },
              })}
              error={errors.name}
              type='text'
              variant='outlined'
              margin='normal'
              required
              fullWidth
              label='Name'
              name='name'
              autoFocus
            />
            {errors.name && (
              <Message variant='error'>{errors.name.message}</Message>
            )}

            <TextField
              inputRef={register({
                pattern: {
                  value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'Please provide a valid email',
                },
              })}
              error={errors.email}
              type='email'
              variant='outlined'
              margin='normal'
              required
              fullWidth
              label='Email Address'
              name='email'
              autoFocus
            />
            {errors.email && (
              <Message variant='error'>{errors.email.message}</Message>
            )}
            <TextField
              inputRef={register({
                minLength: { value: 6, message: 'minimum of 6 characters' },
                pattern: {
                  value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-/.]).{6,}$/,
                  message:
                    'Atleast 1 of each: upper and lower case letter, number, and special character',
                },
              })}
              error={errors.password}
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
            />
            {errors.password && (
              <Message variant='error'>{errors.password.message}</Message>
            )}
            <TextField
              inputRef={register({
                validate: (value) =>
                  value === watch('password') || 'Password do not match',
              })}
              error={errors.confirmPassword}
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='confirmPassword'
              label='Confirm Password'
              type='password'
            />
            {errors.confirmPassword && (
              <Message variant='error'>
                {errors.confirmPassword.message}
              </Message>
            )}

            <FormControlLabel
              control={<Checkbox value='remember' color='primary' />}
              label='Remember me'
            />
            <Button type='submit' fullWidth variant='contained' color='primary'>
              Register
            </Button>
            <Box style={{ textAlign: 'center', padding: 10 }}>
              <Link to='/login' variant='body2'>
                <Typography variant='caption'>
                  {'Already have an account? Login'}
                </Typography>
              </Link>
            </Box>
          </form>
        </Paper>
      </Grid>
    </Grid>
  )
}
