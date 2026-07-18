# Vidéos à enregistrer — placeholders de la home

Dépose chaque fichier `.mp4` ici avec le nom EXACT ci-dessous : la tuile
placeholder correspondante se remplace automatiquement (aucun code à toucher).

Spécs communes (pattern Dropshot) : H.264 MP4, muet, boucle propre
(première ≈ dernière frame), 5–12 s, ~1200px de large max, < 3 Mo si possible
(`ffmpeg -i in.mov -vf scale=1200:-2 -c:v libx264 -crf 26 -preset slow -an out.mp4`).

## How it works — 3 vidéos VERTICALES (ratio 3:4)

| Fichier | Contenu à capturer |
|---|---|
| `step-1-drop.mp4` | Filmer FRAMER : glisser une image directement sur le mockup dans le canvas du plugin → auto-fit sur l'écran. |
| `step-2-pose.mp4` | Filmer les RÉGLAGES : panneau Light (intensité/position), Content position, Texture (couleur/finish). |
| `step-3-ship.mp4` | Filmer les OPTIONS D'EXPORT photo & vidéo (qualité, format), puis le clic export. |

## Features — 6 vidéos HORIZONTALES (ratio 4:3)

| Fichier | Contenu à capturer |
|---|---|
| `feature-follow-cursor.mp4` | ✅ FAIT (headless embed, contenu abstrait). |
| `feature-orbit.mp4` | ✅ FAIT (headless embed, contenu abstrait). |
| `feature-float.mp4` | ✅ FAIT (headless embed, contenu abstrait). |
| `feature-live-embed.mp4` | Filmer PLUGIN + CANVAS FRAMER : clic « Add to Framer » → le composant 3D apparaît sur le canvas. |
| `feature-video-screens.mp4` | ✅ FAIT (headless embed, chat samouraï). |

## Changelog — médias des releases (dans `/public/changelog/`)

| Fichier | Contenu |
|---|---|
| `changelog/1.4-device-cards.mp4` | Scroll du carousel de la device library (cartes blanches), ratio 16:10. |
