import React from 'react'
import { useStyles } from './styles'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

import AccountCircle from '@material-ui/icons/AccountCircle'

import { useDispatch, useSelector } from 'react-redux'
import { UA } from '../../../actions/index'
import { Avatar, Button } from '@material-ui/core'
import { StyledBadge } from './styles'

import { Sidebar } from '../sidebar/sidebar'
import { withRouter } from 'react-router'

const App = ({ history }) => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const { userInfo } = useSelector((state) => state.userLogin)
  const { userDetails } = useSelector((state) => state.userDetails)

  const [anchorEl, setAnchorEl] = React.useState(null)

  const isMenuOpen = Boolean(anchorEl)

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const logout = () => {
    dispatch(UA.logout())
    handleMenuClose()
  }

  const profileHandler = () => {
    history.push('/profile')
    handleMenuClose()
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={profileHandler}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  )

  const avatarIcon = (
    <StyledBadge
      overlap='circle'
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      variant={'standard'}
    >
      <Avatar
        src={userDetails ? userDetails.image : userInfo && userInfo.image}
        alt={userInfo && userInfo.name}
        className={classes.avatar}
      />
    </StyledBadge>
  )

  return (
    <div className={classes.grow}>
      <AppBar
        position='static'
        color='transparent'
        elevation='0'
        style={{ marginBottom: 10 }}
      >
        <Toolbar>
          <Sidebar />
          <Typography className={classes.title} variant='h6' noWrap>
            FoneAPI
          </Typography>

          <div className={classes.grow} />
          {userInfo && (
            <div>
              <Button
                edge='end'
                aria-label='account of current user'
                aria-controls={menuId}
                aria-haspopup='true'
                onClick={handleProfileMenuOpen}
                color='inherit'
                startIcon={userInfo ? avatarIcon : <AccountCircle />}
              >
                <Typography>
                  {userDetails
                    ? userDetails.name.trim().split(' ')[0]
                    : userInfo && userInfo.name.trim().split(' ')[0]}
                </Typography>
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  )
}

export const Appbar = withRouter(App)
