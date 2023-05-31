import React, { useEffect, useState } from "react";
import PokeButton from "../../components/buttons/PokeButton";
import { UserCredentials, UserCriteria } from "../../service/api/types/User";
import { Flex } from "@react-native-material/core";
import { Pokemon } from "pokenode-ts";
import { StyleSheet, Image } from "react-native";
import PokeTextField from "../../components/textfields/PokeTextField";
import PokeLoading from "../../components/loader/PokeLoading";
import PokeText from "../../components/texts/PokeText";
import { usePokemonService } from "../../service/api/PokemonService";
import { useCommonService } from "../../service/common/CommonService";
import UseUserService from "../../service/api/UserService";
import * as Yup from "yup";
import { FormikProvider, useFormik } from "formik";

export type PokeLoginProps = {
  handlerUser: (userLogin: UserCredentials) => void;
};

const DefaultValue = {
  password: "",
  email: "",
};

type FormValues = {
  email?: string;
  password?: string;
};

function PokeLogin(props: PokeLoginProps) {
  //Consts
  const [userCriteria] = useState<UserCriteria>(DefaultValue);
  const [pokemon, setPokemon] = useState<Pokemon | undefined>(undefined);
  const [pokemonTypeColor, setPokemonTypeColor] = useState<
    string | undefined
  >();

  //Services
  const pokemonService = usePokemonService();
  const commonService = useCommonService();
  const userService = UseUserService();

  //UseEffect
  useEffect(() => {
    const fetchPokemon = async () => {
      pokemonService
        .getRamdomPokemon()
        .then((data) => {
          setPokemon(data);
          setPokemonTypeColor(
            commonService.getColorFromType(data?.types[0].type.name ?? "")
          );
        })
        .catch((error) => console.error(error));
    };
    if (pokemon === undefined) fetchPokemon();
  });

  //Methods
  const handleLogin = async () => {
    if (userCriteria !== undefined) {
      userService
        .login(userCriteria)
        .then((data) => {
          props.handlerUser(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  //Validatiopn
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Deve ser um email válido")
      .required("Campo obrigatório"),
    password: Yup.string()
      .min(6, "Mínimo de 6 caracteres")
      .required("Campo obrigatório")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
        "Senha inválida"
      ),
  });

  //Formik
  const formik = useFormik<FormValues>({
    initialValues: userCriteria,
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      await handleLogin();
      setSubmitting(false);
    },
  });

  const {
    errors,
    getFieldProps,
    touched,
    isSubmitting,
    handleSubmit,
    setFieldValue,
  } = formik;

  //Style
  const styles = StyleSheet.create({
    view: {
      backgroundColor: pokemonTypeColor,
      width: "100%",
      height: "100%",
      position: "relative",
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
    },
    header: {
      height: "auto",
    },
    form: {
      width: 400,
      padding: 50,
      backgroundColor: "#FFFFFF",
    },
    centeredDiv: {
      alignItems: "center",
      alignContent: "center",
    },
    headerImage: { width: 180, height: 180 },
  });

  return (
    <>
      {pokemon ? (
        <>
          <Flex style={styles.view}>
            <Flex style={styles.header}>
              <PokeText
                text="Quem é esse Pokemon?"
                color={"#FFFFFF"}
                type={"h1"}
              />
              <Flex style={styles.centeredDiv}>
                <Image
                  style={styles.headerImage}
                  source={{
                    uri: `${commonService.getPokemonMainImage(
                      pokemon?.sprites
                    )}`,
                  }}
                />
              </Flex>
              <PokeText
                text={pokemon?.name.toUpperCase()}
                color={"#FFFFFF"}
                type={"h1"}
              />
            </Flex>
          </Flex>
          <Flex fill style={styles.centeredDiv}>
            <Flex style={styles.form}>
              <FormikProvider value={formik}>
                <PokeText
                  text={"Login"}
                  color={pokemonTypeColor ?? "#000000"}
                  type={"h2"}
                />
                <PokeTextField
                  {...getFieldProps("email")}
                  color={pokemonTypeColor}
                  cursorColor={pokemonTypeColor}
                  variant="outlined"
                  label={"Email"}
                  placeholder="Email"
                  isReadOnly={false}
                  placeholderTextColor={pokemonTypeColor}
                  onChange={(val) => setFieldValue("email", val)}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />
                <PokeTextField
                  {...getFieldProps("password")}
                  color={pokemonTypeColor}
                  cursorColor={pokemonTypeColor}
                  variant="outlined"
                  placeholder="Senha"
                  label={"Senha"}
                  isReadOnly={false}
                  placeholderTextColor={pokemonTypeColor}
                  onChange={(val) => setFieldValue("password", val)}
                  icon="eye-outline"
                  isPassword
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                />
                <PokeButton
                  text="Entrar"
                  size="fullwidth"
                  icon="send"
                  variant="contained"
                  loading={isSubmitting}
                  styleType={pokemon?.types[0].type.name ?? ""}
                  onClick={handleSubmit}
                />
              </FormikProvider>
            </Flex>
          </Flex>
        </>
      ) : (
        <PokeLoading loadType="page" />
      )}
    </>
  );
}

export default PokeLogin;
