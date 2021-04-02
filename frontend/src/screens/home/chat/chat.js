import React from 'react'
import { Divider, IconButton, InputBase, Paper } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { useSelector, useDispatch } from 'react-redux'

import { CA, UA } from '../../../actions/index'
import { ModalMessage } from '../../../components/modalmessage'
import { ChatList } from './chatList'
import { useStyles } from './styles'

export const Chat = () => {
  const createGroupRef = React.useRef()
  const dispatch = useDispatch()
  const classes = useStyles()

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

  const createGroupHandler = (event, ref) => {
    const { key, keyCode } = event
    if (key === 'Enter' || keyCode === 'Enter' || keyCode === 13) {
      const answer = window.confirm(`Create ${ref.current.value} Group?`)
      if (answer) {
        dispatch(CA.createPublicRoom({ name: ref.current.value }))
      }
    } else if (event._reactName === 'onClick') {
      console.log(event._reactName)
      const answer = window.confirm(`Create ${ref.current.value} Group?`)
      if (answer) {
        dispatch(CA.createPublicRoom({ name: ref.current.value }))
      }
    }
  }

  return (
    <>
      <Paper className={classes.paper}>
        <div className={classes.cardActions}>
          {errorPublic && (
            <ModalMessage variant='error'>{errorPublic}</ModalMessage>
          )}
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
          />
        ))}
      </Paper>
    </>
  )
}
