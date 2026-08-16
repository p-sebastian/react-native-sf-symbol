// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT
import {SFSymbol} from './index'

export const validSFSymbolContracts = [
  <SFSymbol key="baseline" name="book" size={20} />,
  <SFSymbol key="newer" name="1.calendar" fallback="calendar" size={20} />,
  <SFSymbol key="palette" name="text.quote" size={20} renderingMode="palette" colors={['red', 'orange']} />,
  <SFSymbol
    key="discrete"
    name="checkmark.circle.fill"
    size={20}
    effect={{behavior: 'discrete', type: 'bounce', value: 1}}
  />,
  <SFSymbol
    key="indefinite"
    name="snowflake"
    size={20}
    effect={{behavior: 'indefinite', type: 'rotate', isActive: true}}
  />,
]

// @ts-expect-error — names newer than SF Symbols 6 require a safe baseline fallback.
export const newerNameWithoutFallback = <SFSymbol name="1.calendar" size={20} />

// @ts-expect-error — baseline names do not accept an unnecessary fallback.
export const baselineNameWithFallback = <SFSymbol name="book" fallback="sparkles" size={20} />

// @ts-expect-error — palette rendering requires two or three ordered colors.
export const paletteWithOneColor = <SFSymbol name="book" size={20} renderingMode="palette" colors={['red']} />

export const multicolorWithColors = (
  // @ts-expect-error — multicolor symbols retain their authored colors.
  <SFSymbol name="cloud.sun.fill" size={20} renderingMode="multicolor" colors={['red']} />
)

// @ts-expect-error — an explicit variable rendering mode requires a variable value.
export const drawWithoutVariableValue = <SFSymbol name="speaker.wave.3.fill" size={20} variableValueMode="draw" />

export const discreteWithActiveFlag = (
  // @ts-expect-error — discrete effects use a value trigger, not an active flag.
  <SFSymbol name="bell.fill" size={20} effect={{behavior: 'discrete', type: 'bounce', isActive: true}} />
)

export const indefiniteWithValue = (
  // @ts-expect-error — indefinite effects use an active flag, not a value trigger.
  <SFSymbol name="snowflake" size={20} effect={{behavior: 'indefinite', type: 'rotate', value: 1}} />
)
