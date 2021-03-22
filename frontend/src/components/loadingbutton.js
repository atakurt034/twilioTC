import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import { green } from '@material-ui/core/colors'
import Button from '@material-ui/core/Button'

import { useDispatch } from 'react-redux'

import { UA } from '../actions/index'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}))

export const LoadingButton = ({ search, loading, success }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  })

  const handleButtonClick = () => {
    dispatch(UA.search({ email: search }))
  }

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Button
          variant='contained'
          color='primary'
          className={buttonClassname}
          disabled={loading}
          onClick={handleButtonClick}
        >
          Search
        </Button>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </div>
    </div>
  )
}
