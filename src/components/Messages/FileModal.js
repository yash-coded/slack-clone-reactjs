import React, { Component } from "react";
import { Modal, Input, Button, Icon } from "semantic-ui-react";
import mime from "mime-types";

export default class FileModal extends Component {
  state = {
    file: null,
    authorized: ["image/jpeg", "image/png"],
  };

  addFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      this.setState({ file: file });
    }
  };

  sendFile = () => {
    const { file } = this.state;
    const { uploadFile, closeModal } = this.props;

    if (file !== null) {
      if (this.isAuthorized(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
        closeModal();
        this.clearFile();
      }
    }
  };

  isAuthorized = (filename) =>
    this.state.authorized.includes(mime.lookup(filename));
  clearFile = () => this.setState({ file: null });
  render() {
    const { modal, closeModal } = this.props;
    return (
      <Modal dimmer="blurring" size="tiny" open={modal} onClose={closeModal}>
        <Modal.Header>Select an Image</Modal.Header>
        <Modal.Content>
          <Input
            onChange={this.addFile}
            fluid
            label="File Types: jpeg, png"
            name="file"
            type="file"
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
          <Button onClick={this.sendFile} color="green" inverted>
            <Icon name="checkmark" /> Send
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
