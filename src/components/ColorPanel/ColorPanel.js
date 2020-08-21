import React, { Component, useEffect } from "react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setColors } from "../../actions/index";
import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Icon,
  Label,
  List,
  Header,
  Segment,
} from "semantic-ui-react";
import { SliderPicker } from "react-color";

class ColorPanel extends Component {
  state = {
    modal: false,
    primary: "",
    secondary: "",
    user: this.props.currentUser,
    usersRef: firebase.database().ref("users"),
    userColors: [],
    width: "",
    height: "",
  };

  getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return this.setState({ width, height });
  };

  componentDidMount() {
    this.addListener(this.state.user.uid);
    window.addEventListener("resize", this.getWindowDimensions);
  }
  componentWillUnmount() {
    this.removeListener();
    window.removeEventListener("resize", this.getWindowDimensions);
  }
  removeListener = () => {
    this.state.usersRef.child(`${this.state.user.uid}/colors`).off();
  };

  addListener = (userId) => {
    let userColors = [];
    this.state.usersRef.child(`${userId}/colors`).on("child_added", (snap) => {
      userColors.unshift(snap.val());
      this.setState({ userColors });
    });
  };

  displayUserColors = (colors) =>
    colors.length > 0 &&
    colors.map((color, i) => (
      <React.Fragment key={i}>
        <Divider />
        <div
          className="color__container"
          onClick={() => this.props.setColors(color.primary, color.secondary)}
        >
          <div className="color__square" style={{ background: color.primary }}>
            <div
              className="color__overlay"
              style={{ background: color.secondary }}
            ></div>
          </div>
        </div>
      </React.Fragment>
    ));

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  handleChangePrimary = (color) => this.setState({ primary: color.hex });

  handleChangeSecondary = (color) => this.setState({ secondary: color.hex });

  handleSaveColor = () => {
    if (this.state.primary && this.state.secondary) {
      this.saveColors(this.state.primary, this.state.secondary);
    }
  };
  saveColors = (primary, secondary) => {
    this.state.usersRef
      .child(`${this.state.user.uid}/colors`) //we can reference colors propert for a user
      .push()
      .update({
        primary,
        secondary,
      })
      .then(() => {
        console.log("colors added");
        this.closeModal();
      })
      .catch((error) => console.error(error));
  };

  render() {
    const { modal, primary, secondary, userColors, width } = this.state;
    if (width > 600) {
      return (
        <React.Fragment>
          <Sidebar
            as={Menu}
            icon="labeled"
            inverted
            vertical
            visible
            className="colorPanel"
            width="very thin"
          >
            <Divider />
            {/* <Header inverted>{this.state.width}</Header> */}
            <Button
              icon="add"
              size="small"
              color="blue"
              onClick={this.openModal}
            />
            {this.displayUserColors(userColors)}
            {/* color picker modal */}
            <Modal dimmer="blurring" open={modal} onClose={this.closeModal}>
              <Modal.Header>Choose App Colors</Modal.Header>
              <Modal.Content>
                <Segment inverted>
                  <Label content="Primary Color" />
                  <SliderPicker
                    color={primary}
                    onChange={this.handleChangePrimary}
                  />
                </Segment>
                <Segment inverted>
                  <Label content="Secondary Color" />
                  <SliderPicker
                    color={secondary}
                    onChange={this.handleChangeSecondary}
                  />
                </Segment>
              </Modal.Content>
              <Modal.Actions>
                <Button color="red" inverted onClick={this.closeModal}>
                  <Icon name="remove" /> Cancel
                </Button>
                <Button color="green" inverted onClick={this.handleSaveColor}>
                  <Icon name="checkmark" /> Save Colors
                </Button>
              </Modal.Actions>
            </Modal>
          </Sidebar>
        </React.Fragment>
      );
    } else return null;
  }
}

export default connect(null, { setColors })(ColorPanel);
