import React from "react";

import {
  Avatar,
  Container,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import { UA } from "../../actions/index";

import PhoneIcon from "@material-ui/icons/Phone";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

export const PhoneDetails = ({ contact, history }) => {
  const dispatch = useDispatch();

  const deleteHandler = () => {
    if (window.confirm(`Are you sure you want to delete ${contact.name}?`))
      dispatch(
        UA.deleteContactOrGroup({ type: "contacts", deleteId: contact._id })
      );
  };

  const callHandler = (mobileNum) => {
    history.push(`/call/${mobileNum}`);
  };

  return (
    <Container
      style={{
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 5,
      }}
    >
      <Paper
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
        elevation={12}
      >
        <div style={{ display: "flex", padding: 5 }}>
          <Avatar src={contact.image} alt={contact.name} />
          <Typography style={{ textAlign: "left", padding: 5 }}>
            <>
              <b>{contact.name + "  "}</b>
              {"+" + contact.mobile.mobile}
            </>
          </Typography>
        </div>

        <div>
          <IconButton
            variant="outlined"
            disabled={contact.mobile && contact.mobile.mobile ? false : true}
            onClick={() =>
              callHandler(contact.mobile ? contact.mobile.mobile : "none")
            }
          >
            <PhoneIcon
              style={{
                color:
                  contact.mobile && contact.mobile.mobile
                    ? "goldenrod"
                    : "grey",
              }}
              fontSize="small"
            />
          </IconButton>
          <IconButton variant="outlined" onClick={deleteHandler}>
            <DeleteForeverIcon color="secondary" fontSize="small" />
          </IconButton>
        </div>
      </Paper>
    </Container>
  );
};
