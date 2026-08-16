// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT

import Testing

@testable import ReactNativeSFSymbolPolicy

@Suite("SF Symbol native policy")
struct SFSymbolPolicyTests {
  @Test("uses the preferred name when the runtime provides it")
  func preferredNameIsAvailable() {
    let resolved = SFSymbolPolicy.resolveName(
      preferred: "fireworks",
      fallback: "sparkles",
      isAvailable: { $0 == "fireworks" }
    )

    #expect(resolved == "fireworks")
  }

  @Test("uses the baseline fallback when the preferred name is unavailable")
  func preferredNameIsUnavailable() {
    let resolved = SFSymbolPolicy.resolveName(
      preferred: "fireworks",
      fallback: "sparkles",
      isAvailable: { $0 == "sparkles" }
    )

    #expect(resolved == "sparkles")
  }

  @Test("suppresses effects and transitions under Reduce Motion")
  func reduceMotion() {
    #expect(SFSymbolPolicy.animationsAreEnabled(reduceMotion: false))
    #expect(!SFSymbolPolicy.animationsAreEnabled(reduceMotion: true))
  }

  @Test("degrades unsupported gradient rendering to flat")
  func gradientFallback() {
    #expect(SFSymbolPolicy.resolveColorMode(.gradient, supportsAdvancedRendering: false) == .flat)
    #expect(SFSymbolPolicy.resolveColorMode(.gradient, supportsAdvancedRendering: true) == .gradient)
  }

  @Test("degrades unsupported variable draw rendering to automatic")
  func variableDrawFallback() {
    #expect(SFSymbolPolicy.resolveVariableMode(.draw, supportsAdvancedRendering: false) == .automatic)
    #expect(SFSymbolPolicy.resolveVariableMode(.draw, supportsAdvancedRendering: true) == .draw)
  }

  @Test("accepts one to three ordered foreground colors")
  func foregroundColorCount() {
    #expect(!SFSymbolPolicy.isValidForegroundColorCount(0))
    #expect(SFSymbolPolicy.isValidForegroundColorCount(1))
    #expect(SFSymbolPolicy.isValidForegroundColorCount(2))
    #expect(SFSymbolPolicy.isValidForegroundColorCount(3))
    #expect(!SFSymbolPolicy.isValidForegroundColorCount(4))
  }
}
