import React from 'react'
import AddCircleIcon from '@material-ui/icons/AddCircle'

import {
  Typography,
  InputBase,
  Button,
  Paper,
  Divider,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { useSelector, useDispatch } from 'react-redux'

import { LoadingButton } from '../../../components/loadingbutton'
import { USER } from '../../../constants/index'
import { UA } from '../../../actions/index'
import { UserList } from './userList'
import { ContactList } from './contactList'
import { useStyles } from './styles.js'

export const Contacts = () => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const searchRef = React.useRef()

  const { user, loading: loader, error } = useSelector(
    (state) => state.userSearch
  )
  const { status } = useSelector((state) => state.userAddContact)
  const { userDetails } = useSelector((state) => state.userDetails)

  const [addContact, setAddContact] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const [success, setSuccess] = React.useState(false)
  const invited = user ? true : false

  React.useEffect(() => {
    if (user) {
      setSuccess(true)
      setLoading(false)
    }
    if (loader) {
      setSuccess(false)
      setLoading(true)
    }
    if (error) {
      setLoading(false)
      setSuccess(false)
    }
  }, [user, loader, error, status, dispatch])

  const changeHandler = (event) => {
    setSearch(event.target.value)
    setSuccess(false)
  }

  const addContactHandler = () => {
    setAddContact((prev) => !prev)
  }

  const backHandler = () => {
    setAddContact(false)
    setSearch('')
    dispatch({ type: USER.SEARCH_RESET })
  }

  const acceptHandler = (invite) => {
    const type = invite.user ? 'user' : invite.chatroom && 'chatroom'
    const userId = invite.user && invite.user._id
    const chatroomId = invite.chatroom && invite.chatroom._id
    const inviteId = invite._id

    dispatch(UA.accept({ userId, inviteId, chatroomId, type }))
    dispatch({ type: USER.ACCEPT_RESET })
  }

  const add_false = (
    <div>
      <Button
        startIcon={<AddCircleIcon style={{ color: 'green', fontSize: 40 }} />}
        onClick={addContactHandler}
      >
        <Typography style={{ flex: 1 }}>Add Contacts</Typography>
      </Button>
    </div>
  )

  const add_true = (
    <div className={classes.addTrue}>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          autoFocus
          placeholder='Input email or name'
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          inputRef={searchRef}
          onChange={changeHandler}
        />
      </div>
      <div>
        <LoadingButton
          searchRef={searchRef}
          user={user}
          invited={invited}
          loading={loading}
          success={success}
          search={search}
          setSuccess={setSuccess}
          addContact={setAddContact}
          setSearch={setSearch}
        />
      </div>
    </div>
  )
  return (
    <Paper className={classes.paper}>
      <div className={classes.cardActions}>
        {addContact ? add_true : add_false}
      </div>
      <Divider />
      {userDetails &&
        !addContact &&
        userDetails.invites.map((invite) => {
          return (
            <div key={invite._id} className={classes.invites}>
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
          return <ContactList key={contact._id} contact={contact} />
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
}
