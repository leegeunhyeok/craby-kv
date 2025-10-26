import { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, ActivityIndicator, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { KV } from 'craby-kv';

const KEY = 'test-key';
const LATEST_KEY = 'test-key-latest';
const VALUE = 'Hello, world!';
const ITERATIONS = 1000;

KV.initialize();

function App() {
  const latestValue = new Date().toISOString();
  const [benchmarkA, setBenchmarkA] = useState(null);
  const [isCalculating, setIsCalculating] = useState(true);

  const handleSetValue = () => {
    KV.set(LATEST_KEY, latestValue);
    Alert.alert('Value set successfully!', 'Restart the app to load the changes');
  };

  useEffect(() => {
    const prepare = () => {
      KV.set(KEY, VALUE);
    };

    const runBenchmark = () => {
      // A: craby-kv
      const startTimeA = performance.now();
      for (let i = 0; i < ITERATIONS; i++) {
        KV.get(KEY);
      }
      const endTimeA = performance.now();
      const totalTimeA = endTimeA - startTimeA;
      const averageA = totalTimeA / ITERATIONS;

      setBenchmarkA({
        avg: averageA,
        total: totalTimeA,
      });

      setIsCalculating(false);
    };

    setTimeout(() => {
      prepare();
      runBenchmark();
    }, 100);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>
            craby-kv
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>Key</Text>
            <Text style={styles.value}>{LATEST_KEY}</Text>
          </View>

          <View style={styles.arrow}>
            <Text style={styles.arrowText}>↓</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Value</Text>
            <Text style={styles.hash}>{JSON.stringify(KV.get(LATEST_KEY))}</Text>
          </View>

          <Pressable style={styles.button} onPress={handleSetValue}>
            <Text style={styles.buttonText}>Set Value: {latestValue}</Text>
          </Pressable>

          <View style={styles.benchmarkSection}>
            <Text style={styles.benchmarkTitle}>Performance Comparison</Text>
            <Text style={styles.benchmarkDescription}>(Get value {ITERATIONS.toLocaleString()} times)</Text>

            {isCalculating ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#4a90e2" />
                <Text style={styles.loadingText}>
                  Running {ITERATIONS.toLocaleString()} iterations...
                </Text>
              </View>
            ) : (
              <>
                <View style={[styles.benchmarkCard, styles.libraryA]}>
                  <Text style={styles.libraryName}>craby-kv</Text>
                  <Text style={styles.benchmarkValue}>
                    {benchmarkA.avg.toFixed(4)} ms
                  </Text>
                  <Text style={styles.benchmarkDetail}>
                    Total: {benchmarkA.total.toFixed(2)} ms
                  </Text>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#000000',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  hash: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
    color: '#000000',
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 8,
    marginVertical: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#ffffff',
  },
  arrow: {
    alignItems: 'center',
    marginVertical: 16,
  },
  arrowText: {
    fontSize: 28,
    color: '#4a90e2',
  },
  benchmarkSection: {
    marginTop: 24,
  },
  benchmarkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    textAlign: 'center',
  },
  benchmarkDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: '#666666',
  },
  benchmarkCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  libraryA: {
    backgroundColor: '#e8f4f8',
    borderWidth: 1.5,
    borderColor: '#4a90e2',
  },
  libraryB: {
    backgroundColor: '#f0e8f8',
    borderWidth: 1.5,
    borderColor: '#9b59b6',
  },
  libraryC: {
    backgroundColor: '#dff5d3',
    borderWidth: 1.5,
    borderColor: '#77dd77',
  },
  libraryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },
  benchmarkValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 3,
  },
  benchmarkDetail: {
    fontSize: 11,
    color: '#666666',
  },
});

export default App;
