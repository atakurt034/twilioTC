import React from "react";

import {
  Button,
  Card,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import PhoneInput from "react-phone-input-2";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import PhoneCallbackIcon from "@material-ui/icons/PhoneCallback";

import "react-phone-input-2/lib/high-res.css";

import { ContactList } from "./contactList";
import { PhoneDetails } from "./phoneDetails";
import { ChatList } from "./chatList";
import { UA } from "../../actions/index";
import { ModalMessage } from "../../components/modalmessage";
import { TextForm } from "./textForm";

export const PanelTypes = (
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
  createGroupHandler,
  panelHandler
) => {
  const createGroupRef = React.useRef();
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.userDetails);
  const { chatroom, error: errorPublic } = useSelector(
    (state) => state.chatroomPublicCreate
  );

  const [rooms, setRooms] = React.useState([]);

  React.useEffect(() => {
    dispatch(UA.getDetails());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatroom]);

  React.useEffect(() => {
    if (userDetails) {
      userDetails.privaterooms.map((room) =>
        room.users.map(
          (user) =>
            user._id !== userDetails._id &&
            setRooms((prev) => [
              ...prev,
              { name: user.name, _id: room._id, type: "Private" },
            ])
        )
      );
      userDetails.chatrooms.map((room) =>
        setRooms((prev) => [
          ...prev,
          { name: room.name, _id: room._id, type: "Public" },
        ])
      );
    }
    return () => {
      setRooms([]);
    };
  }, [userDetails]);

  const contacts = (
    <Paper className={classes.paper}>
      <div className={classes.cardActions}>
        {addContact ? add_true : add_false}
      </div>
      <Divider />
      {userDetails &&
        !addContact &&
        userDetails.invites.map((invite) => {
          return (
            <div
              key={invite._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 5,
              }}
            >
              <Typography variant="h6" style={{ padding: 3 }}>
                {invite.user
                  ? invite.user.email
                  : invite.chatroom && invite.chatroom.name}
              </Typography>
              <Button variant="outlined" onClick={() => acceptHandler(invite)}>
                Accept
              </Button>
            </div>
          );
        })}
      {userDetails &&
        !addContact &&
        userDetails.contacts.map((contact, index) => {
          return (
            <ContactList
              key={contact._id}
              history={history}
              contact={contact}
              panelHandler={panelHandler}
            />
          );
        })}

      {error ? (
        error === "added" ? (
          addContact && (
            <div>
              contact already added <button onClick={backHandler}>Back</button>{" "}
            </div>
          )
        ) : (
          addContact && (
            <div>
              No Results Found <button onClick={backHandler}>Back</button>{" "}
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
        "searching.."
      ) : (
        ""
      )}
    </Paper>
  );

  const chat = (
    <Paper className={classes.paper}>
      {errorPublic && (
        <ModalMessage variant="error">{errorPublic}</ModalMessage>
      )}
      <div className={classes.cardActions}>
        <IconButton
          style={{ padding: 5 }}
          onClick={(e) => createGroupHandler(e, createGroupRef)}
        >
          <AddCircleIcon style={{ color: "green", fontSize: 40 }} />
        </IconButton>

        <InputBase
          onKeyUp={(e) => createGroupHandler(e, createGroupRef)}
          inputRef={createGroupRef}
          style={{ padding: 5 }}
          placeholder="Create Group Chat"
        />
      </div>
      <Divider />
      {rooms.map((room) => (
        <ChatList
          key={room._id}
          id={room._id}
          name={room.name}
          type={room.type}
          history={history}
        />
      ))}
    </Paper>
  );

  const [status, setStatus] = React.useState(false);
  const [mobileNum, setMobileNum] = React.useState("");

  const addMobileHandler = () => {
    setStatus((prev) => !prev);
  };

  const callNumber = (
    <IconButton>
      <PhoneCallbackIcon style={{ color: "green", fontSize: 40 }} />
    </IconButton>
  );

  const backButton = (
    <IconButton onClick={addMobileHandler}>
      <KeyboardBackspaceIcon style={{ color: "green", fontSize: 40 }} />
    </IconButton>
  );

  const callDefault = (
    <IconButton onClick={addMobileHandler} style={{ padding: 5 }}>
      <AddCircleIcon style={{ color: "green", fontSize: 40 }} />
      <Typography style={{ flex: 1 }}>New call</Typography>
    </IconButton>
  );

  const inputMobileNum = (
    <>
      <PhoneInput
        enableSearch="true"
        onChange={(e) => setMobileNum(e)}
        defaultErrorMessage="input only numbers"
        placeholder="input mobile number"
        inputStyle={{ width: "88%" }}
        containerStyle={{
          margin: "2% 0 2% 1%",
        }}
      />
      {mobileNum === "" ? backButton : callNumber}
    </>
  );

  const call = (
    <Card className={classes.paper}>
      <div className={classes.cardActions}>
        {status ? inputMobileNum : callDefault}
      </div>
      <Divider />
      {status ? (
        userDetails &&
        !addContact &&
        userDetails.contacts.map((contact, index) => {
          return (
            <PhoneDetails
              key={contact._id}
              history={history}
              contact={contact}
              panelHandler={panelHandler}
            />
          );
        })
      ) : (
        <h2>History of Calls</h2>
      )}
    </Card>
  );
  const text = <TextForm history={history} />;
  return { contacts, chat, call, text };
};
