# Modern Studio Perauer – einfache Deploy-Version

## Was ist das?
Eine fertige React/Vite-Website, die du sehr einfach über GitHub + Vercel online stellen kannst.

## Schnellstart lokal
```bash
npm install
npm run dev
```

## Für Vercel
1. Ordner als neues GitHub-Repository hochladen
2. In Vercel einloggen
3. "Add New Project" klicken
4. Repository auswählen
5. Deploy klicken

## Domain verbinden
Danach in Vercel:
- Project → Settings → Domains
- modernstudioperauer.at hinzufügen
- www.modernstudioperauer.at hinzufügen

Vercel zeigt dir dann die DNS-Einträge.
Diese trägst du bei helloly unter DNS-Verwaltung ein.

## Später anpassen
Wichtige Datei:
- `src/App.jsx`

## Bilder ersetzen
Derzeit sind Platzhalterbilder von Unsplash eingebunden.
Später kannst du echte Bilder in den `public`-Ordner legen und in `src/App.jsx` referenzieren.

Neue Version:
- Google-Maps-Einbettung
- Live-Verfügbarkeitskalender via /api/availability
- überarbeitete Texte auf Basis deiner Inserate


v4:
- echte Fotos eingebunden
- Galerie sinnvoll gruppiert
- Hausregeln integriert
- WhatsApp-Button ergänzt
- stärkere mobile Darstellung
- hochwertigeres Homepage-Layout
