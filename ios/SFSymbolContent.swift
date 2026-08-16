// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT

import SwiftUI

struct SFSymbolContent: View {
  @ObservedObject var model: SFSymbolModel
  @Environment(\.accessibilityReduceMotion) private var reduceMotion

  var body: some View {
    let animationsEnabled = SFSymbolPolicy.animationsAreEnabled(reduceMotion: reduceMotion)
    let rendered = renderedImage()
    let effected = applySFSymbolEffect(
      to: rendered,
      config: model.effect,
      animationsEnabled: animationsEnabled
    )

    applyTransition(to: effected, animationsEnabled: animationsEnabled)
      .frame(maxWidth: .infinity, maxHeight: .infinity)
  }

  private func renderedImage() -> AnyView {
    let image: Image = if let variableValue = model.variableValue {
      Image(systemName: model.resolvedName, variableValue: variableValue)
    } else {
      Image(systemName: model.resolvedName)
    }
    let rendered = image
      .symbolRenderingMode(renderingMode)
      .font(.system(size: model.size, weight: fontWeight))
    let colored: AnyView

    if model.renderingMode == "multicolor" {
      colored = AnyView(rendered)
    } else if model.renderingMode == "palette", model.colors.count == 2 {
      colored = AnyView(
        rendered.foregroundStyle(
          Color(uiColor: model.colors[0]),
          Color(uiColor: model.colors[1])
        )
      )
    } else if model.renderingMode == "palette", model.colors.count == 3 {
      colored = AnyView(
        rendered.foregroundStyle(
          Color(uiColor: model.colors[0]),
          Color(uiColor: model.colors[1]),
          Color(uiColor: model.colors[2])
        )
      )
    } else {
      colored = AnyView(rendered.foregroundStyle(Color(uiColor: model.colors.first ?? .label)))
    }

    return applyAdvancedRendering(to: colored)
  }

  private var renderingMode: SymbolRenderingMode {
    switch model.renderingMode {
    case "hierarchical": .hierarchical
    case "multicolor": .multicolor
    case "palette": .palette
    default: .monochrome
    }
  }

  private var fontWeight: Font.Weight {
    switch model.weight {
    case "black": .black
    case "bold": .bold
    case "heavy": .heavy
    case "light": .light
    case "medium": .medium
    case "semibold": .semibold
    case "thin": .thin
    case "ultralight": .ultraLight
    default: .regular
    }
  }

  private func applyAdvancedRendering(to view: AnyView) -> AnyView {
    guard #available(iOS 26.0, *) else {
      return view
    }

    let requestedColorMode = SFSymbolColorMode(rawValue: model.colorRenderingMode) ?? .flat
    let colorMode = SFSymbolPolicy.resolveColorMode(requestedColorMode, supportsAdvancedRendering: true)
    let requestedVariableMode = SFSymbolVariableMode(rawValue: model.variableValueMode) ?? .automatic
    let variableMode = SFSymbolPolicy.resolveVariableMode(requestedVariableMode, supportsAdvancedRendering: true)
    let colorRendered = colorMode == .gradient
      ? AnyView(view.symbolColorRenderingMode(.gradient))
      : AnyView(view.symbolColorRenderingMode(.flat))

    return switch variableMode {
    case .automatic: colorRendered
    case .color: AnyView(colorRendered.symbolVariableValueMode(.color))
    case .draw: AnyView(colorRendered.symbolVariableValueMode(.draw))
    }
  }

  private func applyTransition(to view: AnyView, animationsEnabled: Bool) -> AnyView {
    guard animationsEnabled, model.transition.type != "none" else {
      return AnyView(view.contentTransition(.identity).animation(nil, value: model.resolvedName))
    }

    let transitioned: AnyView

    switch model.transition.type {
    case "automatic":
      transitioned = AnyView(view.contentTransition(.symbolEffect(.automatic)))
    case "replace":
      transitioned = AnyView(view.contentTransition(.symbolEffect(replaceEffect())))
    default:
      let fallback = replaceEffect(direction: model.transition.fallback ?? "downUp")
      let magic = replaceEffect().magic(fallback: fallback)
      transitioned = AnyView(view.contentTransition(.symbolEffect(magic)))
    }

    return AnyView(transitioned.animation(.default, value: model.resolvedName))
  }

  private func replaceEffect(direction: String? = nil) -> ReplaceSymbolEffect {
    let directed: ReplaceSymbolEffect = switch direction ?? model.transition.direction {
    case "offUp": .replace.offUp
    case "upUp": .replace.upUp
    default: .replace.downUp
    }

    return switch model.transition.scope {
    case "wholeSymbol": directed.wholeSymbol
    default: directed.byLayer
    }
  }
}
