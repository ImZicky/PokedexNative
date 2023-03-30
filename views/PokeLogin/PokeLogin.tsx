import React, { useEffect, useState } from "react";
import { Text, Image } from "react-native";
import PokeButton from "../../components/buttons/PokeButton";
import { User } from "../../components/user/types/User";
import { Flex, TextInput } from "@react-native-material/core";
import { PokemonClient, Pokemon } from "pokenode-ts";
import { StyleSheet } from "react-native";
import PokeTextField from "../../components/textfields/PokeTextField";
import { useFonts } from "expo-font";

export type PokeLoginProps = {
  handlerUser: (user: User) => void;
};

function PokeLogin(props: PokeLoginProps) {
  //Consts
  const [pokemon, setPokemon] = useState<Pokemon | undefined>(undefined);
  const [pokemonTypeColor, setPokemonTypeColor] = useState<
    string | undefined
  >();
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();

  //Services
  const api = new PokemonClient();

  //Fonts
  const [loaded] = useFonts({
    Orbitron: require("../../assets/fonts/Orbitron-VariableFont_wght.ttf"),
    PressStart: require("../../assets/fonts/PressStart2P-Regular.ttf"),
    SpaceGrotesk: require("../../assets/fonts/SpaceGrotesk-VariableFont_wght.ttf"),
  });

  //Miscelaneous functions
  const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
  };

  //UseEffect
  useEffect(() => {
    const fetchPokemon = async () => {
      const ramdomId = getRandomInt(100);
      await api
        .getPokemonById(ramdomId)
        .then((data) => {
          setPokemon(data);
          setPokemonTypeColor(getColorFromType(data?.types[0].type.name ?? ""));
        })
        .catch((error) => console.error(error));
    };
    if (loaded) {
      if (pokemon === undefined) fetchPokemon();
    }
  });

  // Style Methods
  const getColorFromType = (type: string) => {
    switch (type) {
      case "primary":
        return "#a30000";
      case "secondary":
        return "#000000";
      case "bug":
        return "#97c220";
      case "dark":
        return "#50495f";
      case "dragon":
        return "#0969c2";
      case "electric":
        return "#f4d543";
      case "fairy":
        return "#ed8fe5";
      case "fighting":
        return "#cf4068";
      case "fire":
        return "#ffa053";
      case "flying":
        return "#92acdf";
      case "ghost":
        return "#606dbb";
      case "grass":
        return "#5fba58";
      case "ground":
        return "#dc8658";
      case "ice":
        return "#6ccdbf";
      case "normal":
        return "#959ca1";
      case "poison":
        return "#a765c8";
      case "psychic":
        return "#f86e74";
      case "rock":
        return "#cbbd8d";
      case "steel":
        return "#548f9f";
      case "water":
        return "#5398d8";
      default:
        return "#a30000";
    }
  };

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
    titleHeader: {
      color: "#FFFFFF",
      fontFamily: "PressStart",
      fontSize: 20,
      textAlign: "center",
    },
    titleForm: {
      color: pokemonTypeColor,
      fontSize: 35,
      fontFamily: "Orbitron",
      textAlign: "center",
      marginBottom: 20,
    },
    centeredDiv: {
      alignItems: "center",
      alignContent: "center",
    },
    headerImage: { width: 180, height: 180 },
  });

  return (
    <>
      {pokemon && (
        <>
          <Flex style={styles.view}>
            <Flex style={styles.header}>
              <Text style={styles.titleHeader}>Quem é esse Pokemon?</Text>
              <Flex style={styles.centeredDiv}>
                <Image
                  style={styles.headerImage}
                  source={{
                    uri: `${pokemon?.sprites.other?.["official-artwork"].front_default}`,
                  }}
                />
              </Flex>
              <Text style={styles.titleHeader}>
                {pokemon?.name.toUpperCase()}
              </Text>
            </Flex>
          </Flex>
          <Flex fill style={styles.centeredDiv}>
            <Flex style={styles.form}>
              <Text style={styles.titleForm}>Login</Text>
              <PokeTextField
                color={pokemonTypeColor}
                cursorColor={pokemonTypeColor}
                variant="outlined"
                label={"Email"}
                value={email}
                placeholder="Email"
                isReadOnly={false}
                placeholderTextColor={pokemonTypeColor}
                onChange={setEmail}
              />
              <PokeTextField
                color={pokemonTypeColor}
                cursorColor={pokemonTypeColor}
                variant="outlined"
                placeholder="Senha"
                label={"Senha"}
                value={password}
                isReadOnly={false}
                placeholderTextColor={pokemonTypeColor}
                onChange={setPassword}
                icon="eye-outline"
                isPassword
              />

              <PokeButton
                text="Entrar"
                size="fullwidth"
                icon="send"
                variant="contained"
                type={pokemon?.types[0].type.name ?? ""}
              />
            </Flex>
          </Flex>
        </>
      )}
    </>
  );
}

export default PokeLogin;
