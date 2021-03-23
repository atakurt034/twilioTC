import React from 'react'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import HomeIcon from '@material-ui/icons/Home'

import MenuIcon from '@material-ui/icons/Menu'
import { IconButton } from '@material-ui/core'
import { withRouter } from 'react-router'

const Side = ({ history, match }) => {
  const [state, setState] = React.useState(false)

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setState(open)
  }

  const clickHandler = (type) => {
    switch (type) {
      case 'home':
        history.push('/')
        break
      default:
        break
    }
  }

  const list = () => (
    <div
      style={{ width: 200 }}
      role='presentation'
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button onClick={() => clickHandler('home')}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={'Home'} />
        </ListItem>
      </List>
      <Divider />
      <List>List of icons</List>
    </div>
  )

  return (
    <div>
      <SwipeableDrawer
        open={state}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list()}
      </SwipeableDrawer>
      <IconButton
        style={{ margin: 0, left: -10 }}
        onClick={() => setState(true)}
      >
        <MenuIcon />
      </IconButton>
    </div>
  )
}

export const Sidebar = withRouter(Side)
