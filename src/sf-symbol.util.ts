// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT
import type {TNativeSFSymbolEffect, TNativeSFSymbolProps} from './native-sf-symbol'
import type {TSFSymbolEffect, TSFSymbolProps} from './sf-symbol.type'

const warnedConditions = new Set<string>()

export const warnInvalidSFSymbolInput = (condition: string, message: string): void => {
  if (typeof __DEV__ === 'undefined' || !__DEV__ || warnedConditions.has(condition)) return

  warnedConditions.add(condition)
  console.warn(message)
}

const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)
const isPositiveFiniteNumber = (value: unknown): value is number => isFiniteNumber(value) && value > 0
const isNonnegativeFiniteNumber = (value: unknown): value is number => isFiniteNumber(value) && value >= 0
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const isOneOf = <T extends string>(value: unknown, values: readonly T[]): value is T =>
  typeof value === 'string' && values.includes(value as T)
const isOptionalOneOf = <T extends string>(value: unknown, values: readonly T[]): boolean =>
  value === undefined || isOneOf(value, values)

const normalizeEffectValue = (value: boolean | number | string): string => `${typeof value}:${String(value)}`

const normalizeEffectOptions = (
  options: TSFSymbolEffect['options'],
): Pick<TNativeSFSymbolEffect, 'repeatCount' | 'repeatDelay' | 'repeatKind' | 'speed'> => {
  if (!options) return {}

  const {repeat, speed} = options
  const speedProps = speed === undefined ? {} : {speed}

  if (!repeat) return speedProps
  if (repeat === 'continuous' || repeat === 'nonRepeating') return {...speedProps, repeatKind: repeat}

  return {
    ...speedProps,
    repeatKind: 'periodic',
    ...(repeat.count === undefined ? {} : {repeatCount: repeat.count}),
    ...(repeat.delay === undefined ? {} : {repeatDelay: repeat.delay}),
  }
}

const commonEffectKeys = new Set(['behavior', 'isActive', 'options', 'scope', 'type', 'value'])
const effectSpecificKeys: Record<string, readonly string[]> = {
  appear: ['scale'],
  bounce: ['direction'],
  breathe: ['style'],
  disappear: ['scale'],
  pulse: [],
  rotate: ['direction'],
  scale: ['scale'],
  variableColor: ['fillStyle', 'inactiveLayers', 'playbackStyle'],
  wiggle: ['customAngle', 'direction'],
}

const hasOnlyEffectKeys = (effect: Record<string, unknown>): boolean => {
  const specificKeys = effectSpecificKeys[String(effect.type)] ?? []
  return Object.keys(effect).every(key => commonEffectKeys.has(key) || specificKeys.includes(key))
}

const isValidEffectOptions = (value: unknown): boolean => {
  if (value === undefined) return true
  if (!isRecord(value) || Object.keys(value).some(key => key !== 'repeat' && key !== 'speed')) return false
  if (value.speed !== undefined && !isPositiveFiniteNumber(value.speed)) return false
  if (value.repeat === undefined || value.repeat === 'continuous' || value.repeat === 'nonRepeating') return true
  if (!isRecord(value.repeat) || Object.keys(value.repeat).some(key => key !== 'count' && key !== 'delay')) return false
  return (
    (value.repeat.count === undefined || (Number.isInteger(value.repeat.count) && Number(value.repeat.count) > 0)) &&
    (value.repeat.delay === undefined || isNonnegativeFiniteNumber(value.repeat.delay))
  )
}

const isValidEffect = (value: unknown): value is TSFSymbolEffect => {
  if (!isRecord(value) || !hasOnlyEffectKeys(value) || !isValidEffectOptions(value.options)) return false
  if (!isOneOf(value.type, Object.keys(effectSpecificKeys))) return false
  if (!isOptionalOneOf(value.scope, ['byLayer', 'wholeSymbol'])) return false

  if (value.behavior === 'discrete') {
    if (
      !isOneOf(value.type, ['bounce', 'breathe', 'pulse', 'rotate', 'variableColor', 'wiggle']) ||
      !isOneOf(typeof value.value, ['boolean', 'number', 'string']) ||
      (typeof value.value === 'number' && !Number.isFinite(value.value)) ||
      value.isActive !== undefined
    )
      return false
  } else if (value.behavior === 'indefinite') {
    if (typeof value.isActive !== 'boolean' || value.value !== undefined) return false
  } else return false

  switch (value.type) {
    case 'appear':
    case 'disappear':
    case 'scale':
      return isOptionalOneOf(value.scale, ['down', 'up'])
    case 'bounce':
      return isOptionalOneOf(value.direction, ['down', 'up'])
    case 'breathe':
      return isOptionalOneOf(value.style, ['plain', 'pulse'])
    case 'pulse':
      return true
    case 'rotate':
      return isOptionalOneOf(value.direction, ['clockwise', 'counterClockwise'])
    case 'variableColor':
      return (
        value.scope === undefined &&
        isOptionalOneOf(value.fillStyle, ['cumulative', 'iterative']) &&
        isOptionalOneOf(value.playbackStyle, ['nonReversing', 'reversing']) &&
        isOptionalOneOf(value.inactiveLayers, ['dim', 'hide'])
      )
    case 'wiggle':
      return (
        isOptionalOneOf(value.direction, [
          'backward',
          'clockwise',
          'counterClockwise',
          'down',
          'forward',
          'left',
          'right',
          'up',
        ]) &&
        (value.customAngle === undefined || isFiniteNumber(value.customAngle)) &&
        (value.direction === undefined || value.customAngle === undefined)
      )
  }
  return false
}

const normalizeEffect = (effect: TSFSymbolEffect | undefined): TNativeSFSymbolEffect | undefined => {
  if (!effect) return undefined

  if (!isValidEffect(effect)) {
    warnInvalidSFSymbolInput('effect', 'SFSymbol discarded an invalid effect and applied no effect.')
    return undefined
  }

  if (effect.behavior === 'discrete') {
    const {options, value, ...configuration} = effect
    return {...configuration, ...normalizeEffectOptions(options), value: normalizeEffectValue(value)}
  }

  const {options, ...configuration} = effect
  return {...configuration, ...normalizeEffectOptions(options)}
}

const normalizeRendering = (props: TSFSymbolProps): Pick<TNativeSFSymbolProps, 'colors' | 'renderingMode'> => {
  const mode = props.renderingMode ?? 'monochrome'
  const colors = props.colors
  const colorsAreValid = colors === undefined || Array.isArray(colors)
  const colorCount = Array.isArray(colors) ? colors.length : 0
  const valid =
    colorsAreValid &&
    (((mode === 'monochrome' || mode === 'hierarchical') && colorCount <= 1) ||
      (mode === 'palette' && (colorCount === 2 || colorCount === 3)) ||
      (mode === 'multicolor' && colorCount === 0))

  if (valid) return {colors: colors ? [...colors] : undefined, renderingMode: mode}

  warnInvalidSFSymbolInput('rendering', 'SFSymbol discarded an invalid rendering configuration and used monochrome.')
  return {colors: undefined, renderingMode: 'monochrome'}
}

const defaultTransition = {type: 'magicReplace', fallback: 'downUp', scope: 'byLayer'} as const

const normalizeTransition = (transition: TSFSymbolProps['transition']): TNativeSFSymbolProps['transition'] => {
  if (!transition) return defaultTransition
  if (!isRecord(transition)) return defaultTransition
  const keys = Object.keys(transition)
  if ((transition.type === 'none' || transition.type === 'automatic') && keys.length === 1) return transition
  if (
    transition.type === 'replace' &&
    keys.every(key => key === 'type' || key === 'direction' || key === 'scope') &&
    isOptionalOneOf(transition.direction, ['downUp', 'offUp', 'upUp']) &&
    isOptionalOneOf(transition.scope, ['byLayer', 'wholeSymbol'])
  )
    return transition as TNativeSFSymbolProps['transition']
  if (
    transition.type === 'magicReplace' &&
    keys.every(key => key === 'type' || key === 'fallback' || key === 'scope') &&
    isOptionalOneOf(transition.fallback, ['downUp', 'offUp', 'upUp']) &&
    isOptionalOneOf(transition.scope, ['byLayer', 'wholeSymbol'])
  )
    return transition as TNativeSFSymbolProps['transition']

  warnInvalidSFSymbolInput('transition', 'SFSymbol discarded an invalid transition and used Magic Replace.')
  return defaultTransition
}

export const normalizeSFSymbolProps = (props: TSFSymbolProps): TNativeSFSymbolProps => {
  const rendering = normalizeRendering(props)
  const variableValue = isFiniteNumber(props.variableValue) ? props.variableValue : undefined
  const weight = isOneOf(props.weight, [
    'black',
    'bold',
    'heavy',
    'light',
    'medium',
    'regular',
    'semibold',
    'thin',
    'ultralight',
  ])
    ? props.weight
    : 'regular'
  const colorRenderingMode = isOneOf(props.colorRenderingMode, ['flat', 'gradient']) ? props.colorRenderingMode : 'flat'
  const variableValueMode =
    variableValue !== undefined && isOneOf(props.variableValueMode, ['automatic', 'color', 'draw'])
      ? (props.variableValueMode ?? 'automatic')
      : 'automatic'

  if (props.variableValue !== undefined && variableValue === undefined) {
    warnInvalidSFSymbolInput('variable-value', 'SFSymbol discarded a non-finite variable value.')
  }
  if (props.weight !== undefined && weight === 'regular' && props.weight !== 'regular') {
    warnInvalidSFSymbolInput('weight', 'SFSymbol discarded an invalid weight and used regular.')
  }
  if (props.colorRenderingMode !== undefined && colorRenderingMode === 'flat' && props.colorRenderingMode !== 'flat') {
    warnInvalidSFSymbolInput('color-rendering', 'SFSymbol discarded an invalid color rendering mode and used flat.')
  }
  if (
    props.variableValueMode !== undefined &&
    variableValueMode === 'automatic' &&
    props.variableValueMode !== 'automatic'
  ) {
    warnInvalidSFSymbolInput('variable-mode', 'SFSymbol discarded an invalid variable value mode and used automatic.')
  }

  return {
    name: props.name,
    fallbackName: props.fallback,
    size: props.size,
    ...rendering,
    colorRenderingMode,
    weight,
    variableValue,
    variableValueMode,
    effect: normalizeEffect(props.effect),
    transition: normalizeTransition(props.transition),
  }
}

export const isValidSFSymbolSize = (size: number): boolean => Number.isFinite(size) && size > 0
