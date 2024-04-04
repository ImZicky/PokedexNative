import React from "react";
import { Box, Flex, Wrap, Chip } from "@react-native-material/core";
import PokeText from "../texts/PokeText";
import { Pokemon } from "pokenode-ts";
import { StyleSheet, Image } from "react-native";
import { useCommonService } from "../../service/common/CommonService";
import PokeButton from "../buttons/PokeButton";
import { useNavigation } from "@react-navigation/native";

export type PokeCardProps = {
  pokemon: Pokemon;
  navigation: any;
  userPokemonIds?: number[];
};

function PokeCard(props: PokeCardProps) {
  //Services
  const commonService = useCommonService();

  //Style
  const styles = StyleSheet.create({
    centeredDiv: {
      alignItems: "center",
      alignContent: "center",
    },
    cardImage: { marginTop: 30, padding: 20, width: 100, height: 100 },
    pokeballImage :{
      position: "absolute",
      right: 3,
      width: 35,
      height: 35,
    },
  });

  //Navigation
  const goToPokemonDetails = () => {
    props.navigation.navigate("PokePerfil", { pokemon: props.pokemon });
  };

  return (
    <Box
      style={{
        minWidth: 163,
        width: "auto",
        minHeight: 370,
        height: "auto",
        backgroundColor: "#fff",
        borderRadius: 15,
        margin: 3,
        flex: 2,
        borderColor: commonService.getColorFromType(props.pokemon.types[0].type.name),
        borderStyle: "solid",
        borderWidth: 5
      }}
    >
      <PokeText
        backgroungColor={commonService.getColorFromType(props.pokemon.types[0].type.name)}
        color={"#ffffff"}
        type="card-id"
        text={`#${props.pokemon.id.toString()}`}
      />
      {props.userPokemonIds && props.userPokemonIds.includes(props.pokemon.id) &&
        <Image source={
          require("../../assets/images/pokeball.png")}
          style={styles.pokeballImage}
        />
      }
      <Flex style={styles.centeredDiv}>
        <Image
          style={styles.cardImage}
          source={{
            uri: `${commonService.getPokemonMainImage(props.pokemon.sprites)}`,
          }}
        />
      </Flex>
      <Flex style={styles.centeredDiv}>
        <PokeText color="#000" type="card-title" text={commonService.stringToCapitalLetters(props.pokemon.name)} />
        <Wrap
          spacing={5}
          style={{
            marginHorizontal: 2,
          }}
        >
          {props.pokemon.types.map((type, i) => (

        <Image key={`${props.pokemon.name}_type_${type.type.name}`} style={{width: 30, height: 30}} 
          source={
            type.type.name === 'grass' ? require(`../../assets/images/icons/grass.png`) :
            type.type.name === 'rock' ? require(`../../assets/images/icons/rock.png`) :
            type.type.name === 'normal' ? require(`../../assets/images/icons/normal.png`) :
            type.type.name === 'fire' ? require(`../../assets/images/icons/fire.png`) :
            type.type.name === 'electric' ? require(`../../assets/images/icons/electric.png`) :
            type.type.name === 'flying' ? require(`../../assets/images/icons/flying.png`) :
            type.type.name === 'psychic' ? require(`../../assets/images/icons/psychic.png`) :
            type.type.name === 'water' ? require(`../../assets/images/icons/water.png`) :
            type.type.name === 'ghost' ? require(`../../assets/images/icons/ghost.png`) :
            type.type.name === 'insect' ? require(`../../assets/images/icons/bug.png`) :
            type.type.name === 'ice' ? require(`../../assets/images/icons/ice.png`) :
            type.type.name === 'fighting' ? require(`../../assets/images/icons/fighting.png`) :
            type.type.name === 'poison' ? require(`../../assets/images/icons/poison.png`) :
            type.type.name === 'dragon' ? require(`../../assets/images/icons/dragon.png`) :
            type.type.name === 'ground' ? require(`../../assets/images/icons/ground.png`) :
            type.type.name === 'stellar' ? require(`../../assets/images/icons/dark.png`) :
            type.type.name === 'fairy' ? require(`../../assets/images/icons/fairy.png`) :
            type.type.name === 'bug' ? require(`../../assets/images/icons/bug.png`) :
            type.type.name === 'dark' ? require(`../../assets/images/icons/dark.png`) :
            type.type.name === 'steel' ? require(`../../assets/images/icons/steel.png`) :
            require('../../assets/images/icons/normal.png')
          }
        />

            // <Chip
            //   key={`${props.pokemon.name}_type_${type.type.name}`}
            //   style={{
            //     backgroundColor: commonService.getColorFromType(type.type.name),
            //     alignItems: "center"
            //   }}
            //   color="#FFF"              
            //   label={type.type.name.toUpperCase()}            
            // />
          ))}
        </Wrap>

        <Wrap
          style={{
            marginTop: 10,
          }}
        >
          <PokeText color="#000" type="card-text" text="Height: ≅ " />
          <PokeText
            color="#000"
            type="card-text"
            text={commonService.getPokemonHeight(props.pokemon.height)}
          />
        </Wrap>
        <Wrap
          style={{
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          <PokeText color="#000" type="card-text" text="Wheight: ≅ " />
          <PokeText
            color="#000"
            type="card-text"
            text={commonService.getPokemonWheight(props.pokemon.weight)}
          />
        </Wrap>
        <PokeButton
          onClick={() => goToPokemonDetails()}
          text="Details"
          variant="contained"
          styleType={props.pokemon.types[0].type.name}
          size="small"
        />
      </Flex>
    </Box>
  );
}

export default PokeCard;
