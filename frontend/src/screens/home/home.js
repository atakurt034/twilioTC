import React from 'react'

import { IconButton, Grid } from '@material-ui/core'
import PhoneIcon from '@material-ui/icons/Phone'
import PeopleIcon from '@material-ui/icons/People'
import ChatIcon from '@material-ui/icons/Chat'
import { useStyles } from './styles.js'

import { useDispatch, useSelector } from 'react-redux'
import { UA } from '../../actions/index'
import { Panels } from './panels'

export const Home = ({ socket, history }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const { userInfo } = useSelector((state) => state.userLogin)
  const { userDetails } = useSelector((state) => state.userDetails)
  const { status } = useSelector((state) => state.userAccept)

  const [panel, setPanel] = React.useState('contacts')

  React.useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    if (status && status.message === 'updated') {
      dispatch(UA.getDetails())
    }
    dispatch(UA.getDetails())
  }, [userInfo, history, dispatch, status])

  const panelHandler = (type) => {
    setPanel(type)
    dispatch(UA.getDetails())
  }

  return (
    <>
      <Grid container>
        <Grid item xs={1} className={classes.sideIcons}>
          <IconButton
            className={classes.icon}
            onClick={() => panelHandler('contacts')}
          >
            <PeopleIcon />
          </IconButton>
          <IconButton
            className={classes.icon}
            onClick={() => panelHandler('chat')}
          >
            <ChatIcon />
          </IconButton>
          <IconButton
            className={classes.icon}
            onClick={() => panelHandler('call')}
          >
            <PhoneIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12} sm={6} lg={4} className={classes.sidePanel}>
          {panel === 'chat'
            ? Panels(classes).chat
            : panel === 'call'
            ? Panels(classes).call
            : Panels(classes, userDetails, history).contacts}
        </Grid>
      </Grid>
    </>
  )
}
