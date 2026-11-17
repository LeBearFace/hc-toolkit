# Tests hors ligne (Playwright)

`node tests/smoke.js $PWD/index.html` : les vues démarrent sans erreur JS.
`node tests/atelier.js $PWD/index.html` : interactions de l'Atelier.
`node tests/header.js $PWD/index.html` : la barre du haut tient dans l'écran (560 à 1500 px).

Les vrais prix se testent dans le navigateur intégré sur /test/ (le conteneur ne joint pas le wiki).
