import React, { Component } from "react";
import firebase from "../../firebase";
import { Image, Button } from "semantic-ui-react";
import AvatarEditor from "react-avatar-editor";
import { connect } from "react-redux";

import { Grid, Header, Icon, Dropdown, Modal, Input } from "semantic-ui-react";
class UserPanel extends Component {
  state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: "",
    croppedImageUrl: "",
    blob: "",
    storageRef: firebase.storage().ref(),
    userRef: firebase.auth().currentUser,
    usersRef: firebase.database().ref("users"),
    messagesRef: firebase.database().ref(`messages/`),
    privateMessagesRef: firebase.database().ref("privateMessages"),
    newProfilePicture: "",
    metadata: {
      contentType: "image/jpeg",
    },
    uploadCroppedImage: "",
    messagesArray: [],
  };

  openModal = () => {
    this.setState({ modal: true });
    this.state.messagesRef
      .child(this.props.currentChannel.id)
      .on("value", (snap) => {
        const newDp = snap.val();
        const messagesArray = [];
        const keysArray = Object.entries(newDp);
        keysArray.map((array) => {
          let messages = {};
          messages["messageID"] = array[0];
          messages["data"] = array[1];

          messagesArray.push(messages);
        });

        this.setState({ messagesArray: messagesArray });
      });
  };
  closeModal = () => {
    this.setState({ modal: false });
  };

  dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{this.state.user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: "avatar",
      text: <span onClick={this.openModal}>Change Avatar</span>,
    },
    {
      key: "signedout",
      text: <span onClick={this.handleSignout}>Sign Out</span>,
    },
  ];

  uploadCroppedImage = () => {
    const { storageRef, userRef, blob, metadata } = this.state;

    storageRef
      .child(`avatar/user/${userRef.uid}`)
      .put(blob, metadata)
      .then((snap) => {
        snap.ref.getDownloadURL().then((downloadURL) => {
          this.setState({ uploadCroppedImage: downloadURL }, () => {
            this.changeAvatar();
          });
        });
      });
  };

  changeAvatar = () => {
    this.state.userRef
      .updateProfile({
        photoURL: this.state.uploadCroppedImage,
      })
      .then(() => {
        console.log("photoURL updated");
        this.closeModal();
      })
      .catch((err) => {
        console.error(err.message);
      });

    this.state.usersRef
      .child(this.state.user.uid)
      .update({ avatar: this.state.uploadCroppedImage })
      .then(() => {
        console.log("user avatar updated");
      });

    this.state.messagesArray.map((array) => {
      if (array.data.user.id === this.state.user.uid) {
        this.state.messagesRef
          .child(this.props.currentChannel.id)
          .child(array.messageID + "/user")
          .update({ avatar: this.state.uploadCroppedImage });
      }
    });
  };

  handleChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        this.setState({ previewImage: reader.result });
      });
    }
  };

  handleCropImage = () => {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob((blob) => {
        let imageUrl = URL.createObjectURL(blob);
        this.setState({
          croppedImageUrl: imageUrl,
          blob,
        });
      });
    }
  };

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => console.log("signed Out"));
  };
  render() {
    const { user, modal, previewImage, croppedImageUrl } = this.state;
    const { primaryColor } = this.props;

    return (
      <Grid style={{ background: primaryColor }} className="userpanel">
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            <Header
              inverted
              floated="left"
              as="h2"
              className="userpanel--header"
            >
              <Icon name="code" />
              <Header.Content>DevChat</Header.Content>
            </Header>
          </Grid.Row>
          <Header
            style={{ padding: "0.25em" }}
            as="h4"
            inverted
            className="userpanel--header"
          >
            <Dropdown
              trigger={
                <span>
                  <Image src={user.photoURL} spaced="right" avatar />
                  {user.displayName}
                </span>
              }
              options={this.dropdownOptions()}
            />
          </Header>

          {/* change user avatar modal */}
          <Modal basic open={modal} onClose={this.openModal}>
            <Modal.Header>Change Avatar</Modal.Header>
            <Modal.Content>
              <Input
                onChange={this.handleChange}
                fluid
                type="file"
                label="New Avatar"
                name="previewImage"
              />
              <Grid centered stackable columns={2}>
                <Grid.Row centered>
                  <Grid.Column className="ui center aligned grid">
                    {previewImage && (
                      <AvatarEditor
                        ref={(node) => (this.avatarEditor = node)}
                        image={previewImage}
                        width={240}
                        height={240}
                        border={20}
                        scale={1}
                        style={{ margin: "3.5em auto" }}
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column>
                    {croppedImageUrl && (
                      <Image
                        style={{ margin: "3.5em auto" }}
                        width={240}
                        height={240}
                        src={croppedImageUrl}
                      />
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              <Button color="red" inverted onClick={this.closeModal}>
                <Icon name="remove" /> Cancel
              </Button>
              <Button color="green" inverted onClick={this.handleCropImage}>
                <Icon name="image" /> Preview
              </Button>
              {croppedImageUrl && (
                <Button
                  color="green"
                  inverted
                  onClick={this.uploadCroppedImage}
                >
                  <Icon name="save" /> Change Avatar
                </Button>
              )}
            </Modal.Actions>
          </Modal>
        </Grid.Column>
      </Grid>
    );
  }
}

export default UserPanel;
