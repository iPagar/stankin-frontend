import React, { useEffect } from "react";
import {
  Panel,
  PanelHeaderSimple,
  FormLayout,
  Input,
  Button,
  Snackbar,
  Avatar,
  Link,
} from "@vkontakte/vkui";
import { Spring } from "react-spring/renderprops";
import { setView } from "../redux/actions";

import { Icon24Error } from "@vkontakte/icons";

import Logo from "./Logo";
import {
  useStudentsControllerGetMeQuery,
  useStudentsControllerLoginMutation,
} from "../api/slices/students.slice";
import { useAppDispatch } from "../api/store";

const orangeBackground = {
  backgroundImage: "linear-gradient(135deg, #ffb73d, #ffa000)",
};

function Form({
  isFetching,
  onSubmit,
}: {
  isFetching: boolean;
  onSubmit: (values: { login: string; password: string }) => void;
}) {
  const [values, setValues] = React.useState({
    login: "",
    password: "",
  });

  return (
    <React.Fragment>
      {(isFetching && <Logo />) || (
        <Spring
          config={{ duration: 500 }}
          from={{ opacity: 0 }}
          to={{ opacity: 1 }}
        >
          {(props) => (
            <div style={props}>
              <FormLayout
                onSubmit={() => {
                  onSubmit(values);
                }}
              >
                <Input
                  value={values.login}
                  onChange={(e) => {
                    setValues({
                      ...values,
                      login: e.target.value,
                    });
                  }}
                  type="number"
                  placeholder="Логин"
                />
                <Input
                  value={values.password}
                  onChange={(e) => {
                    setValues({
                      ...values,
                      password: e.target.value,
                    });
                  }}
                  type="password"
                  placeholder="Пароль"
                />
                <Button size="xl">Войти</Button>
              </FormLayout>
            </div>
          )}
        </Spring>
      )}
    </React.Fragment>
  );
}

export function Login({ id }: { id: string }) {
  const dispatch = useAppDispatch();

  const { data: me, isLoading: isLoadingMe } =
    useStudentsControllerGetMeQuery();
  const [login, { isLoading }] = useStudentsControllerLoginMutation();

  useEffect(() => {
    if (me) {
      dispatch(setView("mainView"));
    }
  }, [me]);

  async function onSubmit(values: { login: string; password: string }) {
    try {
      await login({
        loginDto: {
          password: values.password,
          studentId: values.login,
        },
      }).unwrap();
    } catch (e) {
      openSnackbar();
    }
  }

  const [snackbar, setSnackbar] = React.useState<React.ReactElement | null>(
    null
  );

  function openSnackbar(support = true) {
    if (snackbar) return;

    setSnackbar(
      <Snackbar
        layout="vertical"
        onClose={() => setSnackbar(null)}
        before={
          <Avatar size={24} style={orangeBackground}>
            <Icon24Error fill="#fff" width={20} height={20} />
          </Avatar>
        }
      >
        Произошла ошибка.
        {support && (
          <Link href="https://vk.com/im?sel=-183639424" target="_blank">
            <span> Напишите нам</span>.
          </Link>
        )}
      </Snackbar>
    );
  }

  return (
    <Panel id={id} separator={false} centered>
      <PanelHeaderSimple>Модульный журнал</PanelHeaderSimple>
      {!isLoadingMe ? (
        <Form isFetching={isLoading} onSubmit={onSubmit} />
      ) : (
        <Logo />
      )}
      {snackbar}
    </Panel>
  );
}

export default Login;
