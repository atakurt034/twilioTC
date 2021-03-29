import React from 'react'

import {
  Button,
  Card,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import AddCircleIcon from '@material-ui/icons/AddCircle'

import 'react-phone-input-2/lib/high-res.css'

import { ContactList } from './contactList'
import { ChatList } from './chatList'
import { UA } from '../../actions/index'
import { ModalMessage } from '../../components/modalmessage'
import { TextForm } from './textForm'

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
  history,
  createGroupHandler,
  textHandler
) => {
  const createGroupRef = React.useRef()
  const dispatch = useDispatch()
  const { userDetails } = useSelector((state) => state.userDetails)
  const { chatroom, error: errorPublic } = useSelector(
    (state) => state.chatroomPublicCreate
  )

  const [rooms, setRooms] = React.useState([])

  React.useEffect(() => {
    dispatch(UA.getDetails())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatroom])

  React.useEffect(() => {
    if (userDetails) {
      userDetails.privaterooms.map((room) =>
        room.users.map(
          (user) =>
            user._id !== userDetails._id &&
            setRooms((prev) => [
              ...prev,
              { name: user.name, _id: room._id, type: 'Private' },
            ])
        )
      )
      userDetails.chatrooms.map((room) =>
        setRooms((prev) => [
          ...prev,
          { name: room.name, _id: room._id, type: 'Public' },
        ])
      )
    }
    return () => {
      setRooms([])
    }
  }, [userDetails])

  const contacts = (
    <Paper className={classes.paper}>
      <div className={classes.cardActions}>
        {addContact ? add_true : add_false}
      </div>
      <Divider />
      {userDetails &&
        !addContact &&
        userDetails.invites.map((invite) => {
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
              <Typography variant='h6' style={{ padding: 3 }}>
                {invite.user
                  ? invite.user.email
                  : invite.chatroom && invite.chatroom.name}
              </Typography>
              <Button variant='outlined' onClick={() => acceptHandler(invite)}>
                Accept
              </Button>
            </div>
          )
        })}
      {userDetails &&
        !addContact &&
        userDetails.contacts.map((contact, index) => {
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
    <Paper className={classes.paper}>
      {errorPublic && (
        <ModalMessage variant='error'>{errorPublic}</ModalMessage>
      )}
      <div className={classes.cardActions}>
        <IconButton
          style={{ padding: 5 }}
          onClick={(e) => createGroupHandler(e, createGroupRef)}
        >
          <AddCircleIcon style={{ color: 'green', fontSize: 40 }} />
        </IconButton>

        <InputBase
          onKeyUp={(e) => createGroupHandler(e, createGroupRef)}
          inputRef={createGroupRef}
          style={{ padding: 5 }}
          placeholder='Create Group Chat'
        />
      </div>
      <Divider />
      {rooms.map((room) => (
        <ChatList
          key={room._id}
          id={room._id}
          name={room.name}
          type={room.type}
          history={history}
        />
      ))}
    </Paper>
  )

  const call = (
    <Card className={classes.paper}>
      <div className={classes.cardActions}>
        <AddCircleIcon style={{ color: 'green', fontSize: 40 }} />
        <Typography style={{ flex: 1 }}>New call</Typography>
      </div>
      <Divider />
      List of Calls
    </Card>
  )
  const text = <TextForm />
  return { contacts, chat, call, text }
}
