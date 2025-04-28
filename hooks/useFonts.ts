import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { SplashScreen } from 'expo-router';

export function useCustomFonts() {
  const [loaded, error] = useFonts({
    'Nunito-Regular': Nunito_400Regular,
    'Nunito-Medium': Nunito_500Medium,
    'Nunito-SemiBold': Nunito_600SemiBold,
    'Nunito-Bold': Nunito_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      // Hide the splash screen once fonts are loaded or if there's an error
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return { fontsLoaded: loaded, fontError: error };
}