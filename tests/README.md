# Tests hors ligne (Playwright)

`node tests/smoke.js $PWD/index.html` : les vues démarrent sans erreur JS.
`node tests/atelier.js $PWD/index.html` : interactions de l'Atelier.
`node tests/equip.js $PWD/test/index.html equipment.json monsters.json fixture-prix.json` : module Équipement (formules, plan, mannequin en grille) avec les stats du calculateur DPS du wiki et des prix fictifs.
`node tests/guides.js $PWD/test/index.html` : module 📚 Guides (cases, filtres, création, coches WikiSync, nœuds bloqués, 560 px).
`node tests/header.js $PWD/index.html` : la barre du haut tient dans l'écran (560 à 1500 px).

Les vrais prix se testent dans le navigateur intégré sur /test/ (le conteneur ne joint pas le wiki).
`node tests/boss.js $PWD/test/index.html` : 🎯 simulateurs de boss (ticks, fenêtre de prière, Jad, 3 Jads, Hunllef, Zuk, records, clavier, 😴 AFK, ?afk=1, 560 px).
`node tests/futur.js $PWD/test/index.html` : 🔮 Le futur avec des séries fictives (marche au hasard, cycle horaire, tendance, écart HC/normal plafonné, trous, 7 jours, scanner, 560 px).
`node tests/portfolio.js $PWD/test/index.html` : 💼 Mon portefeuille (saisie avec prix pré-rempli, FIFO, taxe GE, import Flipping Utilities au format Gson réel, import banque, alertes silencieuses et seuil en gp, graphique, 2 clics pour supprimer, autre monde en N/A, 560 px).
`node tests/empire.js $PWD/test/index.html [dossier flipping-utilities]` : 🏦 Mon empire (import du dossier, FIFO multi-persos, tests de marché masqués, ventes PNJ, chronos, « Pack vendu » de la Vitrine, 560 px ; avec un vrai dossier : totaux et sauvegarde).
`node tests/v21.js $PWD/test/index.html [dossier data-exports]` : 2.1 — menu en espaces (un seul ouvert, icônes), banques/compétences/quêtes Data Export (dernier export par perso, meilleure sortie GE/alch/PNJ), courbe + cohérence avec le plugin dans Mon empire, 🎯 Pics répétés (Must/Watch/Oddities), 560 et 1280 px.
`node tests/v22.js $PWD/test/index.html` : 2.2 — 🧭 plan de sortie de Mon empire (PNJ avec mondes, alch, transformer, GE, N/A) et 🧮 XP en banque (réalisable, en achetant, persos qui en profitent), 560 px.
