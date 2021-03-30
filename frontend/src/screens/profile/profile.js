import React from 'react'
import {
  Avatar,
  Button,
  CssBaseline,
  Grid,
  TextField,
  Paper,
  Container,
} from '@material-ui/core'
import { useStyles } from './styles'
import axios from 'axios'
import PhoneInput from 'react-phone-input-2'

import { useForm } from 'react-hook-form'
import { Message } from '../../components/message'
import { ModalLoader } from '../../components/modalloader'
import { ModalMessage } from '../../components/modalmessage'

import { useDispatch, useSelector } from 'react-redux'
import { UA } from '../../actions/index'
import { USER } from '../../constants/index'

export const Profile = ({ history }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const { userInfo } = useSelector((state) => state.userLogin)
  const { status, loading: loadingUpdate, error: errorUpdate } = useSelector(
    (state) => state.updateProfile
  )
  const { userDetails, loading, error } = useSelector(
    (state) => state.userDetails
  )

  const [mobile, setMobile] = React.useState()
  const [image, setImage] = React.useState()

  const { register, handleSubmit, errors, watch } = useForm({
    defaultValues: {
      name: userDetails && userDetails.name,
      email: userDetails && userDetails.email,
    },
  })

  React.useEffect(() => {
    dispatch(UA.getDetails())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    if (status) {
      dispatch(UA.getDetails())
    }
    if (userDetails) {
      setImage(userDetails.image)
    }
    return () => {
      dispatch({ type: USER.UPATE_PROFILE_RESET })
    }
  }, [userInfo, history, status, userDetails, dispatch])

  const sumbitHandler = ({ name, email, password }) => {
    const update = { name, email, password, image, mobile }
    dispatch(UA.updateProfile(update))
  }

  const imageHandler = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const form = new FormData()
    form.append('file', file)

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    try {
      const { data } = await axios.post(
        `/api/user/uploads/avatar`,
        form,
        config
      )
      const path = data.file.path.split('public')[1]
      setImage(path)
    } catch (error) {
      console.log(error)
    }
  }

  return loading || loadingUpdate ? (
    <ModalLoader />
  ) : error ? (
    <ModalMessage variant='error'>{error}</ModalMessage>
  ) : errorUpdate ? (
    <ModalMessage variant='error'>{errorUpdate}</ModalMessage>
  ) : (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={12}>
          <CssBaseline />

          <Container style={{ textAlign: 'center' }}>
            <input
              type='file'
              id='imageInput'
              accept='image/*'
              hidden
              onChange={imageHandler}
            />
            <label htmlFor='imageInput'>
              <Button
                style={{ height: '20vw', width: '20vw', borderRadius: '50%' }}
                component='span'
              >
                <Avatar
                  src={image}
                  alt={userDetails && userDetails.name}
                  style={{
                    height: '20vw',
                    width: '20vw',
                    margin: 'auto',
                  }}
                />
              </Button>
            </label>
          </Container>

          <form onSubmit={handleSubmit(sumbitHandler)}>
            <TextField
              inputRef={register({
                required: true,
                minLength: { value: 3, message: 'Minimum of 3 letters' },
                maxLength: { value: 20, message: 'Maximum of 20 letters' },
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
            <PhoneInput
              enableSearch='true'
              onChange={(e) => setMobile(e)}
              defaultErrorMessage='input only numbers'
              placeholder='input mobile number'
              inputStyle={{ width: '99%', height: 55 }}
              containerStyle={{
                margin: '2% 0 2% 1%',
              }}
            />
            <Button type='submit' fullWidth variant='contained' color='primary'>
              Save
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  )
}
