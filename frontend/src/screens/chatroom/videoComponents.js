import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled'
import MicOffIcon from '@material-ui/icons/MicOff'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows'
import DesktopAccessDisabledIcon from '@material-ui/icons/DesktopAccessDisabled'
import MicIcon from '@material-ui/icons/Mic'
import VideocamIcon from '@material-ui/icons/Videocam'

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
      <div className='snippet' data-title='.dot-pulse'>
        <div className='stage'>
          <div className='dot-pulse'></div>
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
      <div className='snippet' data-title='.dot-pulse'>
        <div className='stage'>
          <div className='dot-pulse'></div>
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
  muted: { color: 'blue' },
  unmuted: { color: 'grey' },
})

export const VideoControls = ({ endCall, setMute, setOffScreen }) => {
  const classess = useStyles()

  const [mute, setMute1] = React.useState(false)
  const [offScreen, setOffScreen1] = React.useState(false)

  const changeHandler = (event, value) => {
    switch (value) {
      case 'offScreen':
        setOffScreen1((prev) => !prev)
        setOffScreen()
        break
      case 'mute':
        setMute1((prev) => !prev)
        setMute()
        break

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
      <BottomNavigationAction
        value='end'
        label='End Call'
        className={classess.endCall}
        icon={<PhoneDisabledIcon />}
      />
      <BottomNavigationAction
        className={mute ? classess.muted : classess.unmuted}
        value='mute'
        label='Mute'
        icon={mute ? <MicOffIcon /> : <MicIcon />}
      />
      <BottomNavigationAction
        value='offScreen'
        label={offScreen ? 'turn on Video' : 'turn off Video'}
        className={offScreen ? classess.muted : classess.unmuted}
        icon={offScreen ? <VideocamOffIcon /> : <VideocamIcon />}
      />
    </BottomNavigation>
  )
}

export const PublicVideoControls = ({
  setMute,
  setShareScreen,
  setOffScreen,
}) => {
  const classess = useStyles()
  const [mute, setMute1] = React.useState(false)
  const [shareScreen, setShareScreen1] = React.useState(false)
  const [offScreen, setOffScreen1] = React.useState(false)

  const changeHandler = (event, value) => {
    switch (value) {
      case 'offScreen':
        setOffScreen1((prev) => !prev)
        setOffScreen()
        break
      case 'mute':
        setMute1((prev) => !prev)
        setMute()
        break
      case 'screen':
        setShareScreen1((prev) => !prev)
        setShareScreen(shareScreen)
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
      <BottomNavigationAction
        value='screen'
        label={shareScreen ? 'unshare' : 'share Screen'}
        className={shareScreen ? classess.muted : classess.unmuted}
        icon={
          shareScreen ? <DesktopAccessDisabledIcon /> : <DesktopWindowsIcon />
        }
      />

      <BottomNavigationAction
        value='offScreen'
        label={offScreen ? 'turn on Video' : 'turn off Video'}
        className={offScreen ? classess.muted : classess.unmuted}
        icon={offScreen ? <VideocamOffIcon /> : <VideocamIcon />}
      />

      <BottomNavigationAction
        className={mute ? classess.muted : classess.unmuted}
        value='mute'
        label={mute ? 'unmute' : 'Mute'}
        icon={mute ? <MicOffIcon /> : <MicIcon />}
      />
    </BottomNavigation>
  )
}
