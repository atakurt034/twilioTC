import React from 'react'

import { Typography, InputBase, Button } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

import { LoadingButton } from '../../components/loadingbutton'
import { UserList } from './userList'

import AddCircleIcon from '@material-ui/icons/AddCircle'

import { useSelector, useDispatch } from 'react-redux'
import { USER } from '../../constants/index'
import { UA, CA } from '../../actions/index'

import { PanelTypes } from './panelTypes'

export const Panels = (classes, userInfo, history) => {
  const dispatch = useDispatch()

  const { user, loading: loader, error } = useSelector(
    (state) => state.userSearch
  )
  const { status } = useSelector((state) => state.userAddContact)

  const [addContact, setAddContact] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const [success, setSuccess] = React.useState(false)
  const invited =
    user && user[0].invites.find((invite) => invite._id === userInfo._id)

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
    <div
      style={{
        padding: '4px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexGrow: 1,
      }}
    >
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
          onChange={changeHandler}
        />
      </div>
      <div>
        <LoadingButton
          invited={invited}
          loading={loading}
          success={success}
          search={search}
          setSuccess={setSuccess}
          addContact={setAddContact}
        />
      </div>
    </div>
  )
  const { contacts, call, chat } = PanelTypes(
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
    createGroupHandler
  )

  return { contacts, call, chat }
}
