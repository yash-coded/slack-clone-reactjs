import React, { Component } from "react";
import { Menu, Sidebar, Checkbox, Grid, Segment } from "semantic-ui-react";
import Channels from "./Channels";
import UserPanel from "./UserPanel";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";
export default class SidePanel extends Component {
  state = {
    visible: false,
    width: "",
    height: "",
  };

  getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return this.setState({ width, height });
  };
  render() {
    const { visible, width } = this.state;
    const { currentUser, primaryColor, currentChannel } = this.props;
    return (
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={{ background: primaryColor, fontSize: "1.2rem" }}
        className="sidepanel--menu"
      >
        <UserPanel
          primaryColor={primaryColor}
          currentUser={currentUser}
          currentChannel={currentChannel}
          className="side-panel-comp"
        />

        <Starred currentUser={currentUser} />
        <Channels currentUser={currentUser} />
        <DirectMessages currentUser={currentUser} />
      </Menu>
    );
  }
}
