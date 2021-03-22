import React from 'react'

import {
  Card,
  CardActions,
  Divider,
  Typography,
  IconButton,
  InputBase,
  Button,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

import { AddButton } from '../../components/addbutton'
import { LoadingButton } from '../../components/loadingbutton'

import { useSelector } from 'react-redux'

export const Panels = (classes, userInfo, toggleAddContact) => {
  const { user, loading: loader, error } = useSelector(
    (state) => state.userSearch
  )

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
    if (error) {
      setLoading(false)
      setSuccess(false)
    }
  }, [user, loader, error])

  const changeHandler = (event) => {
    setSearch(event.target.value)
    setSuccess(false)
  }

  const addContactHandler = () => {
    setAddContact((prev) => !prev)
    // dispatch(UA.addContact)
  }

  const add_false = (
    <Button
      size='small'
      style={{ padding: 0 }}
      startIcon={<AddButton />}
      onClick={addContactHandler}
    >
      <Typography style={{ flex: 1 }}>Add Contacts</Typography>
    </Button>
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
          placeholder='Search…'
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          onChange={changeHandler}
        />
      </div>
      <div style={{}}>
        <LoadingButton
          loading={loading}
          success={success}
          search={search}
          addContact={setAddContact}
        />
      </div>
    </div>
  )

  const contacts = (
    <Card className={classes.paper}>
      <CardActions className={classes.cardActions}>
        {addContact ? add_true : add_false}
      </CardActions>
      <Divider />
      {userInfo &&
        !addContact &&
        userInfo.contacts.map((contact) => {
          return <p key={contact.email}>{contact.name}</p>
        })}
      {error
        ? addContact && (
            <span>
              No Results Found{' '}
              <button onClick={() => setAddContact(false)}>Back</button>{' '}
            </span>
          )
        : user
        ? user[0].email
        : loading
        ? 'searching..'
        : ''}
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
