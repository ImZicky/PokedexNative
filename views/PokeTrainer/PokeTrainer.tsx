import React, { useEffect, useState } from "react";
import { Box, Flex, Wrap } from "@react-native-material/core";
import { StyleSheet, Image, ImageBackground, View, Modal } from "react-native";
import PokeLoading from "../../components/loader/PokeLoading";
import PokeText from "../../components/texts/PokeText";
import { usePokemonService } from "../../service/api/PokemonService";
import { useCommonService } from "../../service/common/CommonService";
import { PokeballTypeEnum, PokemonForBattle, PokemonForBattleSkills } from "../../service/api/types/PokemonForBattle";
import { PokemonTrainer, PokemonTrainerItem } from "../../service/api/types/PokemonTrainer";
import { Audio } from 'expo-av';
import { MusicName } from "../../service/api/types/Music";
import PokeButton from "../../components/buttons/PokeButton";
import PokeIconButton from "../../components/buttons/PokeIconButton";

export type PokeTrainerProps = {
  navigation: any;
  userPokemonTrainer: PokemonTrainer;
  playSoundDefault: (name: MusicName) => void;
};

function PokeTrainer(props: PokeTrainerProps) {
  const [loading, setLoading] = useState<boolean>(false);

  //Style
  const styles = StyleSheet.create({
    
  });

  return (
    <>
      {!loading ? (
        <PokeText text="INICIO DA PAGE treinador" color={"#000"} type={"h1"} />
      ) : (
        <PokeLoading loadType="page" />
      )}
    </>
  );
}

export default PokeTrainer;

