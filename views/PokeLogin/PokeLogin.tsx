import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import PokeButton from "../../components/buttons/PokeButton";
import { User } from "../../components/user/types/User";
import { Flex } from "@react-native-material/core";
import { PokemonClient, Pokemon } from "pokenode-ts";
import { StyleSheet } from "react-native";
import PokeTextField from "../../components/textfields/PokeTextField";
import PokeLoading from "../../components/loader/PokeLoading";
import PokeText from "../../components/texts/PokeText";
import { usePokemonService } from "../../service/api/PokemonService";
import { useCommonService } from "../../service/common/CommonService";

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
  const pokemonService = usePokemonService();
  const commonService = useCommonService();

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
                    uri: `${pokemon?.sprites.other?.["official-artwork"].front_default}`,
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
              <PokeText
                text={"Login"}
                color={pokemonTypeColor ?? "#000000"}
                type={"h2"}
              />
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
      ) : (
        <PokeLoading />
      )}
    </>
  );
}

export default PokeLogin;
