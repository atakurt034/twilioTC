import React from 'react'
import { Button, Container, TextField, Paper } from '@material-ui/core'

import SendIcon from '@material-ui/icons/Send'

import { useForm } from 'react-hook-form'

export const TextForm = () => {
  const { register, handleSubmit, errors } = useForm()

  const submitHandler = ({ message }) => {}

  return (
    <>
      <Container component='main' maxWidth='xs' style={{ minHeight: '100%' }}>
        <form
          onSubmit={handleSubmit(submitHandler)}
          method='POST'
          encType='multipart/form-data'
        >
          <TextField
            inputRef={register({
              required: true,
              validate: (text) => text.trim().length >= 1,
            })}
            error={errors.message}
            type='text'
            variant='outlined'
            margin='normal'
            required
            fullWidth
            label='Message'
            multiline
            rows={5}
            style={{ backgroundColor: '#fff' }}
            name='message'
          />

          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            size='large'
            startIcon={<SendIcon />}
          >
            Send
          </Button>
        </form>
      </Container>
    </>
  )
}
