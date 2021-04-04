import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import { green } from '@material-ui/core/colors'
import Button from '@material-ui/core/Button'

import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import SearchIcon from '@material-ui/icons/Search'

import { IconButton, useMediaQuery, useTheme } from '@material-ui/core'

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

export const LoadingButton = ({
  loading,
  searched,
  number,
  submitHandler,
  backHandler,
  mobile,
}) => {
  const classes = useStyles()
  const theme = useTheme()

  const xs = useMediaQuery(theme.breakpoints.down('xs'))

  const [isEmpty, setIsEmpty] = React.useState(true)

  const buttonClassname = clsx({
    [classes.buttonSuccess]: mobile ? true : false,
  })

  React.useEffect(() => {
    if (number) {
      setIsEmpty(false)
    } else {
      setIsEmpty(true)
    }
    if (!searched) {
      setIsEmpty(true)
    }
  }, [searched, number])

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        {xs ? (
          <IconButton
            variant='contained'
            color='primary'
            className={buttonClassname}
            disabled={!number}
            onClick={isEmpty ? submitHandler : backHandler}
          >
            {isEmpty ? <SearchIcon /> : <ArrowBackIcon />}
          </IconButton>
        ) : (
          <Button
            variant='contained'
            color='primary'
            className={buttonClassname}
            disabled={!number}
            onClick={submitHandler}
          >
            {!isEmpty ? 'Search' : 'Back'}
          </Button>
        )}
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </div>
    </div>
  )
}
