import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import { green } from '@material-ui/core/colors'
import Button from '@material-ui/core/Button'

import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import SearchIcon from '@material-ui/icons/Search'

import { useDispatch } from 'react-redux'

import { UA } from '../actions/index'
import { USER } from '../constants/index'
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
  search,
  loading,
  success,
  addContact,
  invited,
  setSuccess,
  user,
  setSearch,
  searchRef,
  entered,
  setEntered,
}) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const theme = useTheme()

  const xs = useMediaQuery(theme.breakpoints.down('xs'))

  const [isEmpty, setIsEmpty] = React.useState(true)

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  })

  const handleButtonClick = () => {
    if (!isEmpty) {
      dispatch(UA.search({ email: search }))
      setSearch('')
      searchRef.current.value = ''
    } else {
      dispatch({ type: USER.SEARCH_RESET })
      setSuccess(false)
      addContact(false)
    }
  }

  React.useEffect(() => {
    if (entered) {
      handleButtonClick()
    }
    return () => {
      setEntered(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entered])

  React.useEffect(() => {
    if (search.length > 0) {
      setIsEmpty(false)
    } else {
      setIsEmpty(true)
    }
    if (!user && invited && !invited.accept) {
      setIsEmpty(true)
    }
  }, [search, invited, addContact, setSuccess, user])

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        {xs ? (
          <IconButton
            variant='contained'
            color='primary'
            className={buttonClassname}
            disabled={loading}
            onClick={handleButtonClick}
          >
            {!isEmpty ? <SearchIcon /> : <ArrowBackIcon />}
          </IconButton>
        ) : (
          <Button
            variant='contained'
            color='primary'
            className={buttonClassname}
            disabled={loading}
            onClick={handleButtonClick}
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
