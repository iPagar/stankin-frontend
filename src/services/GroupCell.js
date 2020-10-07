import React from "react";
import { Group, Cell, IS_PLATFORM_IOS } from "@vkontakte/vkui";

class GroupCell extends React.Component {
  state = { isAttached: false };
  rootRef = null;

  attach = () => {
    const top = window.pageYOffset + this.rootRef.getBoundingClientRect().top;
    const bottom =
      window.pageYOffset + this.rootRef.getBoundingClientRect().bottom;
    const tabbarHeight = parseInt(
      window.getComputedStyle(document.body).getPropertyValue("--tabbar_height")
    );

    const navbarHeight =
      (IS_PLATFORM_IOS ? 44 : 56) +
      parseInt(
        window
          .getComputedStyle(document.body)
          .getPropertyValue("--safe-area-inset-top")
      );

    if (
      window.pageYOffset + tabbarHeight + navbarHeight >= top &&
      window.pageYOffset + tabbarHeight + navbarHeight <= bottom
    ) {
      if (!this.state.isAttached) {
        this.setState({ isAttached: true });
        window.addEventListener("scroll", this.detach);
      }
    }
  };

  detach = () => {
    const top = window.pageYOffset + this.rootRef.getBoundingClientRect().top;
    const bottom =
      window.pageYOffset + this.rootRef.getBoundingClientRect().bottom;

    const tabbarHeight = parseInt(
      window.getComputedStyle(document.body).getPropertyValue("--tabbar_height")
    );
    const navbarHeight =
      (IS_PLATFORM_IOS ? 44 : 56) +
      parseInt(
        window
          .getComputedStyle(document.body)
          .getPropertyValue("--safe-area-inset-top")
      );

    if (
      window.pageYOffset + tabbarHeight + navbarHeight >= bottom ||
      window.pageYOffset + tabbarHeight + navbarHeight <= top
    ) {
      if (this.state.isAttached) {
        this.setState({ isAttached: false });
        window.addEventListener("scroll", this.attach);
      }
    }
  };

  componentDidMount() {
    window.addEventListener("scroll", this.attach);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.detach);
    window.removeEventListener("scroll", this.attach);
  }

  render() {
    const { style, title, children, mark } = this.props;
    const { isAttached } = this.state;

    return (
      <React.Fragment>
        <Group style={style} getRootRef={rootRef => (this.rootRef = rootRef)}>
          <Cell
            before={
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: "44px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: "var(--text_secondary)"
                  }}
                >
                  {title}
                </div>
              </div>
            }
            asideContent={mark}
          />
          {children}
        </Group>
        {isAttached && (
          <Cell
            style={{
              position: "fixed",
              zIndex: 2,
              backgroundColor: "var(--background_content)",
              left: 0,
              width: "100%",
              top: `calc(calc(var(--tabbar_height) + ${
                IS_PLATFORM_IOS ? 44 : 56
              }px) + var(--safe-area-inset-top))`
            }}
            before={
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: "44px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    color: "var(--text_secondary)"
                  }}
                >
                  {title}
                </div>
              </div>
            }
            asideContent={mark}
          />
        )}
      </React.Fragment>
    );
  }
}

export default GroupCell;
