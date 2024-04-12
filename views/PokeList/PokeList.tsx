import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { usePokemonService } from "../../service/api/PokemonService";
import UseUserService from "../../service/api/UserService";
import { useCommonService } from "../../service/common/CommonService";
import { Pokemon } from "pokenode-ts";
import { Wrap } from "@react-native-material/core";
import PokeLoading from "../../components/loader/PokeLoading";
import PokeCard from "../../components/cards/PokeCard";
import PokePagination from "../../components/paginations/PokePagination";
import { PokemonForBattle } from "../../service/api/types/PokemonForBattle";

export type PokeListProps = {
  navigation: any;
  userPokemonIds: number[];
  userPokemons: PokemonForBattle[];
};

export default function PokeList(cProps: PokeListProps) {
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

  //Fetches
  const fetchPokemonList = async () => {
    pokemonList
      ? setLoading(true)
      : commonService.handleInactivateNavigatorBar(true);

    pokemonService
      .getPokemonListPagination(pageNumber, pageSize)
      .then((data) => {
        setPokemonList(data);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        pokemonList !== undefined
          ? setLoading(false)
          : commonService.handleInactivateNavigatorBar(false);
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
      backgroundColor: "#ed5463",
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
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 10,
      backgroundColor: "#ed5463",
      marginBottom: 60,
    },
    centeredDiv: {
      alignItems: "center",
      alignContent: "center",
    },
    headerImage: { marginTop: 20, padding: 20, width: 100, height: 100 },
    pagination: {
      bottom: 0, 
      position: "absolute", 
      backgroundColor: "#cb3241", 
      width: "100%", 
      height: 60
    }
  });

  const changePage = (newPageNumber: number) => {
    setIsSearchingPokemons(true);
    const totalPages = (parseInt(`${1010 / (pageSize + 1)}`));
    if (newPageNumber < 0) newPageNumber = 0;
    if (newPageNumber > totalPages) newPageNumber = 20;
    setPageNumber(newPageNumber);
  };

  return (
    <View style={styles.view}>
      {pokemonList ? (
        <>
          {!loading ? (
            <>
              <ScrollView style={styles.scrollview}>
                <Wrap>
                  {pokemonList.map((pokemon) => (
                    <PokeCard
                      userPokemons={cProps.userPokemons}
                      userPokemonIds={cProps.userPokemonIds}
                      navigation={cProps.navigation}
                      key={`${pokemon.name}`}
                      pokemon={pokemon}
                    />
                  ))}
                </Wrap>
              </ScrollView>
              <View style={styles.pagination}>
                <PokePagination
                  setPageSize={(size: number) => setPageSize(size)}
                  pageSize={pageSize}
                  changePage={(pageNumber) => changePage(pageNumber)}
                  pageNumber={pageNumber}
                  />
                </View>
            </>

          ) : (
            <PokeLoading loadType="list" />
          )}
        </>
      ) : (
        <PokeLoading loadType="page" />
      )}
    </View>
  );
}
