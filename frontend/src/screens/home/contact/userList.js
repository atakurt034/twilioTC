import React from 'react'

import { Button, Grid, Typography } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { UA } from '../../../actions/index'
import { USER } from '../../../constants/index'

export const UserList = ({ user, backHandler }) => {
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.userLogin)

  const [invite, setInvite] = React.useState()

  const inviteHandler = () => {
    if (user) {
      dispatch(UA.addContact({ email: user.email }))
    }
    dispatch(UA.getDetails())
    dispatch({ type: USER.ADD_CONTACT_RESET })
    setTimeout(() => backHandler(), 2000)
  }

  React.useEffect(() => {
    if (userInfo) {
      const invited = user
        ? user.invites.find((invite) => invite._id === userInfo._id)
        : false
      setInvite(invited)
    }
  }, [user, userInfo])

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
          {user && user.name} {user && user.email}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        {user ? (
          <Button
            variant='outlined'
            onClick={inviteHandler}
            disabled={invite && !invite.accept}
          >
            {invite ? !invite.accept && 'pending' : 'invite'}
          </Button>
        ) : (
          'user not found'
        )}
      </Grid>
    </Grid>
  )
}
