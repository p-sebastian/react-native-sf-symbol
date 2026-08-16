// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT
import {afterAll, describe, expect, mock, spyOn, test} from 'bun:test'
import type {ReactElement} from 'react'
import type {ViewProps} from 'react-native'

import type {TSFSymbolProps} from './sf-symbol.type'

const nativeViewType = 'ReactNativeSFSymbolNativeView'

mock.module('expo', () => ({
  requireNativeView: () => nativeViewType,
}))

const developmentGlobal = globalThis as typeof globalThis & {__DEV__?: boolean}
const hadDevelopmentGlobal = Object.hasOwn(developmentGlobal, '__DEV__')
const originalDevelopmentGlobal = developmentGlobal.__DEV__
Object.assign(developmentGlobal, {__DEV__: true})

afterAll(() => {
  if (hadDevelopmentGlobal) Object.assign(developmentGlobal, {__DEV__: originalDevelopmentGlobal})
  else Reflect.deleteProperty(developmentGlobal, '__DEV__')
})

const {SFSymbol} = await import('./index')

type TNativeTestProps = ViewProps & {
  name: string
  fallbackName?: string
  size: number
  renderingMode: string
  colors?: readonly unknown[]
  colorRenderingMode: string
  weight: string
  variableValue?: number
  variableValueMode: string
  effect?: unknown
  transition: unknown
}

const renderNativeProps = (props: TSFSymbolProps): TNativeTestProps => {
  const element = SFSymbol(props) as ReactElement<TNativeTestProps>

  expect(element.type).toBe(nativeViewType)
  return element.props
}

describe('SFSymbol public interface', () => {
  test('renders the native host with static rendering, accessibility, and Magic Replace defaults', () => {
    expect(renderNativeProps({name: 'book', size: 24})).toMatchObject({
      name: 'book',
      fallbackName: undefined,
      size: 24,
      renderingMode: 'monochrome',
      colors: undefined,
      colorRenderingMode: 'flat',
      weight: 'regular',
      variableValue: undefined,
      variableValueMode: 'automatic',
      effect: undefined,
      transition: {
        type: 'magicReplace',
        fallback: 'downUp',
        scope: 'byLayer',
      },
      accessibilityElementsHidden: true,
      accessible: false,
      pointerEvents: 'none',
      style: {width: 24, height: 24},
    })
  })

  test('passes a required baseline fallback and exposes a labeled symbol as an image', () => {
    expect(
      renderNativeProps({
        name: '1.calendar',
        fallback: 'sparkles',
        size: 20,
        accessibilityLabel: 'Upcoming date',
        accessibilityHint: 'Opens the calendar',
        accessibilityLanguage: 'en',
        nativeID: 'date-symbol',
        testID: 'date-symbol-test',
      }),
    ).toMatchObject({
      name: '1.calendar',
      fallbackName: 'sparkles',
      accessibilityElementsHidden: false,
      accessibilityHint: 'Opens the calendar',
      accessibilityLabel: 'Upcoming date',
      accessibilityLanguage: 'en',
      accessibilityRole: 'image',
      accessible: true,
      nativeID: 'date-symbol',
      testID: 'date-symbol-test',
    })
  })

  test('renders nothing for a size that cannot produce an honest layout', () => {
    const consoleWarn = spyOn(console, 'warn').mockImplementation(() => undefined)

    expect(SFSymbol({name: 'book', size: Number.NaN})).toBeNull()
    expect(consoleWarn).toHaveBeenCalledTimes(1)

    consoleWarn.mockRestore()
  })

  test('discards malformed rendering, variable, effect, and transition features at the JavaScript seam', () => {
    const consoleWarn = spyOn(console, 'warn').mockImplementation(() => undefined)
    const malformedProps = {
      name: 'book',
      size: 20,
      renderingMode: 'palette',
      colors: ['red'],
      variableValue: Number.POSITIVE_INFINITY,
      variableValueMode: 'draw',
      effect: {
        behavior: 'indefinite',
        type: 'rotate',
        isActive: true,
        options: {repeat: {count: 0}, speed: Number.NaN},
      },
      transition: {type: 'replace', fallback: 'downUp'},
    } as unknown as TSFSymbolProps

    expect(renderNativeProps(malformedProps)).toMatchObject({
      renderingMode: 'monochrome',
      colors: undefined,
      variableValue: undefined,
      variableValueMode: 'automatic',
      effect: undefined,
      transition: {type: 'magicReplace', fallback: 'downUp', scope: 'byLayer'},
    })
    expect(consoleWarn).toHaveBeenCalled()

    consoleWarn.mockRestore()
  })

  test('does not pass malformed runtime-only values or non-array colors to native', () => {
    const consoleWarn = spyOn(console, 'warn').mockImplementation(() => undefined)
    const malformedProps = {
      name: 'book',
      size: 20,
      renderingMode: 'monochrome',
      colors: {red: 1},
      colorRenderingMode: 'neon',
      weight: 'massive',
      variableValue: 0.5,
      variableValueMode: 'scribble',
      effect: {behavior: 'discrete', type: 'appear', value: {unsafe: true}},
    } as unknown as TSFSymbolProps

    expect(() => renderNativeProps(malformedProps)).not.toThrow()
    expect(renderNativeProps(malformedProps)).toMatchObject({
      colors: undefined,
      colorRenderingMode: 'flat',
      effect: undefined,
      renderingMode: 'monochrome',
      variableValue: 0.5,
      variableValueMode: 'automatic',
      weight: 'regular',
    })

    consoleWarn.mockRestore()
  })

  test('discards a discrete effect with a non-finite numeric identity', () => {
    const consoleWarn = spyOn(console, 'warn').mockImplementation(() => undefined)
    const malformedProps = {
      name: 'book',
      size: 20,
      effect: {behavior: 'discrete', type: 'bounce', value: Number.POSITIVE_INFINITY},
    } as unknown as TSFSymbolProps

    expect(renderNativeProps(malformedProps).effect).toBeUndefined()

    consoleWarn.mockRestore()
  })
})
