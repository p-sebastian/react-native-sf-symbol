// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT

import SwiftUI

private func effectOptions(_ config: SFSymbolEffectConfig) -> SymbolEffectOptions {
  var options: SymbolEffectOptions = .default

  switch config.repeatKind {
  case "nonRepeating":
    options = .nonRepeating
  case "continuous":
    options = .repeat(.continuous)
  case "periodic":
    options = .repeat(.periodic(config.repeatCount, delay: config.repeatDelay))
  default:
    break
  }

  if let speed = config.speed {
    options = options.speed(speed)
  }

  return options
}

private func bounceEffect(_ config: SFSymbolEffectConfig) -> BounceSymbolEffect {
  let directed: BounceSymbolEffect = switch config.direction {
  case "up": .bounce.up
  case "down": .bounce.down
  default: .bounce
  }

  return switch config.scope {
  case "byLayer": directed.byLayer
  case "wholeSymbol": directed.wholeSymbol
  default: directed
  }
}

private func breatheEffect(_ config: SFSymbolEffectConfig) -> BreatheSymbolEffect {
  let styled: BreatheSymbolEffect = switch config.style {
  case "plain": .breathe.plain
  case "pulse": .breathe.pulse
  default: .breathe
  }

  return switch config.scope {
  case "byLayer": styled.byLayer
  case "wholeSymbol": styled.wholeSymbol
  default: styled
  }
}

private func pulseEffect(_ config: SFSymbolEffectConfig) -> PulseSymbolEffect {
  switch config.scope {
  case "byLayer": .pulse.byLayer
  case "wholeSymbol": .pulse.wholeSymbol
  default: .pulse
  }
}

private func rotateEffect(_ config: SFSymbolEffectConfig) -> RotateSymbolEffect {
  let directed: RotateSymbolEffect = switch config.direction {
  case "clockwise": .rotate.clockwise
  case "counterClockwise": .rotate.counterClockwise
  default: .rotate
  }

  return switch config.scope {
  case "byLayer": directed.byLayer
  case "wholeSymbol": directed.wholeSymbol
  default: directed
  }
}

private func variableColorEffect(_ config: SFSymbolEffectConfig) -> VariableColorSymbolEffect {
  let filled: VariableColorSymbolEffect = switch config.fillStyle {
  case "iterative": .variableColor.iterative
  case "cumulative": .variableColor.cumulative
  default: .variableColor
  }
  let played: VariableColorSymbolEffect = switch config.playbackStyle {
  case "reversing": filled.reversing
  case "nonReversing": filled.nonReversing
  default: filled
  }

  return switch config.inactiveLayers {
  case "dim": played.dimInactiveLayers
  case "hide": played.hideInactiveLayers
  default: played
  }
}

private func wiggleEffect(_ config: SFSymbolEffectConfig) -> WiggleSymbolEffect {
  let directed: WiggleSymbolEffect = if let customAngle = config.customAngle {
    .wiggle.custom(angle: customAngle)
  } else {
    switch config.direction {
    case "backward": .wiggle.backward
    case "clockwise": .wiggle.clockwise
    case "counterClockwise": .wiggle.counterClockwise
    case "down": .wiggle.down
    case "forward": .wiggle.forward
    case "left": .wiggle.left
    case "right": .wiggle.right
    case "up": .wiggle.up
    default: .wiggle
    }
  }

  return switch config.scope {
  case "byLayer": directed.byLayer
  case "wholeSymbol": directed.wholeSymbol
  default: directed
  }
}

private func scaleEffect(_ config: SFSymbolEffectConfig) -> ScaleSymbolEffect {
  let scaled: ScaleSymbolEffect = switch config.scale {
  case "down": .scale.down
  case "up": .scale.up
  default: .scale
  }

  return switch config.scope {
  case "byLayer": scaled.byLayer
  case "wholeSymbol": scaled.wholeSymbol
  default: scaled
  }
}

private func appearEffect(_ config: SFSymbolEffectConfig) -> AppearSymbolEffect {
  let scaled: AppearSymbolEffect = switch config.scale {
  case "down": .appear.down
  case "up": .appear.up
  default: .appear
  }

  return switch config.scope {
  case "byLayer": scaled.byLayer
  case "wholeSymbol": scaled.wholeSymbol
  default: scaled
  }
}

private func disappearEffect(_ config: SFSymbolEffectConfig) -> DisappearSymbolEffect {
  let scaled: DisappearSymbolEffect = switch config.scale {
  case "down": .disappear.down
  case "up": .disappear.up
  default: .disappear
  }

  return switch config.scope {
  case "byLayer": scaled.byLayer
  case "wholeSymbol": scaled.wholeSymbol
  default: scaled
  }
}

@MainActor
func applySFSymbolEffect(
  to view: AnyView,
  config: SFSymbolEffectConfig?,
  animationsEnabled: Bool
) -> AnyView {
  guard animationsEnabled else {
    return AnyView(view.symbolEffectsRemoved())
  }
  guard let config else {
    return view
  }

  let options = effectOptions(config)

  if config.behavior == "discrete" {
    let value = config.value ?? ""

    return switch config.type {
    case "bounce": AnyView(view.symbolEffect(bounceEffect(config), options: options, value: value))
    case "breathe": AnyView(view.symbolEffect(breatheEffect(config), options: options, value: value))
    case "pulse": AnyView(view.symbolEffect(pulseEffect(config), options: options, value: value))
    case "rotate": AnyView(view.symbolEffect(rotateEffect(config), options: options, value: value))
    case "variableColor": AnyView(view.symbolEffect(variableColorEffect(config), options: options, value: value))
    case "wiggle": AnyView(view.symbolEffect(wiggleEffect(config), options: options, value: value))
    default: view
    }
  }

  let isActive = config.isActive ?? false

  return switch config.type {
  case "appear": AnyView(view.symbolEffect(appearEffect(config), options: options, isActive: isActive))
  case "bounce": AnyView(view.symbolEffect(bounceEffect(config), options: options, isActive: isActive))
  case "breathe": AnyView(view.symbolEffect(breatheEffect(config), options: options, isActive: isActive))
  case "disappear": AnyView(view.symbolEffect(disappearEffect(config), options: options, isActive: isActive))
  case "pulse": AnyView(view.symbolEffect(pulseEffect(config), options: options, isActive: isActive))
  case "rotate": AnyView(view.symbolEffect(rotateEffect(config), options: options, isActive: isActive))
  case "scale": AnyView(view.symbolEffect(scaleEffect(config), options: options, isActive: isActive))
  case "variableColor": AnyView(view.symbolEffect(variableColorEffect(config), options: options, isActive: isActive))
  case "wiggle": AnyView(view.symbolEffect(wiggleEffect(config), options: options, isActive: isActive))
  default: view
  }
}
