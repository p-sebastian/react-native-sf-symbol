# @p-sebastian/react-native-sf-symbol

A typed, iOS-only SF Symbol view for Expo and React Native New Architecture applications.

## Requirements

- iOS 18 or newer
- Xcode 26 or newer with the iOS 26 SDK
- Expo SDK 57, React Native 0.86, and React 19.2
- A development/native build; Expo Go is not supported

Android, cross-platform fallbacks, and direct access to the native view are outside the package contract.

## Install

```bash
bun expo install @p-sebastian/react-native-sf-symbol
```

If the application does not already use development-client tooling:

```bash
bun expo install expo-dev-client
```

Build the native application after installation or any native dependency change:

```bash
bun expo run:ios
```

For a cloud development build:

```bash
bunx eas-cli@latest build --platform ios --profile development
```

## Basic use

```tsx
import {SFSymbol} from '@p-sebastian/react-native-sf-symbol'

export function SavedSymbol() {
  return <SFSymbol accessibilityLabel="Saved" name="bookmark.fill" size={24} />
}
```

`name` and a positive finite `size` are required. Symbols without an accessibility label are decorative and hidden
from assistive technology. A labeled symbol is exposed as one image.

## Rendering and fallback

```tsx
<SFSymbol
  name="1.calendar"
  fallback="calendar"
  size={28}
  renderingMode="palette"
  colors={['#7C3AED', '#F59E0B']}
/>
```

Names in the SF Symbols 6 baseline need no fallback. A newer catalog name requires an SF Symbols 6 fallback. Palette
rendering requires exactly two or three ordered colors; multicolor rendering accepts no colors. Monochrome is the
default, with the system label color and regular weight.

Gradient color rendering and explicit variable-value modes are valid choices on iOS 18 through 25 but degrade to flat
color and automatic variable rendering. They activate on iOS 26.

## Effects and name transitions

```tsx
<SFSymbol
  name={isSaved ? 'bookmark.fill' : 'bookmark'}
  size={24}
  effect={{behavior: 'discrete', type: 'bounce', value: saveCount}}
  transition={{type: 'magicReplace', fallback: 'downUp', scope: 'byLayer'}}
/>
```

Discrete effects use a boolean, number, or string `value` as their trigger. Indefinite effects use `isActive`. Name
transitions are separate from presentation effects and default to Magic Replace with a Down-Up, by-layer fallback.
Reduce Motion suppresses both effects and transitions.

The package also exports `TSFSymbolProps`, `TSFSymbolName`, `TSFSymbolBaselineName`, `TSFSymbolNewerName`,
`TSFSymbolWeight`, `TSFSymbolEffect`, and `TSFSymbolTransition`.

## Troubleshooting and support

- Rebuild the native application if Expo cannot find `ReactNativeSFSymbol`.
- Confirm that the preferred symbol exists at runtime or provide the required baseline fallback.
- Invalid runtime input degrades safely; development builds emit a warning for each distinct invalid condition.

Public issue handling is best effort and carries no SLA. Reports need a public minimal Expo reproduction and exact
environment versions. Bespoke integrations and environments outside the compatibility matrix are unsupported.

See [CONTRIBUTING.md](CONTRIBUTING.md) for proposals and [SECURITY.md](SECURITY.md) for private vulnerability reports.
This package is available under the [MIT License](LICENSE).
