import React from 'react'
import { Button, Grid, IconButton, Typography } from '@material-ui/core'
import { useStyles } from './styles'

import CallIcon from '@material-ui/icons/Call'

export const Dialer = ({ setNumbers, callHandler, disabled }) => {
  const classes = useStyles()

  const clickHandler = (number) => {
    if (number === 'del') {
      setNumbers('')
    } else {
      setNumbers((prev) => (prev += number.toString()))
    }
  }

  return (
    <>
      <Grid item xs={12}>
        <Button
          onClick={() => clickHandler(1)}
          variant='outlined'
          className={classes.buttons}
        >
          <div>
            <Typography variant='h6' className={classes.numbers}>
              1
            </Typography>
            <Typography variant='caption' className={classes.numbers}>
              .
            </Typography>
          </div>
        </Button>
        <Button
          onClick={() => clickHandler(2)}
          variant='outlined'
          className={classes.buttons}
        >
          <div>
            <Typography variant='h6' className={classes.numbers}>
              2
            </Typography>
            <Typography variant='caption' className={classes.numbers}>
              abc
            </Typography>
          </div>
        </Button>
        <Button
          onClick={() => clickHandler(3)}
          variant='outlined'
          className={classes.buttons}
        >
          <div>
            <Typography variant='h6' className={classes.numbers}>
              3
            </Typography>
            <Typography variant='caption' className={classes.numbers}>
              def
            </Typography>
          </div>
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          onClick={() => clickHandler(4)}
          variant='outlined'
          className={classes.buttons}
        >
          <div>
            <Typography variant='h6' className={classes.numbers}>
              4
            </Typography>
            <Typography variant='caption' className={classes.numbers}>
              ghi
            </Typography>
          </div>
        </Button>
        <Button
          onClick={() => clickHandler(5)}
          variant='outlined'
          className={classes.buttons}
        >
          <div>
            <Typography variant='h6' className={classes.numbers}>
              5
            </Typography>
            <Typography variant='caption' className={classes.numbers}>
              jkl
            </Typography>
          </div>
        </Button>
        <Button
          onClick={() => clickHandler(6)}
          variant='outlined'
          className={classes.buttons}
        >
          <div>
            <Typography>6</Typography>
            <Typography variant='caption' className={classes.numbers}>
              mno
            </Typography>
          </div>
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          onClick={() => clickHandler(7)}
          variant='outlined'
          className={classes.buttons}
        >
          <div>
            <Typography variant='h6' className={classes.numbers}>
              7
            </Typography>
            <Typography variant='caption' className={classes.numbers}>
              pqrs
            </Typography>
          </div>
        </Button>
        <Button
          onClick={() => clickHandler(8)}
          variant='outlined'
          className={classes.buttons}
        >
          <div>
            <Typography variant='h6' className={classes.numbers}>
              8
            </Typography>
            <Typography variant='caption' className={classes.numbers}>
              tuv
            </Typography>
          </div>
        </Button>
        <Button
          onClick={() => clickHandler(9)}
          variant='outlined'
          className={classes.buttons}
        >
          <div>
            <Typography variant='h6' className={classes.numbers}>
              9
            </Typography>
            <Typography variant='caption' className={classes.numbers}>
              wxyz
            </Typography>
          </div>
        </Button>
      </Grid>
      <Grid item xs={12}>
        <IconButton
          disabled={disabled}
          onClick={callHandler}
          style={{ border: '1px solid #bbb' }}
          className={classes.buttons}
        >
          <CallIcon style={{ color: disabled ? 'grey' : 'green' }} />
        </IconButton>
        <Button
          onClick={() => clickHandler(0)}
          variant='outlined'
          className={classes.buttons}
        >
          <div>
            <Typography variant='h6' className={classes.numbers}>
              0
            </Typography>
            <Typography variant='caption' className={classes.numbers}>
              +
            </Typography>
          </div>
        </Button>
        <Button
          onClick={() => clickHandler('del')}
          variant='outlined'
          className={classes.buttons}
        >
          <div>
            <Typography variant='h6' className={classes.numbers}>
              Clear
            </Typography>
          </div>
        </Button>
      </Grid>
    </>
  )
}
