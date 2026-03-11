import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="boas-vindas" />
      <Stack.Screen name="quanto-investir" />
      <Stack.Screen name="por-quanto-tempo" />
      <Stack.Screen name="prioridade" />
    </Stack>
  );
}
