import React from "react";
import {
  View,
  Input,
  FormLayout,
  Panel,
  Button,
  PanelHeader,
  Div,
  Spinner,
  Snackbar,
  Avatar,
} from "@vkontakte/vkui";
import ScreenSpinnerPromise from "vkui-screen-spinner-promise";
import axios from "../services/axios";
import "./Login.css";
import logo from "../img/logo.jpg";
import logoblack from "../img/logoblack.png";
import VKConnect from "@vkontakte/vk-connect";
import Icon16Cancel from "@vkontakte/icons/dist/16/cancel";

const orangeBackground = {
  backgroundColor: "linear-gradient(135deg, #ffb73d, #ffa000)",
};

class Login extends React.Component {
  state = {
    popout: null,
    activePanel: "loginPanel",
    loadingUser: true,
    login: "",
    password: "",
    loginStatus: "default",
    passwordStatus: "default",
    scheme: "light",
    snackbar: null,
  };
  ref = React.createRef();
  passwordRef = React.createRef();

  auth = async (e) => {
    e.preventDefault();
    const { login, password } = this.state;

    if (login && password) {
      this.setState({
        popout: (
          <ScreenSpinnerPromise
            onStart={() =>
              axios
                .post("/register", { student: login, password })
                .then(() => axios.post("/student").then((response) => response))
            }
            onCancel={() => {
              this.setState({
                popout: null,
                loginStatus: "error",
                passwordStatus: "error",
              });
              setTimeout(
                () =>
                  this.setState({
                    loginStatus: "default",
                    passwordStatus: "default",
                  }),
                1000
              );
            }}
            onDone={(response) => {
              this.setState({ popout: null });
              this.props.go("marks", response.data[0]);
            }}
          />
        ),
      });
    } else this.blinkInputsError();
  };

  inputsVerified() {
    this.setState({ loginStatus: "valid", passwordStatus: "valid" });
  }

  blinkInputsError() {
    const { login, password } = this.state;

    if (!login) {
      this.setState({ loginStatus: "error" });
      setTimeout(() => this.setState({ loginStatus: "default" }), 1000);
    }
    if (!password) {
      this.setState({ passwordStatus: "error" });
      setTimeout(() => this.setState({ passwordStatus: "default" }), 1000);
    }
  }

  openBase() {
    if (this.state.snackbar) return;
    this.setState({
      snackbar: (
        <Snackbar
          layout="vertical"
          onClose={() => this.setState({ snackbar: null })}
          before={
            <Avatar size={24} style={orangeBackground}>
              <Icon16Cancel fill="#fff" width={14} height={14} />
            </Avatar>
          }
        >
          Проводятся технические работы. Повторите попытку позже.
        </Snackbar>
      ),
    });
  }

  componentDidMount() {
    this.setState({
      loadingUser: true,
    });

    VKConnect.subscribe((e) => {
      switch (e.detail.type) {
        case "VKWebAppUpdateConfig":
          this.setState({ scheme: e.detail.data.scheme });
          console.log(1);
          break;
        default:
          break;
      }
    });

    axios
      .post("/student")
      .then((response) => {
        if (response.data.length) this.props.go("marks", response.data[0]);
        else throw new Error(response.status);
      })
      .catch((error) => {
        // this.openBase();
        this.setState({ loadingUser: false });
      });
  }

  render() {
    const {
      popout,
      activePanel,
      loadingUser,
      login,
      password,
      loginStatus,
      passwordStatus,
      scheme,
      snackbar,
    } = this.state;

    return (
      <View activePanel={activePanel} popout={popout}>
        <Panel id="loginPanel" theme="white" centered>
          <PanelHeader>Модульный журнал</PanelHeader>
          {(!loadingUser && (
            <FormLayout
              onSubmit={this.auth}
              style={{
                opacity: 0,
                animation: loadingUser ? null : "fadeout 1s reverse forwards",
              }}
            >
              <Input
                value={login}
                onChange={(e) =>
                  this.setState({
                    login: e.target.value,
                  })
                }
                type="number"
                status={loginStatus}
                placeholder="Логин"
              />
              <Input
                value={password}
                onChange={(e) =>
                  this.setState({
                    password: e.target.value,
                  })
                }
                status={passwordStatus}
                type="password"
                placeholder="Пароль"
              />
              <Button size="xl">Войти</Button>
            </FormLayout>
          )) || (
            <Div
              style={{
                color: "var(--text_primary)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 20,
                opacity: 0,
                animation: "fadeout 1s 1s reverse forwards",
              }}
            >
              <img
                src={
                  scheme === undefined ||
                  scheme.includes("light" ? logo : logoblack)
                }
                alt="logo"
              />
              <Spinner
                size="large"
                style={{
                  marginTop: 20,
                  opacity: 0,
                  animation: "fadeout 1s 1s reverse forwards",
                }}
              />
            </Div>
          )}
          {snackbar}
        </Panel>
      </View>
    );
  }
}

export default Login;
