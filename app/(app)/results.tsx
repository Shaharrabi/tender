import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes, FontFamilies, Typography, ButtonSizes, BorderRadius, Shadows } from '@/constants/theme';
import ECRRResults from '@/components/results/ECRRResults';
import DUTCHResults from '@/components/results/DUTCHResults';
import SSEITResults from '@/components/results/SSEITResults';
import DSIRResults from '@/components/results/DSIRResults';
import IPIPResults from '@/components/results/IPIPResults';
import ValuesResults from '@/components/results/ValuesResults';

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type: string; scores: string }>();
  const type = params.type || 'ecr-r';

  let scores: any;
  try {
    scores = JSON.parse(params.scores);
  } catch {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Could not load results.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/(app)/home')}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  switch (type) {
    case 'ecr-r':
      return <ECRRResults scores={scores} />;
    case 'dutch':
      return <DUTCHResults scores={scores} />;
    case 'sseit':
      return <SSEITResults scores={scores} />;
    case 'dsi-r':
      return <DSIRResults scores={scores} />;
    case 'ipip-neo-120':
      return <IPIPResults scores={scores} />;
    case 'values':
      return <ValuesResults scores={scores} />;
    default:
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.center}>
            <Text style={styles.errorText}>
              Results view not yet available for: {type}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace('/(app)/home')}
            >
              <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  errorText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  buttonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
});
