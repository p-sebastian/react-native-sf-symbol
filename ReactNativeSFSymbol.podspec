# Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
# SPDX-License-Identifier: MIT

require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name             = "ReactNativeSFSymbol"
  s.version          = package["version"]
  s.summary          = package["description"]
  s.description      = package["description"]
  s.homepage         = package["homepage"]
  s.license          = package["license"]
  s.author           = package["author"]
  s.platforms        = { :ios => "18.0" }
  s.swift_version    = "5.9"
  s.source           = { :git => "https://github.com/p-sebastian/react-native-sf-symbol.git", :tag => "v#{s.version}" }
  s.static_framework = true
  s.source_files     = "ios/**/*.{h,m,mm,swift}"

  s.dependency "ExpoModulesCore"

  s.pod_target_xcconfig = {
    "DEFINES_MODULE" => "YES",
    "SWIFT_COMPILATION_MODE" => "wholemodule"
  }
end
