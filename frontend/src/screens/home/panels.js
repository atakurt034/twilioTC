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

import { useDispatch } from 'react-redux'

import { UA } from '../../actions/index'

export const Panels = (classes, userInfo) => {
  const dispatch = useDispatch()

  const [addContact, setAddContact] = React.useState(false)

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
        />
      </div>
      <div style={{ marginLeft: 70 }}>loading...</div>
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
