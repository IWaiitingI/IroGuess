# IroGuess - Multijoueur

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Jouer en ligne
**Lien du jeu :** [https://iroguess.vercel.app](https://iro-guess.vercel.app/))

---

## Concept & Modes de Jeu
IroGuess est un jeu de précision chromatique en temps réel (inspiré entre autres de dialed.gg). Les joueurs s'affrontent sur 5 manches pour obtenir le meilleur score. Le jeu sélectionne aléatoirement un mode à chaque round :

* **Classic Mode ** : Mémorisez la couleur et reproduisez-la. Points basés sur la précision.
* **Sudden death ** : Seul le joueur le plus proche gagne les points de la manche.
* **Bomb's Ticking ** : Temps réduit à 5 secondes pour répondre.
* **Who's Next ? ** : Analysez une suite logique de 3 couleurs et devinez la 4ème.

---

## État du Projet

### Fonctionnalités implémentées
* **Multijoueur Temps Réel** : Propulsé par PartyKit.
* **Calcul de Score Sévère** : Formule cubique $(1 - diff)^3$ qui récompense uniquement la haute précision.
* **Review Phase** : Comparaison visuelle de tous les joueurs à la fin de chaque manche.
* **Algorithme Logique** : Génération de suites HSL cohérentes (Teinte, Saturation ou Luminosité).

### En cours / À faire
* **Streak Bonus** : Multiplicateur de points pour les joueurs réguliers.
* **Ambiance Sonore** : Tic-tac pour le mode bombe et feedback sonore de validation.
* **Mode Blind** : Sliders gris sans repères visuels pour la phase de sélection.
* **Interractions et animations** : Célébration visuelle pour le gagnant final, transition et design de l'UI.

---

## Développement

Une fois le projet cloné, installez les dépendances :

```sh
# Dans le dossier my-game (Frontend)
npm install
npm run dev

# Dans le dossier my-game-party (Serveur)
npm install
npx partykit dev
