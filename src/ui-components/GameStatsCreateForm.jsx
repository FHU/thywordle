/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { GameStats } from "../models";
import { fetchByPath, validateField } from "./utils";
import { DataStore } from "aws-amplify";
export default function GameStatsCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    winDistribution: "",
    gamesFailed: "",
    currentStreak: "",
    bestStreak: "",
    totalGames: "",
    successRate: "",
  };
  const [winDistribution, setWinDistribution] = React.useState(
    initialValues.winDistribution
  );
  const [gamesFailed, setGamesFailed] = React.useState(
    initialValues.gamesFailed
  );
  const [currentStreak, setCurrentStreak] = React.useState(
    initialValues.currentStreak
  );
  const [bestStreak, setBestStreak] = React.useState(initialValues.bestStreak);
  const [totalGames, setTotalGames] = React.useState(initialValues.totalGames);
  const [successRate, setSuccessRate] = React.useState(
    initialValues.successRate
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setWinDistribution(initialValues.winDistribution);
    setGamesFailed(initialValues.gamesFailed);
    setCurrentStreak(initialValues.currentStreak);
    setBestStreak(initialValues.bestStreak);
    setTotalGames(initialValues.totalGames);
    setSuccessRate(initialValues.successRate);
    setErrors({});
  };
  const validations = {
    winDistribution: [],
    gamesFailed: [],
    currentStreak: [],
    bestStreak: [],
    totalGames: [],
    successRate: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          winDistribution,
          gamesFailed,
          currentStreak,
          bestStreak,
          totalGames,
          successRate,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value.trim() === "") {
              modelFields[key] = undefined;
            }
          });
          await DataStore.save(new GameStats(modelFields));
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            onError(modelFields, err.message);
          }
        }
      }}
      {...getOverrideProps(overrides, "GameStatsCreateForm")}
      {...rest}
    >
      <TextField
        label="Win distribution"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={winDistribution}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              winDistribution: value,
              gamesFailed,
              currentStreak,
              bestStreak,
              totalGames,
              successRate,
            };
            const result = onChange(modelFields);
            value = result?.winDistribution ?? value;
          }
          if (errors.winDistribution?.hasError) {
            runValidationTasks("winDistribution", value);
          }
          setWinDistribution(value);
        }}
        onBlur={() => runValidationTasks("winDistribution", winDistribution)}
        errorMessage={errors.winDistribution?.errorMessage}
        hasError={errors.winDistribution?.hasError}
        {...getOverrideProps(overrides, "winDistribution")}
      ></TextField>
      <TextField
        label="Games failed"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={gamesFailed}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              winDistribution,
              gamesFailed: value,
              currentStreak,
              bestStreak,
              totalGames,
              successRate,
            };
            const result = onChange(modelFields);
            value = result?.gamesFailed ?? value;
          }
          if (errors.gamesFailed?.hasError) {
            runValidationTasks("gamesFailed", value);
          }
          setGamesFailed(value);
        }}
        onBlur={() => runValidationTasks("gamesFailed", gamesFailed)}
        errorMessage={errors.gamesFailed?.errorMessage}
        hasError={errors.gamesFailed?.hasError}
        {...getOverrideProps(overrides, "gamesFailed")}
      ></TextField>
      <TextField
        label="Current streak"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={currentStreak}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              winDistribution,
              gamesFailed,
              currentStreak: value,
              bestStreak,
              totalGames,
              successRate,
            };
            const result = onChange(modelFields);
            value = result?.currentStreak ?? value;
          }
          if (errors.currentStreak?.hasError) {
            runValidationTasks("currentStreak", value);
          }
          setCurrentStreak(value);
        }}
        onBlur={() => runValidationTasks("currentStreak", currentStreak)}
        errorMessage={errors.currentStreak?.errorMessage}
        hasError={errors.currentStreak?.hasError}
        {...getOverrideProps(overrides, "currentStreak")}
      ></TextField>
      <TextField
        label="Best streak"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={bestStreak}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              winDistribution,
              gamesFailed,
              currentStreak,
              bestStreak: value,
              totalGames,
              successRate,
            };
            const result = onChange(modelFields);
            value = result?.bestStreak ?? value;
          }
          if (errors.bestStreak?.hasError) {
            runValidationTasks("bestStreak", value);
          }
          setBestStreak(value);
        }}
        onBlur={() => runValidationTasks("bestStreak", bestStreak)}
        errorMessage={errors.bestStreak?.errorMessage}
        hasError={errors.bestStreak?.hasError}
        {...getOverrideProps(overrides, "bestStreak")}
      ></TextField>
      <TextField
        label="Total games"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={totalGames}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              winDistribution,
              gamesFailed,
              currentStreak,
              bestStreak,
              totalGames: value,
              successRate,
            };
            const result = onChange(modelFields);
            value = result?.totalGames ?? value;
          }
          if (errors.totalGames?.hasError) {
            runValidationTasks("totalGames", value);
          }
          setTotalGames(value);
        }}
        onBlur={() => runValidationTasks("totalGames", totalGames)}
        errorMessage={errors.totalGames?.errorMessage}
        hasError={errors.totalGames?.hasError}
        {...getOverrideProps(overrides, "totalGames")}
      ></TextField>
      <TextField
        label="Success rate"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={successRate}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              winDistribution,
              gamesFailed,
              currentStreak,
              bestStreak,
              totalGames,
              successRate: value,
            };
            const result = onChange(modelFields);
            value = result?.successRate ?? value;
          }
          if (errors.successRate?.hasError) {
            runValidationTasks("successRate", value);
          }
          setSuccessRate(value);
        }}
        onBlur={() => runValidationTasks("successRate", successRate)}
        errorMessage={errors.successRate?.errorMessage}
        hasError={errors.successRate?.hasError}
        {...getOverrideProps(overrides, "successRate")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
