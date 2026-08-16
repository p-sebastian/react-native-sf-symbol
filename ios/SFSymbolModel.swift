// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT

import SwiftUI
import UIKit

@MainActor
final class SFSymbolModel: ObservableObject {
  @Published private(set) var resolvedName = "questionmark"
  @Published var size = 20.0
  @Published var renderingMode = "monochrome"
  @Published var colors: [UIColor] = []
  @Published var colorRenderingMode = "flat"
  @Published var weight = "regular"
  @Published var variableValue: Double?
  @Published var variableValueMode = "automatic"
  @Published var effect: SFSymbolEffectConfig?
  @Published var transition = SFSymbolTransitionConfig()

  private var preferredName = "questionmark"
  private var fallbackName: String?

  func setPreferredName(_ name: String) {
    preferredName = name
    resolveName()
  }

  func setFallbackName(_ name: String?) {
    fallbackName = name
    resolveName()
  }

  private func resolveName() {
    let nextName = SFSymbolPolicy.resolveName(
      preferred: preferredName,
      fallback: fallbackName,
      isAvailable: { UIImage(systemName: $0) != nil }
    )

    guard nextName != resolvedName else {
      return
    }

    withAnimation {
      resolvedName = nextName
    }
  }
}
