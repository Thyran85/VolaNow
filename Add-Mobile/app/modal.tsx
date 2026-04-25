import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'; // On revient à expo-camera
import { Ionicons } from '@expo/vector-icons';

export default function SmartScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [detectedOp, setDetectedOp] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simulation d'IA sur une capture d'image
  const analyzeCard = () => {
    setLoading(true);
    
    // Ici, on simule que l'IA a scanné l'image et trouvé des mots-clés
    // Dans une étape suivante, on connectera ML Kit pour le faire réellement
    setTimeout(() => {
        // Simulation : L'IA détecte "Orange" sur la carte
        setDetectedOp({
            name: 'Orange',
            color: '#FF7900',
            prefix: '*141*',
            logo: require('../assets/images/logo/orange_logo.png')
        });
        setLoading(false);
    }, 2000);
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return <TouchableOpacity onPress={requestPermission}><Text>Autoriser</Text></TouchableOpacity>;
  }

  return (
    <View style={styles.container}>
      {/* CameraView ne fera pas planter votre navigateur */}
      <CameraView style={StyleSheet.absoluteFill} facing="back" />

      <View style={styles.overlay}>
        <View style={[styles.frame, { borderColor: detectedOp ? detectedOp.color : '#FFF' }]}>
          {detectedOp && (
            <Image source={detectedOp.logo} style={styles.miniLogo} />
          )}
        </View>
        
        <Text style={styles.aiStatus}>
          {loading ? "IA : Analyse de l'opérateur..." : 
           detectedOp ? `Carte ${detectedOp.name} détectée !` : 
           "Présentez une carte Telma, Orange ou Airtel"}
        </Text>
      </View>

      <View style={styles.footer}>
        {!detectedOp ? (
            <TouchableOpacity style={styles.btnScan} onPress={analyzeCard}>
                <Text style={styles.btnText}>DÉTECTER LA CARTE</Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity 
                style={[styles.btnRedeem, { backgroundColor: detectedOp.color }]}
                onPress={() => Linking.openURL(`tel:${encodeURIComponent(detectedOp.prefix + "12345678901234#")}`)}
            >
                <Text style={styles.btnText}>RECHARGER MAINTENANT</Text>
            </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  frame: { width: 300, height: 160, borderWidth: 3, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  miniLogo: { width: 50, height: 50, position: 'absolute', top: -25, backgroundColor: '#FFF', borderRadius: 10 },
  aiStatus: { color: '#FFF', marginTop: 25, fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
  footer: { position: 'absolute', bottom: 50, width: '100%', paddingHorizontal: 30 },
  btnScan: { backgroundColor: '#CCFF00', padding: 20, borderRadius: 20, alignItems: 'center' },
  btnRedeem: { padding: 20, borderRadius: 20, alignItems: 'center' },
  btnText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});