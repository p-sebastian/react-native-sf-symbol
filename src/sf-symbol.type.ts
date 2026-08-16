// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT
import type {ColorValue, ViewProps} from 'react-native'
import type {SFSymbol, SFSymbols6_0} from 'sf-symbols-typescript'

export type TSFSymbolBaselineName = SFSymbols6_0
export type TSFSymbolNewerName = Exclude<SFSymbol, SFSymbols6_0>
export type TSFSymbolName = SFSymbol

type TSFSymbolBaselineNameProps = {
  name: TSFSymbolBaselineName
  fallback?: never
}

type TSFSymbolNewerNameProps = {
  name: TSFSymbolNewerName
  fallback: TSFSymbolBaselineName
}

type TSFSymbolOneColor = readonly [ColorValue]
type TSFSymbolPaletteColors = readonly [ColorValue, ColorValue] | readonly [ColorValue, ColorValue, ColorValue]

type TSFSymbolRenderingProps =
  | {renderingMode?: 'hierarchical' | 'monochrome'; colors?: TSFSymbolOneColor}
  | {renderingMode: 'palette'; colors: TSFSymbolPaletteColors}
  | {renderingMode: 'multicolor'; colors?: never}

export type TSFSymbolWeight =
  | 'black'
  | 'bold'
  | 'heavy'
  | 'light'
  | 'medium'
  | 'regular'
  | 'semibold'
  | 'thin'
  | 'ultralight'

type TSFSymbolEffectOptions = {
  repeat?: 'continuous' | 'nonRepeating' | {count?: number; delay?: number}
  speed?: number
}

type TSFSymbolLayerScope = {scope?: 'byLayer' | 'wholeSymbol'}
type TSFSymbolScale = {scale?: 'down' | 'up'} & TSFSymbolLayerScope
type TSFSymbolDirection = {direction?: 'down' | 'up'} & TSFSymbolLayerScope
type TSFSymbolRotate = {direction?: 'clockwise' | 'counterClockwise'} & TSFSymbolLayerScope
type TSFSymbolVariableColor = {
  fillStyle?: 'cumulative' | 'iterative'
  playbackStyle?: 'nonReversing' | 'reversing'
  inactiveLayers?: 'dim' | 'hide'
}
type TSFSymbolWiggle =
  | ({
      direction?: 'backward' | 'clockwise' | 'counterClockwise' | 'down' | 'forward' | 'left' | 'right' | 'up'
      customAngle?: never
    } & TSFSymbolLayerScope)
  | ({direction?: never; customAngle: number} & TSFSymbolLayerScope)

type TSFSymbolEffectConfiguration =
  | ({type: 'appear'} & TSFSymbolScale)
  | ({type: 'bounce'} & TSFSymbolDirection)
  | ({type: 'breathe'; style?: 'plain' | 'pulse'} & TSFSymbolLayerScope)
  | ({type: 'disappear'} & TSFSymbolScale)
  | ({type: 'pulse'} & TSFSymbolLayerScope)
  | ({type: 'rotate'} & TSFSymbolRotate)
  | ({type: 'scale'} & TSFSymbolScale)
  | ({type: 'variableColor'} & TSFSymbolVariableColor)
  | ({type: 'wiggle'} & TSFSymbolWiggle)

type TSFSymbolDiscreteEffectConfiguration = Extract<
  TSFSymbolEffectConfiguration,
  {type: 'bounce' | 'breathe' | 'pulse' | 'rotate' | 'variableColor' | 'wiggle'}
>

export type TSFSymbolEffect =
  | (TSFSymbolDiscreteEffectConfiguration & {
      behavior: 'discrete'
      value: boolean | number | string
      isActive?: never
      options?: TSFSymbolEffectOptions
    })
  | (TSFSymbolEffectConfiguration & {
      behavior: 'indefinite'
      isActive: boolean
      value?: never
      options?: TSFSymbolEffectOptions
    })

type TSFSymbolReplaceDirection = 'downUp' | 'offUp' | 'upUp'
type TSFSymbolReplaceScope = 'byLayer' | 'wholeSymbol'

export type TSFSymbolTransition =
  | {type: 'none'}
  | {type: 'automatic'}
  | {type: 'replace'; direction?: TSFSymbolReplaceDirection; scope?: TSFSymbolReplaceScope; fallback?: never}
  | {type: 'magicReplace'; fallback?: TSFSymbolReplaceDirection; scope?: TSFSymbolReplaceScope; direction?: never}

type TSFSymbolVariableValueProps =
  | {variableValue?: never; variableValueMode?: never}
  | {variableValue: number; variableValueMode?: 'automatic' | 'color' | 'draw'}

type TSFSymbolHostProps = Pick<
  ViewProps,
  'accessibilityHint' | 'accessibilityLabel' | 'accessibilityLanguage' | 'nativeID' | 'testID'
>

export type TSFSymbolProps = (TSFSymbolBaselineNameProps | TSFSymbolNewerNameProps) &
  TSFSymbolRenderingProps &
  TSFSymbolVariableValueProps &
  TSFSymbolHostProps & {
    size: number
    weight?: TSFSymbolWeight
    colorRenderingMode?: 'flat' | 'gradient'
    effect?: TSFSymbolEffect
    transition?: TSFSymbolTransition
  }
