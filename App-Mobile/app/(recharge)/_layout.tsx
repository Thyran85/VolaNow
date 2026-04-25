import { Stack } from "expo-router";

export default function RechargeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="recharge" />
    </Stack>
  );
}
