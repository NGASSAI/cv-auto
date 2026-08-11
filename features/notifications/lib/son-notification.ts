/**
 * Joue un petit bip via l'API Web Audio du navigateur —
 * pas de fichier audio à héberger, fonctionne partout.
 */
export function jouerSonNotification() {
  try {
    const AudioContextClasse =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const contexte = new AudioContextClasse();

    const oscillateur = contexte.createOscillator();
    const gain = contexte.createGain();

    oscillateur.type = "sine";
    oscillateur.frequency.setValueAtTime(880, contexte.currentTime);
    oscillateur.frequency.setValueAtTime(660, contexte.currentTime + 0.1);

    gain.gain.setValueAtTime(0.15, contexte.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, contexte.currentTime + 0.3);

    oscillateur.connect(gain);
    gain.connect(contexte.destination);

    oscillateur.start(contexte.currentTime);
    oscillateur.stop(contexte.currentTime + 0.3);
  } catch {
    // Certains navigateurs bloquent l'audio sans interaction préalable —
    // on échoue silencieusement, ce n'est pas une fonctionnalité critique.
  }
}