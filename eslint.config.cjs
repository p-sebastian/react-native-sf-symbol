// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT
const {defineConfig} = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['apps/example/ios/**', 'build/**', 'node_modules/**'],
    settings: {
      'import/core-modules': ['bun:test'],
    },
  },
])
