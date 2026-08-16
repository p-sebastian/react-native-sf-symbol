// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT

import ExpoModulesCore

struct SFSymbolEffectConfig: Record {
  @Field var behavior: String = "indefinite"
  @Field var type: String = "pulse"
  @Field var direction: String?
  @Field var scale: String?
  @Field var style: String?
  @Field var customAngle: Double?
  @Field var fillStyle: String?
  @Field var playbackStyle: String?
  @Field var inactiveLayers: String?
  @Field var scope: String?
  @Field var value: String?
  @Field var isActive: Bool?
  @Field var repeatKind: String?
  @Field var repeatCount: Int?
  @Field var repeatDelay: Double?
  @Field var speed: Double?
}

struct SFSymbolTransitionConfig: Record {
  @Field var type: String = "magicReplace"
  @Field var direction: String?
  @Field var fallback: String?
  @Field var scope: String?
}

enum SFSymbolInputValidation {
  private static let effectBehaviors: Set<String> = ["discrete", "indefinite"]
  private static let effectTypes: Set<String> = [
    "appear", "bounce", "breathe", "disappear", "pulse", "rotate", "scale", "variableColor", "wiggle",
  ]
  private static let discreteEffectTypes: Set<String> = [
    "bounce", "breathe", "pulse", "rotate", "variableColor", "wiggle",
  ]
  private static let layerScopes: Set<String> = ["byLayer", "wholeSymbol"]
  private static let replaceDirections: Set<String> = ["downUp", "offUp", "upUp"]

  static let renderingModes: Set<String> = ["hierarchical", "monochrome", "multicolor", "palette"]
  static let weights: Set<String> = [
    "black", "bold", "heavy", "light", "medium", "regular", "semibold", "thin", "ultralight",
  ]
  static let colorRenderingModes: Set<String> = ["flat", "gradient"]
  static let variableValueModes: Set<String> = ["automatic", "color", "draw"]

  static func effect(_ config: SFSymbolEffectConfig) -> Bool {
    guard effectBehaviors.contains(config.behavior), effectTypes.contains(config.type) else {
      return false
    }
    guard containsOptional(config.scope, in: layerScopes) else {
      return false
    }
    guard containsOptional(config.repeatKind, in: ["continuous", "nonRepeating", "periodic"]) else {
      return false
    }
    guard config.repeatCount.map({ $0 > 0 }) ?? true,
          config.repeatDelay.map({ $0 >= 0 && $0.isFinite }) ?? true,
          config.speed.map({ $0 > 0 && $0.isFinite }) ?? true
    else {
      return false
    }

    if config.behavior == "discrete" {
      guard discreteEffectTypes.contains(config.type), config.value != nil, config.isActive == nil else {
        return false
      }
    } else if config.isActive == nil || config.value != nil {
      return false
    }

    switch config.type {
    case "appear", "disappear", "scale":
      return containsOptional(config.scale, in: ["down", "up"])
        && config.direction == nil && config.style == nil && variableColorFieldsAreEmpty(config)
        && config.customAngle == nil
    case "bounce":
      return containsOptional(config.direction, in: ["down", "up"])
        && config.scale == nil && config.style == nil && variableColorFieldsAreEmpty(config)
        && config.customAngle == nil
    case "breathe":
      return containsOptional(config.style, in: ["plain", "pulse"])
        && config.direction == nil && config.scale == nil && variableColorFieldsAreEmpty(config)
        && config.customAngle == nil
    case "pulse":
      return config.direction == nil && config.scale == nil && config.style == nil
        && variableColorFieldsAreEmpty(config) && config.customAngle == nil
    case "rotate":
      return containsOptional(config.direction, in: ["clockwise", "counterClockwise"])
        && config.scale == nil && config.style == nil && variableColorFieldsAreEmpty(config)
        && config.customAngle == nil
    case "variableColor":
      return containsOptional(config.fillStyle, in: ["cumulative", "iterative"])
        && containsOptional(config.playbackStyle, in: ["nonReversing", "reversing"])
        && containsOptional(config.inactiveLayers, in: ["dim", "hide"])
        && config.direction == nil && config.scale == nil && config.style == nil
        && config.customAngle == nil && config.scope == nil
    case "wiggle":
      return containsOptional(
        config.direction,
        in: ["backward", "clockwise", "counterClockwise", "down", "forward", "left", "right", "up"]
      ) && (config.direction == nil || config.customAngle == nil)
        && config.scale == nil && config.style == nil && variableColorFieldsAreEmpty(config)
    default:
      return false
    }
  }

  static func transition(_ config: SFSymbolTransitionConfig) -> Bool {
    guard containsOptional(config.scope, in: layerScopes) else {
      return false
    }

    switch config.type {
    case "none", "automatic":
      return config.direction == nil && config.fallback == nil && config.scope == nil
    case "replace":
      return containsOptional(config.direction, in: replaceDirections) && config.fallback == nil
    case "magicReplace":
      return containsOptional(config.fallback, in: replaceDirections) && config.direction == nil
    default:
      return false
    }
  }

  private static func containsOptional(_ value: String?, in allowed: Set<String>) -> Bool {
    value.map(allowed.contains) ?? true
  }

  private static func variableColorFieldsAreEmpty(_ config: SFSymbolEffectConfig) -> Bool {
    config.fillStyle == nil && config.playbackStyle == nil && config.inactiveLayers == nil
  }
}
