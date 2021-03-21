import React from 'react'
import Peer from 'simple-peer'

import {
  Card,
  CardActions,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core'
import PhoneIcon from '@material-ui/icons/Phone'
import PeopleIcon from '@material-ui/icons/People'
import ChatIcon from '@material-ui/icons/Chat'
import { useStyles } from './styles.js'
import { AddButton } from '../../components/addbutton'

export const Home = ({ socket, history }) => {
  const classes = useStyles()

  const [panel, setPanel] = React.useState('contacts')

  const contacts = (
    <Card className={classes.paper}>
      <CardActions className={classes.cardActions}>
        <AddButton />
        <Typography style={{ flex: 1 }}>Add Contacts</Typography>
      </CardActions>
      <Divider />
      Hello
    </Card>
  )
  const chat = (
    <Card className={classes.paper}>
      <CardActions className={classes.cardActions}>
        <AddButton />
        <Typography style={{ flex: 1 }}>New conversation</Typography>
      </CardActions>
      <Divider />
      Hello
    </Card>
  )
  const call = (
    <Card className={classes.paper}>
      <CardActions className={classes.cardActions}>
        <AddButton />
        <Typography style={{ flex: 1 }}>New call</Typography>
        <IconButton></IconButton>
      </CardActions>
      <Divider />
      Hello
    </Card>
  )

  React.useEffect(() => {}, [])

  return (
    <>
      <Grid container>
        <Grid item xs={1} className={classes.sideIcons}>
          <IconButton
            className={classes.icon}
            onClick={() => setPanel('contacs')}
          >
            <PeopleIcon closePanel={setPanel} />
          </IconButton>
          <IconButton className={classes.icon} onClick={() => setPanel('chat')}>
            <ChatIcon closePanel={setPanel} />
          </IconButton>
          <IconButton className={classes.icon} onClick={() => setPanel('call')}>
            <PhoneIcon closePanel={setPanel} />
          </IconButton>
        </Grid>
        <Grid item xs={4} className={classes.sidePanel}>
          {panel === 'chat' ? chat : panel === 'call' ? call : contacts}
        </Grid>
      </Grid>
    </>
  )
}
