// swift-tools-version: 6.0
// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT

import PackageDescription

let package = Package(
  name: "ReactNativeSFSymbolPolicy",
  platforms: [.macOS(.v15)],
  products: [
    .library(name: "ReactNativeSFSymbolPolicy", targets: ["ReactNativeSFSymbolPolicy"]),
  ],
  targets: [
    .target(
      name: "ReactNativeSFSymbolPolicy",
      path: "ios",
      exclude: [
        "ReactNativeSFSymbolModule.swift",
        "ReactNativeSFSymbolView.swift",
        "SFSymbolContent.swift",
        "SFSymbolEffect.swift",
        "SFSymbolModel.swift",
        "SFSymbolRecords.swift",
      ],
      sources: ["SFSymbolPolicy.swift"]
    ),
    .testTarget(
      name: "ReactNativeSFSymbolPolicyTests",
      dependencies: ["ReactNativeSFSymbolPolicy"],
      path: "Tests"
    ),
  ]
)
