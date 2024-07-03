import { Icon, IconButton, TextInput } from "@react-native-material/core";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { IconType } from "../icons/types/IconType";

export type PokeTextFieldProps = {
  icon?: IconType;
  variant?: "filled" | "outlined" | "standard";
  defaultValue?: string;
  value?: string;
  label: string;
  isReadOnly: boolean;
  helperText?: string | boolean | undefined;
  error?: boolean;
  color?: string;
  cursorColor?: string;
  placeholderTextColor?: string;
  placeholder: string;
  onChange: (value: string) => void;
  isPassword?: boolean;
};

function PokeTextField(textFieldProps: PokeTextFieldProps) {
  //CONSTS
  const [showPassword, setShowPassword] = useState<boolean>(true);

  //STYLES
  const styles = StyleSheet.create({
    pokeTextField: {
      width: "100%",
      height: 50,
      marginBottom: 15,
      borderWidth: 0,
    },
    pokeTextFieldError: {
      width: "100%",
      height: 50,
      color: "red",
      borderColor: "red",
      marginBottom: 50,
      borderWidth: 0,
    },
    searchSection: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    },
    searchIcon: {
      padding: 10,
    },
    input: {
      flex: 1,
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 0,
      backgroundColor: "#fff",
      color: "#424242",
    },
    helperText:{
      color: 'red', 
      marginTop: -40, 
      marginBottom: 20, 
      marginLeft: 10
    }
  });

  //Miscelaneous Functions
  const handlePressIcon = () => {
    if (textFieldProps.isPassword) {
      showPassword ? setShowPassword(false) : setShowPassword(true);
    }
  };

  return textFieldProps.icon ? (
    <>
      <TextInput
        label={textFieldProps.label}
        variant={textFieldProps.variant}
        defaultValue={textFieldProps.defaultValue}
        onChangeText={textFieldProps.onChange}
        value={textFieldProps.value}
        style={
          textFieldProps.error ? styles.pokeTextFieldError : styles.pokeTextField
        }
        underlineColorAndroid={"transparent"}
        secureTextEntry={!showPassword}
        color={textFieldProps.error ? "red" : textFieldProps.color}
        placeholderTextColor={textFieldProps.placeholderTextColor}
        cursorColor={textFieldProps.cursorColor}
        placeholder={textFieldProps.placeholder}
        trailing={(props) => (
          <IconButton
          onPress={handlePressIcon}
          icon={(props) => (
            <Icon
            name={
                  textFieldProps.isPassword
                    ? showPassword
                      ? "eye-outline"
                      : "eye-off-outline"
                      : textFieldProps.icon ?? "eye-outline"
                    }
                    {...props}
              />
            )}
            {...props}
            />
          )}
      />
      {typeof textFieldProps.helperText == "string" && (
        <Text style={styles.helperText}>{textFieldProps.helperText}</Text>
      )}
    </>
  ) : (
    <>
      <TextInput
        label={textFieldProps.label}
        variant={textFieldProps.variant}
        defaultValue={textFieldProps.defaultValue}
        value={textFieldProps.value}
        style={
          textFieldProps.error ? styles.pokeTextFieldError : styles.pokeTextField
        }
        onChangeText={textFieldProps.onChange}
        color={textFieldProps.error ? "red" : textFieldProps.color}
        placeholderTextColor={textFieldProps.placeholderTextColor}
        cursorColor={textFieldProps.cursorColor}
        placeholder={textFieldProps.placeholder}
      />
      {typeof textFieldProps.helperText == "string" && (
        <Text style={styles.helperText}>{textFieldProps.helperText}</Text>
      )}
    </>
  );
}

export default PokeTextField;
