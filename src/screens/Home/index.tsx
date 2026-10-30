import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  async function sendNotification() {
    if (loading) return;
    setLoading(true);
    setStatus('');

    try {
      const permission = await Notifications.getPermissionsAsync();
      let finalStatus = permission.status;

      if (finalStatus !== 'granted') {
        const requested = await Notifications.requestPermissionsAsync();
        finalStatus = requested.status;
      }

      if (finalStatus !== 'granted') {
        setStatus('Permissão não concedida.');
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Notificação recebida!',
          body: 'Oi amigo, finalmente eu funcionei',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
        },
      });

      setStatus('Notificação enviada!');
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      setStatus('Não foi possível enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Notificações</Text>
        <Text style={styles.subtitle}>Teste de notificação local</Text>

        <Pressable
          accessibilityRole="button"
          onPress={sendNotification}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Enviar notificação</Text>
          )}
        </Pressable>

        {status ? <Text style={styles.status}>{status}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 36,
    paddingHorizontal: 24,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    color: '#202938',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#687386',
    fontSize: 14,
    marginBottom: 26,
  },
  button: {
    width: '100%',
    minHeight: 48,
    backgroundColor: '#2563EB',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  status: {
    color: '#465164',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 18,
  },
});
