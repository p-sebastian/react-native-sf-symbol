// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT

import ExpoModulesCore
import UIKit

public final class ReactNativeSFSymbolModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ReactNativeSFSymbol")

    View(ReactNativeSFSymbolView.self) {
      Prop("name") { (view, name: String) in
        guard !name.isEmpty else {
          return
        }
        view.model.setPreferredName(name)
      }

      Prop("fallbackName") { (view, fallbackName: String?) in
        view.model.setFallbackName(fallbackName)
      }

      Prop("size") { (view, size: Double) in
        guard size > 0, size.isFinite else {
          return
        }
        view.model.size = size
      }

      Prop("renderingMode") { (view, renderingMode: String) in
        guard SFSymbolInputValidation.renderingModes.contains(renderingMode) else {
          return
        }
        view.model.renderingMode = renderingMode
      }

      Prop("colors") { (view, colors: [UIColor]?) in
        guard colors.map({ SFSymbolPolicy.isValidForegroundColorCount($0.count) }) ?? true else {
          return
        }
        view.model.colors = colors ?? []
      }

      Prop("colorRenderingMode") { (view, colorRenderingMode: String) in
        guard SFSymbolInputValidation.colorRenderingModes.contains(colorRenderingMode) else {
          return
        }
        view.model.colorRenderingMode = colorRenderingMode
      }

      Prop("weight") { (view, weight: String) in
        guard SFSymbolInputValidation.weights.contains(weight) else {
          return
        }
        view.model.weight = weight
      }

      Prop("variableValue") { (view, variableValue: Double?) in
        guard variableValue.map(\.isFinite) ?? true else {
          return
        }
        view.model.variableValue = variableValue
      }

      Prop("variableValueMode") { (view, variableValueMode: String) in
        guard SFSymbolInputValidation.variableValueModes.contains(variableValueMode) else {
          return
        }
        view.model.variableValueMode = variableValueMode
      }

      Prop("effect") { (view, effect: SFSymbolEffectConfig?) in
        guard effect.map(SFSymbolInputValidation.effect) ?? true else {
          return
        }
        view.model.effect = effect
      }

      Prop("transition") { (view, transition: SFSymbolTransitionConfig) in
        guard SFSymbolInputValidation.transition(transition) else {
          return
        }
        view.model.transition = transition
      }
    }
  }
}
