import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/lib/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>GGDaily</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    fontSize: theme.typography.title,
    color: theme.colors.text,
  },
});
