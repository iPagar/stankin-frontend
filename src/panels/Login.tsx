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
  Text,
  ModalPage,
  View,
  ModalRoot,
  ModalPageHeader,
  ModalCard,
  Caption,
  Title,
} from "@vkontakte/vkui";
import { Spring } from "react-spring/renderprops";
import { fetchInit, setView } from "../redux/actions";

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
    async function start() {
      if (me) {
        await dispatch(fetchInit());

        dispatch(setView("mainView"));
      }
    }

    start();
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
  const [modal, setModal] = React.useState<boolean>(false);

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
    <View
      id={id}
      activePanel="login"
      header={false}
      modal={
        <ModalRoot
          activeModal={modal ? "modal" : null}
          onClose={() => {
            setModal(false);
          }}
        >
          <ModalCard
            id="modal"
            header={<ModalPageHeader>Как войти?</ModalPageHeader>}
            onClose={() => {
              setModal(false);
            }}
          >
            <Text weight="regular" style={{ marginBottom: 16, marginTop: 16 }}>
              Чтобы войти в аккаунт, вам необходимо ввести свой логин и пароль.
              Обычно, логин и пароль - это номер вашего студенческого билета.
            </Text>
          </ModalCard>
        </ModalRoot>
      }
    >
      <Panel id="login" separator={false} centered>
        <PanelHeaderSimple>Модульный журнал</PanelHeaderSimple>
        {!isLoadingMe ? (
          <Form isFetching={isLoading} onSubmit={onSubmit} />
        ) : (
          <Logo />
        )}
        {!isLoadingMe && !isLoading && (
          <Button
            mode="tertiary"
            style={{ marginTop: 16 }}
            onClick={() => {
              setModal(true);
            }}
          >
            Как войти?
          </Button>
        )}
        {snackbar}
      </Panel>
    </View>
  );
}

export default Login;
