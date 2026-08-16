// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT
import {SFSymbol} from '@p-sebastian/react-native-sf-symbol'

export const ReadmeSavedSymbol = () => <SFSymbol accessibilityLabel="Saved" name="bookmark.fill" size={24} />

export const readmeRenderingAndFallback = (
  <SFSymbol name="1.calendar" fallback="calendar" size={28} renderingMode="palette" colors={['#7C3AED', '#F59E0B']} />
)

export const ReadmeTransitionSymbol = ({isSaved, saveCount}: {isSaved: boolean; saveCount: number}) => (
  <SFSymbol
    name={isSaved ? 'bookmark.fill' : 'bookmark'}
    size={24}
    effect={{behavior: 'discrete', type: 'bounce', value: saveCount}}
    transition={{type: 'magicReplace', fallback: 'downUp', scope: 'byLayer'}}
  />
)
