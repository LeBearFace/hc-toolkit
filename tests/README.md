# Tests hors ligne (Playwright)

`node tests/smoke.js $PWD/index.html` : les vues démarrent sans erreur JS.
`node tests/atelier.js $PWD/index.html` : interactions de l'Atelier.
`node tests/equip.js $PWD/test/index.html equipment.json monsters.json fixture-prix.json` : module Équipement (formules, plan, mannequin en grille) avec les stats du calculateur DPS du wiki et des prix fictifs.
`node tests/guides.js $PWD/test/index.html` : module 📚 Guides (cases, filtres, création, coches WikiSync, nœuds bloqués, 560 px).
`node tests/header.js $PWD/index.html` : la barre du haut tient dans l'écran (560 à 1500 px).

Les vrais prix se testent dans le navigateur intégré sur /test/ (le conteneur ne joint pas le wiki).
`node tests/boss.js $PWD/test/index.html` : 🎯 simulateurs de boss (ticks, fenêtre de prière, Jad, 3 Jads, Hunllef, Zuk, records, clavier, 😴 AFK, ?afk=1, 560 px).
`node tests/futur.js $PWD/test/index.html` : 🔮 Le futur avec des séries fictives (marche au hasard, cycle horaire, tendance, écart HC/normal plafonné, trous, 7 jours, scanner, 560 px).
