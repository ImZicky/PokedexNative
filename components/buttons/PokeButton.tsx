import React, { useEffect, useState } from "react";
import { Button } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { IconType } from "../icons/types/IconType";
import { StyleSheet } from "react-native";
import { useCommonService } from "../../service/common/CommonService";
import { Audio } from 'expo-av';

export type ButtonProps = {
  text?: string;
  size: "fullwidth" | "medium" | "small";
  icon?: IconType;
  loading?: boolean;
  variant: "text" | "outlined" | "contained";
  isReadOnly?: boolean;
  styleType: string;
  color?: string;
  onClick?: (event: any) => void;
};

export default function PokeButton(buttonProps: ButtonProps) {
  //Services
  const commonService = useCommonService();

  //Miscelaneus methods
  const getWidthFromSize = (size: string) => {
    switch (size) {
      case "fullwidth":
        return "100%";
      case "medium":
        return 200;
      case "small":
        return 120;
      default:
        return 120;
    }
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: buttonProps.styleType,
      width: getWidthFromSize(buttonProps.size),
    },
  });


  const [soundSelectButton, setSoundSelectButton] = useState<any>();
  const playSoundSelectButton = async () => {
    const { sound } = await Audio.Sound.createAsync(require('../../assets/musics/selectButton.mp3'));
    setSoundSelectButton(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return soundSelectButton
    ? () => {
      soundSelectButton.unloadAsync();
    }
    : undefined;
  }, [soundSelectButton]);


  const handleClick = (e: any) => {
    playSoundSelectButton();
    buttonProps.onClick(e);
  }

  return buttonProps.icon ? (
    <Button
      style={styles.button}
      tintColor={buttonProps.color}
      color={buttonProps.color}
      title={buttonProps.text}
      variant={buttonProps.variant}
      loading={buttonProps.loading}
      disabled={buttonProps.isReadOnly}
      trailing={(props) => <Icon name={buttonProps.icon} {...props} />}
      onPress={(e) => handleClick(e)}
      />
    ) : (
    <Button
      style={styles.button}
      tintColor={buttonProps.color}
      color={buttonProps.color}
      title={buttonProps.text}
      variant={buttonProps.variant}
      loading={buttonProps.loading}
      disabled={buttonProps.isReadOnly}
      onPress={(e) => handleClick(e)}
    />
  );
}
