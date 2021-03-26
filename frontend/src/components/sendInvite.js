import React from 'react'

import { Button, Grid, Typography } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { UA } from '../actions/index'

export const UserList = ({ user, chatroomId }) => {
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.userLogin)

  const [invite, setInvite] = React.useState(false)

  const inviteHandler = () => {
    if (user) {
      dispatch(UA.sendInvite({ id: user._id, chatroomId }))
    }
    setInvite(true)
  }

  React.useEffect(() => {
    if (userInfo) {
      const invited = user.invites.find(
        (invite) => invite.chatroom === chatroomId
      )
      setInvite(invited)
    }
    return () => setInvite('')
  }, [chatroomId, user, userInfo])

  return (
    <Grid
      container
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 5,
      }}
    >
      <Grid item xs={8}>
        <Typography style={{ textAlign: 'left', padding: 5 }}>
          {user.name} {user.email}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Button variant='outlined' onClick={inviteHandler} disabled={invite}>
          {invite ? 'pending' : 'invite'}
        </Button>
      </Grid>
    </Grid>
  )
}
