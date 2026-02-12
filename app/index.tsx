import { Redirect } from 'expo-router';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Attachment Profile</Text>
        <Text style={styles.subtitle}>Understanding your relationship patterns</Text>
        <ActivityIndicator size="large" color={Colors.primary} style={styles.spinner} />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/(app)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  spinner: {
    marginTop: 24,
  },
});
