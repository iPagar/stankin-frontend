import { Div, Spinner } from "@vkontakte/vkui";
import { connect } from "react-redux";
import { Spring } from "react-spring/renderprops";

import logo from "../img/logo.jpg";
import logoblack from "../img/logoblack.png";
import { useAppearance } from "@vkontakte/vk-bridge-react";

export function Logo() {
  const scheme = useAppearance();

  return (
    <Spring
      config={{ delay: 0, duration: 1000 }}
      from={{ opacity: 0 }}
      to={{ opacity: 1 }}
    >
      {(props) => (
        <div style={props}>
          <Div
            style={{
              color: "var(--text_primary)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <img src={scheme === "light" ? logo : logoblack} alt="logo" />
            <Spinner
              size="large"
              style={{
                marginTop: 20,
              }}
            />
          </Div>
        </div>
      )}
    </Spring>
  );
}

export default Logo;
