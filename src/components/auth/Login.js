import React, { Component } from "react";
import firebase from "../../firebase";

import {
  Grid,
  Form,
  Segment,
  Button,
  Message,
  Icon,
  Header,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import "../App.css";
export default class Login extends Component {
  state = {
    email: "",
    password: "",

    errors: [],
    loading: false,
  };
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  displayErrors = (errors) =>
    errors.map((error, i) => <p key={i}>{error.message}</p>);

  handleSubmit = (event) => {
    if (this.isFormValid(this.state)) {
      event.preventDefault();
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((signedInUser) => {
          console.log(signedInUser);
        })
        .catch((err) => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false,
          });
        });
    }
  };
  isFormValid = ({ email, password }) => email && password;

  handleinput = (errors, inputName) => {
    return errors.some((error) =>
      error.message.toLowerCase().includes(inputName)
    )
      ? "error"
      : "";
  };
  render() {
    const {
      email,
      password,

      loading,
      errors,
    } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="violet" textAlign="center">
            <Icon name="code branch" color="violet" />
            Login to DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                className={this.handleinput(errors, "email")}
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                value={email}
                type="email"
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                className={this.handleinput(errors, "password")}
                value={password}
                type="password"
              />

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                fluid
                color="violet"
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {this.state.errors.length > 0 && (
            <Message error>{this.displayErrors(this.state.errors)}</Message>
          )}
          <Message>
            Don't have an account? <Link to="/register">Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}
