import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import RestoreIcon from '@material-ui/icons/Restore'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled'

import { Button, Grid, IconButton, Typography } from '@material-ui/core'
import PhoneIcon from '@material-ui/icons/Phone'
import './styles.scss'

export const CallUser = ({ callUser, calling, userName }) => {
  return (
    <Grid
      item
      xs={12}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
      <div class='snippet' data-title='.dot-pulse'>
        <div class='stage'>
          <div class='dot-pulse'></div>
        </div>
      </div>
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
      }}
    >
      <Button
        variant='contained'
        style={{ backgroundColor: 'green', color: '#fff' }}
        onClick={answerCall}
        startIcon={<PhoneIcon />}
      >
        Answer Call
      </Button>

      <Typography
        component='span'
        style={{ textAlign: 'center', padding: 5 }}
        variant='h6'
      >
        {`${caller} is calling...`}
      </Typography>
      <div class='snippet' data-title='.dot-pulse'>
        <div class='stage'>
          <div class='dot-pulse'></div>
        </div>
      </div>
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
