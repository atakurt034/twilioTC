import React from 'react'

import {
  Card,
  CardActions,
  Divider,
  Typography,
  IconButton,
  InputBase,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

import { AddButton } from '../../components/addbutton'
import { LoadingButton } from '../../components/loadingbutton'

import { useSelector } from 'react-redux'

export const Panels = (classes, userInfo) => {
  const { user, loading: loader } = useSelector((state) => state.userSearch)

  const [addContact, setAddContact] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const [success, setSuccess] = React.useState(false)

  React.useEffect(() => {
    if (user) {
      setSuccess(true)
      setLoading(false)
    }
    if (loader) {
      setSuccess(false)
      setLoading(true)
    }
  }, [user, loader])

  const changeHandler = (event) => {
    setSearch(event.target.value)
    setSuccess(false)
  }

  const addContactHandler = () => {
    setAddContact((prev) => !prev)
    // dispatch(UA.addContact)
  }

  const add_false = (
    <>
      <AddButton />
      <Typography style={{ flex: 1 }}>Add Contacts</Typography>
    </>
  )

  const add_true = (
    <div
      style={{
        padding: '10px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder='Search…'
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          onChange={changeHandler}
        />
      </div>
      <div style={{ marginLeft: 70 }}>
        <LoadingButton loading={loading} success={success} search={search} />
      </div>
    </div>
  )

  const contacts = (
    <Card className={classes.paper}>
      <CardActions
        className={classes.cardActions}
        onClick={!addContact && addContactHandler}
      >
        {addContact ? add_true : add_false}
      </CardActions>
      <Divider />
      {userInfo &&
        userInfo.contacts.map((contact) => {
          return <p key={contact.email}>{contact.name}</p>
        })}
      {user ? user[0].email : loading ? 'searching..' : ''}
    </Card>
  )
  const chat = (
    <Card className={classes.paper}>
      <CardActions className={classes.cardActions}>
        <AddButton />
        <Typography style={{ flex: 1 }}>New conversation</Typography>
      </CardActions>
      <Divider />
      List of Chats
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
      List of Calls
    </Card>
  )
  return { contacts, call, chat }
}
