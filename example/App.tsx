import { useState, useEffect, useLayoutEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, ActivityIndicator, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { KV } from 'craby-kv';
import { createMMKV } from 'react-native-mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'test-key';
const LATEST_KEY = 'test-key-latest';
const VALUE = 'Hello, world!';
const ITERATIONS = 1000;

const MMKV = createMMKV();

function useClear() {
  const [isCleared, setIsCleared] = useState(false);

  useEffect(() => {
    async function perform() {
      MMKV.remove(KEY);
      KV.remove(KEY);
      await AsyncStorage.removeItem(KEY);
    }

    perform().then(() => {
      setIsCleared(true);
    });
  }, []);

  return isCleared;
}

function prepare() {
  return new Promise<void>(resolve => setTimeout(() => {
    resolve();
  }, 500));
}

function App() {
  const [latestValue, setLatestValue] = useState('');
  const [benchmarkA, setBenchmarkA] = useState(null);
  const [benchmarkB, setBenchmarkB] = useState(null);
  const [benchmarkC, setBenchmarkC] = useState(null);
  const [isCalculating, setIsCalculating] = useState(true);
  const isCleared = useClear();

  const handleSetValue = () => {
    KV.set(LATEST_KEY, latestValue);
    KV.flush();
    Alert.alert('Value updated successfully!', 'Restart the app to load the changes:\n' + JSON.stringify(KV.get(LATEST_KEY)));
  };

  useLayoutEffect(() => {
    setLatestValue(new Date().toISOString());
  }, []);

  useEffect(() => {
    if (!isCleared) {
      return;
    }

    const runBenchmark = async () => {

      // A: craby-kv
      await prepare();
      const startTimeA = performance.now();
      for (let i = 0; i < ITERATIONS; i++) {
        KV.set(KEY, VALUE + i);
        KV.get(KEY);
      }
      const endTimeA = performance.now();
      const totalTimeA = endTimeA - startTimeA;
      const averageA = totalTimeA / ITERATIONS;

      setBenchmarkA({
        avg: averageA,
        total: totalTimeA,
      });

      // B: react-native-mmkv
      await prepare();
      const startTimeB = performance.now();
      for (let i = 0; i < ITERATIONS; i++) {
        MMKV.set(KEY, VALUE + i);
        MMKV.getString(KEY);
      }
      const endTimeB = performance.now();
      const totalTimeB = endTimeB - startTimeB;
      const averageB = totalTimeB / ITERATIONS;

      setBenchmarkB({
        avg: averageB,
        total: totalTimeB,
      });

      // C: @react-native-async-storage/async-storage
      await prepare();
      const startTimeC = performance.now();
      for (let i = 0; i < ITERATIONS; i++) {
        await AsyncStorage.setItem(KEY, VALUE + i);
        await AsyncStorage.getItem(KEY);
      }
      const endTimeC = performance.now();
      const totalTimeC = endTimeC - startTimeC;
      const averageC = totalTimeC / ITERATIONS;

      setBenchmarkC({
        avg: averageC,
        total: totalTimeC,
      });

      setIsCalculating(false);
    };

    setTimeout(runBenchmark, 100);
  }, [isCleared]);

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
            <Text style={styles.buttonText}>Set value</Text>
          </Pressable>

          <View style={styles.benchmarkSection}>
            <Text style={styles.benchmarkTitle}>Performance Comparison</Text>
            <Text style={styles.benchmarkDescription}>(Get / Set value {ITERATIONS.toLocaleString()} times)</Text>

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

                <View style={[styles.benchmarkCard, styles.libraryB]}>
                  <Text style={styles.libraryName}>react-native-mmkv</Text>
                  <Text style={styles.benchmarkValue}>
                    {benchmarkB.avg.toFixed(4)} ms
                  </Text>
                  <Text style={styles.benchmarkDetail}>
                    Total: {benchmarkB.total.toFixed(2)} ms
                  </Text>
                </View>

                <View style={[styles.benchmarkCard, styles.libraryC]}>
                  <Text style={styles.libraryName}>@react-native-async-storage/async-storage</Text>
                  <Text style={styles.benchmarkValue}>
                    {benchmarkC.avg.toFixed(4)} ms
                  </Text>
                  <Text style={styles.benchmarkDetail}>
                    Total: {benchmarkC.total.toFixed(2)} ms
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
    backgroundColor: '#fde0e0',
    borderWidth: 1.5,
    borderColor: '#ff7377',
  },
  libraryC: {
    backgroundColor: '#fffcc9',
    borderWidth: 1.5,
    borderColor: '#fff44f',
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
