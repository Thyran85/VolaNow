import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, Image, 
  Linking, StatusBar, ActivityIndicator, useWindowDimensions, Platform 
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router'; 
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

const OPERATORS = {
  telma: { name: 'Telma / Yas', color: '#FFD700', prefix: '*321*', logo: require('../assets/images/logo/yas_logo.png') },
  orange: { name: 'Orange', color: '#FF7900', prefix: '*141*', logo: require('../assets/images/logo/orange_logo.png') },
  airtel: { name: 'Airtel', color: '#E11900', prefix: '*130*', logo: require('../assets/images/logo/airtel_logo.png') }
};

export default function SmartScanner() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [permission, requestPermission] = useCameraPermissions();
  const [detectedOp, setDetectedOp] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Calcul dynamique du cadre de scan
  const FRAME_WIDTH = width * 0.75; 
  const FRAME_HEIGHT = FRAME_WIDTH * 0.58;

  useEffect(() => { if (!permission) requestPermission(); }, [permission]);

  const runAIAnalysis = (type: 'telma' | 'orange' | 'airtel') => {
    setLoading(true);
    setTimeout(() => {
      setDetectedOp(OPERATORS[type]);
      setLoading(false);
    }, 1500);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return alert("Permission requise");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      runAIAnalysis('telma'); 
    }
  };

  if (!permission || !permission.granted) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* 1. ARRIÈRE-PLAN (IMAGE OU CAMÉRA) */}
      <View style={styles.cameraLayer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.fullPreviewImage} resizeMode="cover" />
        ) : (
          <CameraView style={styles.camera} facing="back" />
        )}
      </View>

      {/* 2. COUCHE UI (HEADER + SCAN + FOOTER) */}
      <SafeAreaView style={styles.mainOverlay} edges={['top', 'bottom']}>
        
        {/* HEADER FIXE EN HAUT */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.navButton} onPress={() => imageUri ? setImageUri(null) : router.back()}>
            <Ionicons name={imageUri ? "close" : "arrow-back"} size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SCANNER</Text>
          <View style={{ width: 45 }} />
        </View>

        {/* ZONE DU CADRE (Prend l'espace central) */}
        <View style={styles.scanContainer}>
          <View style={[styles.frame, { width: FRAME_WIDTH, height: FRAME_HEIGHT, borderColor: detectedOp ? detectedOp.color : 'rgba(255,255,255,0.1)' }]}>
            <View style={[styles.corner, styles.cornerTL, { borderColor: detectedOp ? detectedOp.color : '#FFF' }]} />
            <View style={[styles.corner, styles.cornerTR, { borderColor: detectedOp ? detectedOp.color : '#FFF' }]} />
            <View style={[styles.corner, styles.cornerBL, { borderColor: detectedOp ? detectedOp.color : '#FFF' }]} />
            <View style={[styles.corner, styles.cornerBR, { borderColor: detectedOp ? detectedOp.color : '#FFF' }]} />
            
            {detectedOp && (
              <View style={styles.detectedBadge}>
                 <Image source={detectedOp.logo} style={styles.miniLogo} resizeMode="contain" />
                 <Text style={styles.detectedText}>{detectedOp.name}</Text>
              </View>
            )}
          </View>
        </View>

        {/* FOOTER FIXE EN BAS (NE PEUT PAS DÉBORDER) */}
        <View style={styles.footerWrapper}>
          <View style={styles.footerInner}>
            <View style={styles.statusBox}>
              <Text style={styles.label}>ANALYSE</Text>
              <Text style={styles.status} numberOfLines={1}>
                {loading ? "Recherche du code..." : detectedOp ? "Code prêt" : "Placez la carte"}
              </Text>
            </View>
            
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { 
                width: loading ? '70%' : detectedOp ? '100%' : '5%', 
                backgroundColor: detectedOp ? detectedOp.color : '#333' 
              }]} />
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
                <Ionicons name="images-outline" size={26} color="#FFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                  style={[styles.mainButton, { backgroundColor: detectedOp ? detectedOp.color : '#CCFF00' }]} 
                  onPress={() => !detectedOp ? runAIAnalysis('orange') : Linking.openURL('tel:*141*12345#')}
              >
                {loading ? <ActivityIndicator color="#000" size="small" /> : <Ionicons name={detectedOp ? "call" : "scan-outline"} size={22} color="#000" />}
                <Text style={styles.mainButtonText}>{loading ? "" : detectedOp ? "RECHARGER" : "DÉTECTER"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraLayer: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  camera: { flex: 1 },
  fullPreviewImage: { flex: 1 },

  // L'overlay gère la structure complète
  mainOverlay: { flex: 1, zIndex: 1, justifyContent: 'space-between' },

  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  headerTitle: { color: '#FFF', fontSize: 13, fontWeight: '900', letterSpacing: 2 },
  navButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },

  scanContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  frame: { position: 'relative', justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  corner: { position: 'absolute', width: 30, height: 30, borderWidth: 5 },
  cornerTL: { top: -2, left: -2, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 15 },
  cornerTR: { top: -2, right: -2, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 15 },
  cornerBL: { bottom: -2, left: -2, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 15 },
  cornerBR: { bottom: -2, right: -2, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 15 },

  detectedBadge: { backgroundColor: 'rgba(0,0,0,0.8)', padding: 10, borderRadius: 15, alignItems: 'center', flexDirection: 'row', gap: 8 },
  miniLogo: { width: 22, height: 22 },
  detectedText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },

  // Nouveau Footer ultra-sécurisé
  footerWrapper: {
    backgroundColor: '#0D0D0D',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderTopWidth: 1,
    borderColor: '#222',
    paddingBottom: Platform.OS === 'android' ? 20 : 0, // Ajout de marge pour les boutons Android
  },
  footerInner: {
    padding: 25,
  },
  statusBox: { marginBottom: 12 },
  label: { color: '#444', fontSize: 9, fontWeight: '900', marginBottom: 4 },
  status: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  progressBg: { height: 2, backgroundColor: '#1A1A1A', borderRadius: 2, marginBottom: 25 },
  progressFill: { height: 2, borderRadius: 2 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  galleryButton: { width: 60, height: 60, backgroundColor: '#1A1A1A', borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  mainButton: { flex: 1, height: 60, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  mainButtonText: { color: '#000', fontWeight: '900', fontSize: 14 }
});