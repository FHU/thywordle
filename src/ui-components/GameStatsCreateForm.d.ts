/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type GameStatsCreateFormInputValues = {
    winDistribution?: number;
    gamesFailed?: number;
    currentStreak?: number;
    bestStreak?: number;
    totalGames?: number;
    successRate?: number;
};
export declare type GameStatsCreateFormValidationValues = {
    winDistribution?: ValidationFunction<number>;
    gamesFailed?: ValidationFunction<number>;
    currentStreak?: ValidationFunction<number>;
    bestStreak?: ValidationFunction<number>;
    totalGames?: ValidationFunction<number>;
    successRate?: ValidationFunction<number>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type GameStatsCreateFormOverridesProps = {
    GameStatsCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    winDistribution?: PrimitiveOverrideProps<TextFieldProps>;
    gamesFailed?: PrimitiveOverrideProps<TextFieldProps>;
    currentStreak?: PrimitiveOverrideProps<TextFieldProps>;
    bestStreak?: PrimitiveOverrideProps<TextFieldProps>;
    totalGames?: PrimitiveOverrideProps<TextFieldProps>;
    successRate?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type GameStatsCreateFormProps = React.PropsWithChildren<{
    overrides?: GameStatsCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: GameStatsCreateFormInputValues) => GameStatsCreateFormInputValues;
    onSuccess?: (fields: GameStatsCreateFormInputValues) => void;
    onError?: (fields: GameStatsCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: GameStatsCreateFormInputValues) => GameStatsCreateFormInputValues;
    onValidate?: GameStatsCreateFormValidationValues;
} & React.CSSProperties>;
export default function GameStatsCreateForm(props: GameStatsCreateFormProps): React.ReactElement;
