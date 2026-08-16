// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT

enum SFSymbolColorMode: String {
  case flat
  case gradient
}

enum SFSymbolVariableMode: String {
  case automatic
  case color
  case draw
}

enum SFSymbolPolicy {
  static func isValidForegroundColorCount(_ count: Int) -> Bool {
    (1 ... 3).contains(count)
  }

  static func resolveName(
    preferred: String,
    fallback: String?,
    isAvailable: (String) -> Bool
  ) -> String {
    if isAvailable(preferred) {
      return preferred
    }

    return fallback ?? preferred
  }

  static func animationsAreEnabled(reduceMotion: Bool) -> Bool {
    !reduceMotion
  }

  static func resolveColorMode(
    _ requested: SFSymbolColorMode,
    supportsAdvancedRendering: Bool
  ) -> SFSymbolColorMode {
    requested == .gradient && !supportsAdvancedRendering ? .flat : requested
  }

  static func resolveVariableMode(
    _ requested: SFSymbolVariableMode,
    supportsAdvancedRendering: Bool
  ) -> SFSymbolVariableMode {
    supportsAdvancedRendering ? requested : .automatic
  }
}
