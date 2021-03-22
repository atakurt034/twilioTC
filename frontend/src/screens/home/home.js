import React from 'react'
import Peer from 'simple-peer'

import { IconButton, Grid } from '@material-ui/core'
import PhoneIcon from '@material-ui/icons/Phone'
import PeopleIcon from '@material-ui/icons/People'
import ChatIcon from '@material-ui/icons/Chat'
import { useStyles } from './styles.js'

import { useSelector } from 'react-redux'
import { Panels } from './panels'

export const Home = ({ socket, history }) => {
  const classes = useStyles()

  const { userInfo } = useSelector((state) => state.userLogin)

  const [panel, setPanel] = React.useState('contacts')

  React.useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
  }, [userInfo, history])

  return (
    <>
      <Grid container>
        <Grid item xs={1} className={classes.sideIcons}>
          <IconButton
            className={classes.icon}
            onClick={() => setPanel('contacts')}
          >
            <PeopleIcon />
          </IconButton>
          <IconButton className={classes.icon} onClick={() => setPanel('chat')}>
            <ChatIcon />
          </IconButton>
          <IconButton className={classes.icon} onClick={() => setPanel('call')}>
            <PhoneIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12} sm={6} lg={4} className={classes.sidePanel}>
          {panel === 'chat'
            ? Panels(classes).chat
            : panel === 'call'
            ? Panels(classes).call
            : Panels(classes, userInfo).contacts}
        </Grid>
      </Grid>
    </>
  )
}
