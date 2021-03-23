import { Button, Card, Divider, Paper, Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { AddButton } from '../../components/addbutton'

import { ContactList } from './contactList'

export const PanelTypes = (
  classes,
  addContact,
  add_true,
  add_false,
  userInfo,
  acceptHandler,
  error,
  backHandler,
  user,
  invited,
  UserList,
  loading,
  history
) => {
  const { userDetails } = useSelector((state) => state.userDetails)

  const contacts = (
    <Paper className={classes.paper}>
      <div className={classes.cardActions}>
        {addContact ? add_true : add_false}
      </div>
      <Divider />
      {userInfo &&
        !addContact &&
        userInfo.invites.map((invite) => {
          return (
            <div
              key={invite._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 5,
              }}
            >
              <Typography>
                {invite._id.name} {invite._id.email}
              </Typography>
              <Button
                variant='outlined'
                onClick={() => acceptHandler(invite._id)}
              >
                Accept
              </Button>
            </div>
          )
        })}
      {userDetails &&
        !addContact &&
        userDetails.contacts.map((contact) => {
          return (
            <ContactList
              key={contact._id}
              history={history}
              contact={contact}
            />
          )
        })}

      {error ? (
        error === 'added' ? (
          addContact && (
            <div>
              contact already added <button onClick={backHandler}>Back</button>{' '}
            </div>
          )
        ) : (
          addContact && (
            <div>
              No Results Found <button onClick={backHandler}>Back</button>{' '}
            </div>
          )
        )
      ) : user ? (
        invited && !invited.accept ? (
          <UserList user={user[0]} backHandler={backHandler} />
        ) : (
          <UserList user={user[0]} backHandler={backHandler} />
        )
      ) : loading ? (
        'searching..'
      ) : (
        ''
      )}
    </Paper>
  )

  const chat = (
    <Card className={classes.paper}>
      <div className={classes.cardActions}>
        <AddButton />
        <Typography style={{ flex: 1 }}>New conversation</Typography>
      </div>
      <Divider />
      List of Chats
    </Card>
  )
  const call = (
    <Card className={classes.paper}>
      <div className={classes.cardActions}>
        <AddButton />
        <Typography style={{ flex: 1 }}>New call</Typography>
      </div>
      <Divider />
      List of Calls
    </Card>
  )
  return { contacts, chat, call }
}
