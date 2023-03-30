import React from "react";
import { View, Text } from "react-native";
import { PokemonClient } from "pokenode-ts";

export type PokeDashProps = {};

(async () => {
  const pokeApi = new PokemonClient();

  await pokeApi
    .getPokemonByName("luxray")
    .then((data) => console.log(data.name)) // will output "Luxray"
    .catch((error) => console.error(error));
})();

function PokeDash(props: PokeDashProps) {
  return (
    <View>
      <Text>dash</Text>
    </View>
  );
}

export default PokeDash;
