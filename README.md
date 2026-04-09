# 🎨 IroGuess - Multijoueur

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## 🚀 Jouer en ligne
**Lien du jeu :** [https://iroguess.vercel.app](https://iro-guess.vercel.app/)) *(À mettre à jour avec ton URL Vercel)*

---

## 🎮 Concept & Modes de Jeu
IroGuess est un jeu de précision chromatique en temps réel. Les joueurs s'affrontent sur 5 manches pour obtenir le meilleur score. Le jeu sélectionne aléatoirement un mode à chaque round :

* **Mode Classique (60%)** : Mémorisez la couleur et reproduisez-la. Points basés sur la précision.
* **⚠️ Mort Subite (20%)** : Seul le joueur le plus proche gagne les points de la manche.
* **💣 Bomb's Ticking (10%)** : Temps réduit à 5 secondes pour répondre. Stress maximum.
* **🧠 Who's Next ? (10%)** : Analysez une suite logique de 3 couleurs et devinez la 4ème.

---

## 🛠️ État du Projet

### ✅ Fonctionnalités implémentées
* **Multijoueur Temps Réel** : Propulsé par PartyKit.
* **Calcul de Score Sévère** : Formule cubique $(1 - diff)^3$ qui récompense uniquement la haute précision.
* **Review Phase** : Comparaison visuelle de tous les joueurs à la fin de chaque manche.
* **Algorithme Logique** : Génération de suites HSL cohérentes (Teinte, Saturation ou Luminosité).
* **Responsive Design** : Interface sombre et minimaliste optimisée.

### ⏳ En cours / À faire
* **Streak Bonus** : Multiplicateur de points pour les joueurs réguliers.
* **Ambiance Sonore** : Tic-tac pour le mode bombe et feedback sonore de validation.
* **Mode Blind** : Sliders gris sans repères visuels pour la phase de sélection.
* **Confettis** : Célébration visuelle pour le gagnant final.

---

## 💻 Développement

Une fois le projet cloné, installez les dépendances :

```sh
# Dans le dossier my-game (Frontend)
npm install
npm run dev

# Dans le dossier my-game-party (Serveur)
npm install
npx partykit dev
