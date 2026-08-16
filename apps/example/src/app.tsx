// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT
import {StyleSheet, Text, View} from 'react-native'
import {SFSymbol} from '@p-sebastian/react-native-sf-symbol'

export const App = () => (
  <View style={styles.screen}>
    <View style={styles.card}>
      <SFSymbol accessibilityLabel="Saved book" name="bookmark.fill" size={44} testID="saved-symbol" />
      <Text style={styles.title}>SF Symbol package smoke test</Text>
      <SFSymbol
        accessibilityLabel="Upcoming date"
        name="1.calendar"
        fallback="calendar"
        size={44}
        renderingMode="palette"
        colors={['#7C3AED', '#F59E0B']}
        testID="contract-symbol"
      />
      <SFSymbol
        accessibilityLabel="Animated progress"
        name="speaker.wave.3.fill"
        size={44}
        colorRenderingMode="gradient"
        variableValue={0.5}
        variableValueMode="draw"
        effect={{behavior: 'indefinite', type: 'pulse', isActive: true}}
        transition={{type: 'automatic'}}
        testID="advanced-symbol"
      />
    </View>
  </View>
)

const styles = StyleSheet.create({
  card: {alignItems: 'center', gap: 20},
  screen: {alignItems: 'center', flex: 1, justifyContent: 'center'},
  title: {fontSize: 18, fontWeight: '600'},
})
