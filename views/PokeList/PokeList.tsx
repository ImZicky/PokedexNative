import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { usePokemonService } from "../../service/api/PokemonService";
import UseUserService from "../../service/api/UserService";
import { useCommonService } from "../../service/common/CommonService";
import { Pokemon } from "pokenode-ts";
import { Box, Chip, Flex, Wrap } from "@react-native-material/core";
import PokeLoading from "../../components/loader/PokeLoading";
import PokeText from "../../components/texts/PokeText";
import PokeButton from "../../components/buttons/PokeButton";
import PokeCard from "../../components/cards/PokeCard";
import PokeIconButton from "../../components/buttons/PokeIconButton";
import PokePagination from "../../components/paginations/PokePagination";

export type PokeListProps = {};

function PokeList(props: PokeListProps) {
  //Consts
  const [pokemonList, setPokemonList] = useState<Pokemon[] | undefined>();
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSearchingPokemons, setIsSearchingPokemons] =
    useState<boolean>(false);

  //Services
  const pokemonService = usePokemonService();
  const commonService = useCommonService();
  const userService = UseUserService();

  //Fetches
  const fetchPokemonList = async () => {
    setLoading(true);
    pokemonService
      .getPokemonListPagination(pageNumber, pageSize)
      .then((data) => {
        setPokemonList(data);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
      });
  };

  //UseEffect
  useEffect(() => {
    if (pokemonList === undefined || isSearchingPokemons) {
      fetchPokemonList();
      setIsSearchingPokemons(false);
    }
  }, [pageNumber]);

  //Style
  const styles = StyleSheet.create({
    view: {
      width: "100%",
      height: "100%",
    },
    header: {
      paddingTop: 20,
      height: 300,
      marginBottom: 10,
      backgroundColor: "#ed5463",
      borderRadius: 20,
    },
    scrollview: {
      width: "100%",
      height: "100%",
      padding: 10,
      backgroundColor: "#ed5463",
      paddingBottom: 50,
    },
    centeredDiv: {
      alignItems: "center",
      alignContent: "center",
    },
    headerImage: { marginTop: 20, padding: 20, width: 100, height: 100 },
  });

  const changePage = (newPageNumber: number) => {
    setIsSearchingPokemons(true);
    if (newPageNumber < 0) newPageNumber = 0;
    if (newPageNumber > 20) newPageNumber = 20;
    setPageNumber(newPageNumber);
  };

  return (
    <View style={styles.view}>
      {pokemonList ? (
        <ScrollView style={styles.scrollview}>
          <PokePagination
            changePage={(pageNumber) => changePage(pageNumber)}
            pageNumber={pageNumber}
          />
          {!loading ? (
            <Wrap>
              {pokemonList.map((pokemon) => (
                <PokeCard key={`${pokemon.name}`} pokemon={pokemon} />
              ))}
            </Wrap>
          ) : (
            <PokeLoading loadType="list" />
          )}
        </ScrollView>
      ) : (
        <PokeLoading loadType="page" />
      )}
    </View>
  );
}

export default PokeList;
