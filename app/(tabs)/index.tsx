import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  SafeAreaView, ActivityIndicator, TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 

export default function App() {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [error, setError] = useState('');
  const [direction, setDirection] = useState('en-fr');
  const [loading, setLoading] = useState(false);

  const translateWord = async () => {
    if (!word.trim()) {
      setError('Please enter a word.');
      return;
    }

    setError('');
    setLoading(true);
    setTranslation('');

    const [sourceLang, targetLang] = direction === 'en-fr' ? ['en', 'fr'] : ['fr', 'en'];
    const url = `https://lexicala1.p.rapidapi.com/search-entries?language=${sourceLang}&text=${word}&translation=${targetLang}&analyzed=true`;

    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '18658b9419msh91182a824a7c1cbp13082fjsnfb330cecbb32',
        'x-rapidapi-host': 'lexicala1.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      const matched = data.results.find(r => r.headword?.text?.toLowerCase() === word.toLowerCase());

      if (!matched) {
        setTranslation('No matching word found.');
        setLoading(false);
        return;
      }

      const translated = matched.senses
        ?.map(sense => sense.translations?.[targetLang]?.text)
        .find(Boolean);

      setTranslation(
        translated || `No ${targetLang.toUpperCase()} translation found.`
      );
    } catch (error) {
      console.error(error);
      setError('Failed to fetch translation.');
      setTranslation('');
    } finally {
      setLoading(false);
    }
  };

  const toggleDirection = () => {
    setDirection(prev => (prev === 'en-fr' ? 'fr-en' : 'en-fr'));
    setTranslation('');
    setWord('');
    setError('');
  };

  return (
    <LinearGradient colors={['#e0f7fa', '#e0f2f1']} style={styles.safeArea}>
      <SafeAreaView style={styles.inner}>
        <Text style={styles.title}>
          {direction === 'en-fr' ? 'EN ➡️ FR Translator' : 'FR ➡️ EN Translator'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder={`Enter ${direction === 'en-fr' ? 'English' : 'French'} word`}
          value={word}
          onChangeText={setWord}
        />

        <TouchableOpacity style={styles.button} onPress={translateWord}>
          <Text style={styles.buttonText}>Translate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchButton} onPress={toggleDirection}>
          <Text style={styles.switchButtonText}>
            Switch to {direction === 'en-fr' ? 'FR ➡️ EN' : 'EN ➡️ FR'}
          </Text>
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" color="#00796B" style={{ marginTop: 30 }} />
        ) : (
          translation !== '' && (
            <View style={styles.card}>
              <Text style={styles.translation}>{translation}</Text>
            </View>
          )
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 100,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004D40',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 25,
    fontSize: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  button: {
    backgroundColor: '#00796B',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  switchButtonText: {
    color: '#00695C',
    fontSize: 16,
    fontStyle: 'italic',
  },
  error: {
    color: '#d32f2f',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#B2DFDB',
    marginTop: 30,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  translation: {
    fontSize: 20,
    color: '#004D40',
    textAlign: 'center',
    fontWeight: '500',
  },
})