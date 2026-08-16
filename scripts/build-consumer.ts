#!/usr/bin/env bun
// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT
import {cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {basename, join, resolve} from 'node:path'

type TNpmPackResult = {filename: string}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const parsePackResult = (contents: string): TNpmPackResult => {
  const value: unknown = JSON.parse(contents)
  const result = Array.isArray(value) ? value[0] : undefined
  if (!isRecord(result) || typeof result.filename !== 'string' || basename(result.filename) !== result.filename) {
    throw new Error('npm pack returned an invalid tarball filename.')
  }
  return {filename: result.filename}
}

const parseExamplePackage = (contents: string): Record<string, unknown> & {dependencies: Record<string, unknown>} => {
  const value: unknown = JSON.parse(contents)
  if (!isRecord(value) || !isRecord(value.dependencies)) throw new Error('Example package.json has no dependencies.')
  return {...value, dependencies: {...value.dependencies}}
}

const packageRoot = join(import.meta.dir, '..')
const temporaryRoot = mkdtempSync(join(tmpdir(), 'react-native-sf-symbol-consumer-'))
const appDirectory = join(temporaryRoot, 'app')
const tarballDirectory = join(temporaryRoot, 'tarball')
const derivedDataDirectory = join(temporaryRoot, 'derived-data')

const commandEnvironment = {...process.env, ASDF_RUBY_VERSION: process.env.ASDF_RUBY_VERSION ?? '3.4.9'}

const run = (command: string[], cwd = packageRoot): void => {
  const result = Bun.spawnSync({cmd: command, cwd, env: commandEnvironment, stderr: 'inherit', stdout: 'inherit'})
  if (result.exitCode !== 0) throw new Error(`${command[0]} failed with exit code ${result.exitCode}.`)
}

const runForOutput = (command: string[], cwd = packageRoot): string => {
  const result = Bun.spawnSync({cmd: command, cwd, env: commandEnvironment, stderr: 'inherit', stdout: 'pipe'})
  if (result.exitCode !== 0) throw new Error(`${command[0]} failed with exit code ${result.exitCode}.`)
  return result.stdout.toString()
}

try {
  const source = process.argv[2]
  let dependency: string
  let sourceDescription: string
  if (source === undefined) {
    run(['mkdir', '-p', tarballDirectory])
    const output = runForOutput([
      'npm',
      'pack',
      '--json',
      '--ignore-scripts',
      '--cache',
      join(temporaryRoot, 'npm-cache'),
      '--pack-destination',
      tarballDirectory,
    ])
    const packResult = parsePackResult(output)
    dependency = `file:../tarball/${packResult.filename}`
    sourceDescription = packResult.filename
  } else if (/^\d+\.\d+\.\d+$/u.test(source)) {
    dependency = source
    sourceDescription = `registry version ${source}`
  } else if (source.endsWith('.tgz')) {
    const tarballPath = resolve(source)
    if (!statSync(tarballPath).isFile()) throw new Error(`Tarball does not exist: ${tarballPath}`)
    dependency = `file:${tarballPath}`
    sourceDescription = tarballPath
  } else {
    throw new Error('Consumer source must be an exact stable version or .tgz path.')
  }

  cpSync(join(packageRoot, 'apps/example'), appDirectory, {recursive: true})
  for (const generatedPath of ['.expo', 'android', 'build', 'bun.lock', 'ios', 'node_modules']) {
    rmSync(join(appDirectory, generatedPath), {force: true, recursive: true})
  }
  const packagePath = join(appDirectory, 'package.json')
  const packageJson = parseExamplePackage(readFileSync(packagePath, 'utf8'))
  packageJson.dependencies['@p-sebastian/react-native-sf-symbol'] = dependency
  writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`)

  run(['bun', 'install'], appDirectory)
  run(['bun', 'run', 'typecheck'], appDirectory)
  run(['bun', 'expo', 'prebuild', '--platform', 'ios', '--clean', '--no-install'], appDirectory)
  run(['pod', 'install'], join(appDirectory, 'ios'))

  const workspace = readdirSync(join(appDirectory, 'ios')).find(path => path.endsWith('.xcworkspace'))
  if (!workspace) throw new Error('Expo did not generate an Xcode workspace.')
  const scheme = basename(workspace, '.xcworkspace')
  const simulatorList = runForOutput(['xcrun', 'simctl', 'list', 'devices', 'available'])
  const simulatorMatches = [
    ...simulatorList.matchAll(/^\s+(iPhone[^()]*) \(([A-F0-9-]{36})\) \((Booted|Shutdown)\)\s*$/gmu),
  ]
  const simulator = simulatorMatches.find(match => match[3] === 'Booted') ?? simulatorMatches[0]
  const simulatorName = simulator?.[1]?.trim()
  const simulatorId = simulator?.[2]
  if (!simulatorId || !simulatorName) throw new Error('No available iPhone simulator was found.')
  if (simulator?.[3] !== 'Booted') {
    run(['xcrun', 'simctl', 'boot', simulatorId])
    run(['xcrun', 'simctl', 'bootstatus', simulatorId, '-b'])
  }

  run(
    [
      'xcodebuild',
      '-workspace',
      join(appDirectory, 'ios', workspace),
      '-quiet',
      '-scheme',
      scheme,
      '-configuration',
      'Release',
      '-sdk',
      'iphonesimulator',
      '-destination',
      `platform=iOS Simulator,id=${simulatorId}`,
      '-derivedDataPath',
      derivedDataDirectory,
      'CODE_SIGNING_ALLOWED=NO',
      'build',
    ],
    appDirectory,
  )
  const productsDirectory = join(derivedDataDirectory, 'Build/Products/Release-iphonesimulator')
  const application = readdirSync(productsDirectory).find(path => path.endsWith('.app'))
  if (!application) throw new Error('The clean consumer build produced no simulator application.')
  const applicationPath = join(productsDirectory, application)
  run(['xcrun', 'simctl', 'install', simulatorId, applicationPath])
  run([
    'xcrun',
    'simctl',
    'launch',
    '--terminate-running-process',
    simulatorName,
    'com.psebastian.reactnativesfsymbol.example',
  ])
  const automationSession = `sf-symbol-consumer-${process.pid}`
  run([
    'agent-device',
    'open',
    'com.psebastian.reactnativesfsymbol.example',
    '--relaunch',
    '--platform',
    'ios',
    '--device',
    simulatorName,
    '--session',
    automationSession,
  ])
  try {
    run([
      'agent-device',
      'wait',
      '2000',
      '--platform',
      'ios',
      '--device',
      simulatorName,
      '--session',
      automationSession,
    ])
    for (const [identifier, label] of [
      ['saved-symbol', 'Saved book'],
      ['contract-symbol', 'Upcoming date'],
      ['advanced-symbol', 'Animated progress'],
    ]) {
      const attributes = runForOutput([
        'agent-device',
        'snapshot',
        '--force-full',
        '--raw',
        '--scope',
        identifier,
        '--platform',
        'ios',
        '--device',
        simulatorName,
        '--session',
        automationSession,
      ])
      if (!attributes.includes(identifier) || !attributes.includes(label) || !attributes.includes('"type":"Image"')) {
        throw new Error(`Runtime smoke contract failed for ${identifier}.`)
      }
    }
    const screenshotPath = join(temporaryRoot, 'runtime-smoke.png')
    run(['xcrun', 'simctl', 'io', simulatorId, 'screenshot', screenshotPath])
    if (statSync(screenshotPath).size === 0) throw new Error('The clean consumer runtime screenshot is empty.')
  } finally {
    run(['agent-device', 'close', '--platform', 'ios', '--device', simulatorName, '--session', automationSession])
  }
  console.log(`Built and launched clean consumer from ${sourceDescription}.`)
} finally {
  rmSync(temporaryRoot, {force: true, recursive: true})
}
