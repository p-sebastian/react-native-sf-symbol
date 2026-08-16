// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT
import type {ReactElement} from 'react'

import {ReactNativeSFSymbolNativeView} from './native-sf-symbol'
import type {TSFSymbolProps} from './sf-symbol.type'
import {isValidSFSymbolSize, normalizeSFSymbolProps, warnInvalidSFSymbolInput} from './sf-symbol.util'

export const SFSymbol = (props: TSFSymbolProps): ReactElement | null => {
  const {accessibilityHint, accessibilityLabel, accessibilityLanguage, nativeID, size, testID} = props

  if (!isValidSFSymbolSize(size)) {
    warnInvalidSFSymbolInput('size', 'SFSymbol size must be a positive finite number.')
    return null
  }

  const nativeProps = normalizeSFSymbolProps(props)
  const accessible = accessibilityLabel !== undefined

  return (
    <ReactNativeSFSymbolNativeView
      {...nativeProps}
      accessibilityElementsHidden={!accessible}
      accessibilityHint={accessible ? accessibilityHint : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityLanguage={accessible ? accessibilityLanguage : undefined}
      accessibilityRole={accessible ? 'image' : undefined}
      accessible={accessible}
      collapsable={false}
      nativeID={nativeID}
      pointerEvents="none"
      style={{width: size, height: size}}
      testID={testID}
    />
  )
}
