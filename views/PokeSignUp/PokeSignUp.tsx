import React, { useEffect, useState } from "react";
import PokeButton from "../../components/buttons/PokeButton";
import { UserCredentials, UserCriteria } from "../../service/api/types/User";
import { Flex } from "@react-native-material/core";
import { StyleSheet, Image, View } from "react-native";
import PokeTextField from "../../components/textfields/PokeTextField";
import PokeLoading from "../../components/loader/PokeLoading";
import PokeText from "../../components/texts/PokeText";
import { useCommonService } from "../../service/common/CommonService";
import UseUserService from "../../service/api/UserService";
import * as Yup from "yup";
import { FormikProvider, useFormik } from "formik";
import PokeIconButton from "../../components/buttons/PokeIconButton";
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from "react-native-gesture-handler";

export type PokeSignUpProps = {
  navigation: any;
  route: any;
  handlerUser: (userLogin: UserCredentials) => void;
};

const DefaultValue = {
  password: '',
  name: '',
  image: undefined,
  email: '',
};

type FormValues = {
  email?: string;
  name?: string;
  image?: string;
  password?: string;
};

function PokeSignUp(props: PokeSignUpProps) {
  //Consts
  const [userCriteria, setUserCriteria] = useState<UserCriteria>(DefaultValue);
  const [pokemonTypeColor, setPokemonTypeColor] = useState<
    string | undefined
  >();

  //Services
  const commonService = useCommonService();
  const userService = UseUserService();


  //HANDLERS
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setUserCriteria((prevState) => {
        return {
          ...prevState,
          image: result.assets[0].base64,
        };
      });
    }
  };

  const handleGoLogin = () => {
    props.navigation.navigate("PokeSignIn");
  }


  //UseEffect
  useEffect(() => {
    const { pokemonTypeColor } = props.route.params;
    setPokemonTypeColor(pokemonTypeColor);
  });

  //Methods
  const handlePerfilCreate = async () => {
    if (userCriteria !== undefined) {
      userService
        .createAccount(userCriteria)
        .then((data) => {
          props.handlerUser({isLogged: true, token: 'SDADFASDADS', user: {email: 'asd@asdasd@asd.asd', id: 1, name: "asdsad", pokemons: []}});
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  
  //Validatiopn
  const CreateSchema = Yup.object().shape({
    email: Yup.string()
      .email("It must to be a valid email")
      .required("Required field"),
    name: Yup.string()
      .min(3, "It must have more than 3 chracters")
      .required("Required field"),

    password: Yup.string()
      .min(6, "Minimun 6 caracters")
      .required("Required field")
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
      //   "Invalid password"
      // ),
  });

  //Formik
  const formik = useFormik<FormValues>({
    initialValues: userCriteria,
    validationSchema: CreateSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      await handlePerfilCreate();
      setSubmitting(false);
    },
  });

  const {
    errors,
    values,
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
      minHeight: 310,
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
    },
    header: {
      padding: 5,
      paddingTop: 30,
      height: "auto",
    },
    form: {
      width: 400,
      minHeight: 400,
      padding: 50,
      paddingTop: 15,
      backgroundColor: "#FFFFFF",
    },
    centeredDiv: {
      alignItems: "center",
      alignContent: "center",
    },
    headerImage: { width: 170, height: 170 },
  });

  return (
    <>
      {pokemonTypeColor ? (
        <>
          <Flex style={styles.view}>
            <Flex style={styles.header}>
              <PokeText
                text="Who's You?"
                color={"#FFFFFF"}
                type={"h1"}
              />
              <View>

              <Image
                style={{width: 150, height: 150, marginTop: 20, marginBottom: 20, marginLeft: 20, borderRadius: 100, borderColor: "#c52222", borderWidth: 3}} 
                source={{ uri: userCriteria.image ? 'data:image/jpeg;base64,' + userCriteria.image : 'https://i.pinimg.com/originals/e3/af/9c/e3af9c7dc24b3fcb9b5f2d812d839783.jpg'}}
                />
              <View style={{position: "absolute", top: 120, left: 130}}>
                <PokeIconButton 
                  color="#FFF" 
                  styleType="fire" 
                  icon="camera-outline" 
                  variant="text" 
                  onClick={() => pickImage()} 
                  />
              </View>
            </View>
            <PokeText
                text={values.name !== '' ? `I'm ${commonService.stringToCapitalLetters(values.name.toUpperCase())}` : ''}
                color={"#FFFFFF"}
                type={"h1"}
              />
            </Flex>
          </Flex>
          <ScrollView>

          
          <Flex fill style={styles.centeredDiv}>
            <Flex style={styles.form}>
              <FormikProvider value={formik}>
                <PokeText
                  text={"Sign Up"}
                  color={pokemonTypeColor ?? "#000000"}
                  type={"h2"}
                />
                <PokeTextField
                  {...getFieldProps("name")}
                  color={pokemonTypeColor}
                  cursorColor={pokemonTypeColor}
                  variant="outlined"
                  label={"Name"}
                  placeholder="Name"
                  isReadOnly={false}
                  placeholderTextColor={pokemonTypeColor}
                  onChange={(val) => setFieldValue("name", val.trim())}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
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
                  onChange={(val) => setFieldValue("email", val.trim())}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />
                <PokeTextField
                  {...getFieldProps("password")}
                  color={pokemonTypeColor}
                  cursorColor={pokemonTypeColor}
                  variant="outlined"
                  placeholder="Password"
                  label={"Password"}
                  isReadOnly={false}
                  placeholderTextColor={pokemonTypeColor}
                  onChange={(val) => setFieldValue("password", val.trim())}
                  icon="eye-outline"
                  isPassword
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                />
                <PokeButton
                  text="Create Account"
                  size="fullwidth"
                  icon="plus-outline"
                  color="white"
                  variant="contained"
                  loading={isSubmitting}
                  styleType={pokemonTypeColor}
                  onClick={handleSubmit}
                />
                <Flex mt={10}>
                  <PokeButton
                    text="Back"
                    size="fullwidth"
                    icon="arrow-left-bold-outline"
                    color={pokemonTypeColor}
                    variant="outlined"
                    loading={isSubmitting}
                    styleType={"white"}
                    onClick={handleGoLogin}
                  />
                </Flex>
              </FormikProvider>
            </Flex>
          </Flex>
          </ScrollView>
        </>
      ) : (
        <PokeLoading loadType="page" />
      )}
    </>
  );
}

export default PokeSignUp;
