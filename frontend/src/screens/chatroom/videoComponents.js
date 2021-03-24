import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import RestoreIcon from '@material-ui/icons/Restore'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled'

import { Button, Grid, IconButton, Typography } from '@material-ui/core'
import PhoneIcon from '@material-ui/icons/Phone'

export const CallUser = ({ callUser, calling, userName }) => {
  return (
    <Grid
      item
      xs={12}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <IconButton
        style={{ border: '1px solid green', color: 'green' }}
        onClick={callUser}
      >
        <PhoneIcon />
      </IconButton>
      <Typography style={{ textAlign: 'center', padding: 5 }} variant='h6'>
        {`Call ${userName}`}
      </Typography>
    </Grid>
  )
}

export const MeCalling = ({ userName, cancelCall }) => {
  return (
    <Grid
      item
      xs={12}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Button
        color='secondary'
        variant='contained'
        startIcon={<PhoneIcon />}
        onClick={cancelCall}
      >
        Cancel Call
      </Button>
      <Typography style={{ textAlign: 'center', padding: 5 }} variant='h6'>
        {`calling ${userName}`}
      </Typography>
    </Grid>
  )
}

export const UserHasCall = ({ answerCall, caller }) => {
  return (
    <Grid
      item
      xs={12}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Button
        variant='contained'
        color='primary'
        onClick={answerCall}
        startIcon={<PhoneIcon />}
      >
        Answer Call
      </Button>

      <Typography style={{ textAlign: 'center', padding: 5 }} variant='h6'>
        {`${caller} is calling...`}
      </Typography>
    </Grid>
  )
}

const useStyles = makeStyles({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  endCall: {
    color: 'red',
  },
})

export const VideoControls = ({ endCall }) => {
  const classess = useStyles()

  const changeHandler = (event, value) => {
    switch (value) {
      case 'end':
        endCall()
        break

      default:
        break
    }
  }

  return (
    <BottomNavigation
      onChange={changeHandler}
      showLabels
      className={classess.root}
    >
      <BottomNavigationAction label='Recents' icon={<RestoreIcon />} />
      <BottomNavigationAction
        value='end'
        label='End Call'
        className={classess.endCall}
        icon={<PhoneDisabledIcon />}
      />
      <BottomNavigationAction label='Nearby' icon={<LocationOnIcon />} />
    </BottomNavigation>
  )
}
