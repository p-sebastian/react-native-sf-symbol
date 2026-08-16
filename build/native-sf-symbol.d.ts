import type { ComponentType } from 'react';
import type { ColorValue, ViewProps } from 'react-native';
import type { TSFSymbolTransition } from './sf-symbol.type';
export type TNativeSFSymbolEffect = {
    behavior: 'discrete' | 'indefinite';
    type: 'appear' | 'bounce' | 'breathe' | 'disappear' | 'pulse' | 'rotate' | 'scale' | 'variableColor' | 'wiggle';
    direction?: 'backward' | 'clockwise' | 'counterClockwise' | 'down' | 'forward' | 'left' | 'right' | 'up' | undefined;
    scale?: 'down' | 'up' | undefined;
    style?: 'plain' | 'pulse' | undefined;
    customAngle?: number | undefined;
    fillStyle?: 'cumulative' | 'iterative' | undefined;
    playbackStyle?: 'nonReversing' | 'reversing' | undefined;
    inactiveLayers?: 'dim' | 'hide' | undefined;
    scope?: 'byLayer' | 'wholeSymbol' | undefined;
    value?: string | undefined;
    isActive?: boolean | undefined;
    repeatKind?: 'continuous' | 'nonRepeating' | 'periodic' | undefined;
    repeatCount?: number | undefined;
    repeatDelay?: number | undefined;
    speed?: number | undefined;
};
export type TNativeSFSymbolProps = ViewProps & {
    name: string;
    fallbackName?: string | undefined;
    size: number;
    renderingMode: 'hierarchical' | 'monochrome' | 'multicolor' | 'palette';
    colors?: ColorValue[] | undefined;
    colorRenderingMode: 'flat' | 'gradient';
    weight: 'black' | 'bold' | 'heavy' | 'light' | 'medium' | 'regular' | 'semibold' | 'thin' | 'ultralight';
    variableValue?: number | undefined;
    variableValueMode: 'automatic' | 'color' | 'draw';
    effect?: TNativeSFSymbolEffect | undefined;
    transition: TSFSymbolTransition;
};
export declare const ReactNativeSFSymbolNativeView: ComponentType<TNativeSFSymbolProps>;
//# sourceMappingURL=native-sf-symbol.d.ts.map