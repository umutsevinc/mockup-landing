# Vidéos à enregistrer — placeholders de la home

Dépose chaque fichier `.mp4` ici avec le nom EXACT ci-dessous : la tuile
placeholder correspondante se remplace automatiquement (aucun code à toucher).

Spécs communes (pattern Dropshot) : H.264 MP4, muet, boucle propre
(première ≈ dernière frame), 5–12 s, ~1200px de large max, < 3 Mo si possible
(`ffmpeg -i in.mov -vf scale=1200:-2 -c:v libx264 -crf 26 -preset slow -an out.mp4`).

## How it works — 3 vidéos VERTICALES (ratio 3:4)

| Fichier | Contenu à capturer |
|---|---|
| `step-1-drop.mp4` | Glisser un screenshot sur le canvas du plugin → auto-fit sur l'écran de l'iPhone. |
| `step-2-pose.mp4` | Orbite caméra + changement de couleur du device + swap HDRI dans le panneau. |
| `step-3-ship.mp4` | Clic export 4K, puis le composant embed collé sur une page Framer publiée. |

## Features — 6 vidéos HORIZONTALES (ratio 4:3)

| Fichier | Contenu à capturer |
|---|---|
| `feature-follow-cursor.mp4` | Le device qui suit la souris sur une landing publiée. |
| `feature-orbit.mp4` | Orbite libre à la souris, puis orbite auto lente. |
| `feature-float.mp4` | Device en lévitation lente sur fond sombre (hero-like). |
| `feature-scroll.mp4` | Scroll d'une landing, le device tourne en rythme. |
| `feature-live-embed.mp4` | Copier le composant embed → coller sur un site publié → interagir avec la scène. |
| `feature-video-screens.mp4` | Une vidéo (chat samurai 🐱) qui joue sur l'écran du device pendant une orbite. |

## Changelog — médias des releases (dans `/public/changelog/`)

| Fichier | Contenu |
|---|---|
| `changelog/1.4-device-cards.mp4` | Scroll du carousel de la device library (cartes blanches), ratio 16:10. |
