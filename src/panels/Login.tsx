import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Panel,
  PanelHeader,
  FormLayoutGroup,
  Input,
  Button,
  Snackbar,
  Avatar,
  Link,
  Text,
  ModalCard,
  View,
  ModalRoot,
  ModalPageHeader,
  FormItem,
  SplitLayout,
} from "@vkontakte/vkui";
import { Spring } from "react-spring/renderprops";
import { Icon24Error } from "@vkontakte/icons";

import Logo from "./Logo";
import {
  useStudentsControllerGetMeQuery,
  useStudentsControllerLoginMutation,
} from "../api/slices/students.slice";
import { useAppDispatch } from "../api/store";
import { setView } from "../api/slices/config.slice";

const orangeBackground = {
  backgroundImage: "linear-gradient(135deg, #ffb73d, #ffa000)",
};

const loginSchema = z.object({
  login: z.string().length(6, "Студ. билет должен состоять из 6 символов"),
  password: z.string().min(1, "Пароль обязателен"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function Form({
  isFetching,
  onSubmit,
}: {
  isFetching: boolean;
  onSubmit: (values: LoginFormValues) => void;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
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
              <FormLayoutGroup>
                <FormItem
                  status={errors.login ? "error" : "default"}
                  bottom={errors.login?.message}
                >
                  <Controller
                    name="login"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        placeholder="Студ. билет"
                      />
                    )}
                  />
                </FormItem>
                <FormItem
                  status={errors.password ? "error" : "default"}
                  bottom={errors.password?.message}
                >
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="password" placeholder="Пароль" />
                    )}
                  />
                </FormItem>
                <FormItem>
                  <Button stretched size="l" onClick={handleSubmit(onSubmit)}>
                    Войти
                  </Button>
                </FormItem>
              </FormLayoutGroup>
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
        dispatch(setView("mainView"));
      }
    }

    start();
  }, [me]);

  async function onSubmit(values: LoginFormValues) {
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

  function openSnackbar() {
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
        duration={10000}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Text weight="2" style={{ marginBottom: 8 }}>
            Ошибка входа
          </Text>
          <Text style={{ marginBottom: 12 }}>
            Неверный логин или пароль. Проверьте введенные данные.
          </Text>
          <Button mode="outline" onClick={() => setModal(true)}>
            Помощь со входом
          </Button>
        </div>
      </Snackbar>
    );
  }

  const modalCode = (
    <ModalRoot activeModal={modal ? "modal" : null}>
      <ModalCard
        id="modal"
        header={<ModalPageHeader>Помощь со входом</ModalPageHeader>}
        onClose={() => setModal(false)}
      >
        <Text
          style={{ margin: "16px 0", lineHeight: "1.5", textAlign: "justify" }}
        >
          Для входа в аккаунт:
          <ul>
            <li>Введите номер студенческого билета (6 цифр)</li>
            <li>
              Введите пароль (по умолчанию совпадает с номером студенческого
              билета)
            </li>
          </ul>
          <strong>Важно:</strong> В начале учебного года личный кабинет может
          быть недоступен из-за процесса создания в университетской системе.
          <br />
          <br />
          Если проблемы со входом сохраняются, обратитесь в{" "}
          <Link href="https://vk.com/im?sel=-183639424" target="_blank">
            техподдержку
          </Link>
          .
        </Text>
      </ModalCard>
    </ModalRoot>
  );

  return (
    <SplitLayout modal={modalCode}>
      <View id={id} activePanel="login">
        <Panel id="login" centered>
          <PanelHeader delimiter="spacing">Модульный журнал</PanelHeader>
          {!(isLoading || isLoadingMe) ? (
            <Form isFetching={isLoading || isLoadingMe} onSubmit={onSubmit} />
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
    </SplitLayout>
  );
}

export default Login;
