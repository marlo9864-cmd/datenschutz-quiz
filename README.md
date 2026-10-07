# Datenschutz-Quiz

Die 21 eingegrenzten Datenschutz-Aufgaben zur LEK (Kapitel 1–3) als Quiz für Handy und PC. Wie in der
Prüfung können mehrere Antworten richtig sein, nach jeder Frage kommen Lösung und Begründung. Das Quiz
läuft komplett im Browser, auch ohne Internet.

**Adresse:** https://marlo9864-cmd.github.io/datenschutz-quiz/

## Funktionen

- Alle 21 Aufgaben mit den Nummern der Übungsblätter: Kapitel 1 Aufgaben 13–17, Kapitel 2 Aufgaben 30–37,
  Kapitel 3 Aufgaben 17–24
- Mehrfachauswahl wie in der LEK: Eine Aufgabe zählt nur, wenn alle Kreuze stimmen
- Nach jeder Frage: richtige, falsche und vergessene Kreuze, dazu die Begründung mit Rechtsgrundlage
- Auswahl: alle Kapitel, ein einzelnes Kapitel oder nur die Fehler aus dem letzten Durchgang;
  Reihenfolge auf Wunsch gemischt
- Auswertung je Kapitel und „Fehler wiederholen“
- Lösungen durchblättern, Merkzettel mit Fristen, Begriffen und Verwechslungsgefahren
- PDF mit Fragen und Lösungsblatt zum Ausdrucken
- Der Fortschritt bleibt erhalten, auch wenn die App zwischendurch geschlossen wird

## Auf dem iPhone installieren (ohne App Store)

1. Adresse in **Safari** öffnen.
2. Unten auf **Teilen** (Quadrat mit Pfeil) tippen → **„Zum Home-Bildschirm“** → **Hinzufügen**.
3. Das Quiz startet vom Home-Bildschirm im Vollbild und funktioniert **auch ohne Internet**.

Auf Android: Menü → „App installieren“ bzw. „Zum Startbildschirm hinzufügen“.

## Daten

Der Fortschritt liegt nur im Browser-Speicher (localStorage) des jeweiligen Geräts – kein Server, keine
Anmeldung, kein Tracking. Handy und PC haben deshalb jeweils einen eigenen Stand. Die Schriften liegen
im Repository; die Seite lädt nichts von Google Fonts oder anderen fremden Servern.

## Offline und Updates

Beim ersten Besuch legt der Service Worker (`web/sw.js`) alle Dateien im Gerätespeicher ab. Mit Internet
holt das Quiz immer die aktuelle Version, ohne Internet die gespeicherte. Änderungen sind nach dem
Veröffentlichen also beim nächsten Öffnen da.

## Fragen ändern oder ergänzen

Alle Inhalte stehen in **`web/js/fragen.js`**: Fragen, Antworten, Lösung, Begründung und Merkzettel.
Am Anfang der Datei ist jedes Feld erklärt. Wichtig:

- `loesung` enthält die Nummern der anzukreuzenden Antworten (1 = A, 2 = B, …).
- `negativ: true` bedeutet, dass nach der falschen Aussage gefragt ist. Dann stehen in `loesung` die
  falschen Aussagen.
- Signalwörter wie „falsch“ oder „nicht“ werden mit `<mark>…</mark>` gelb markiert.

Nach jedem Push prüft der Workflow die Datei (`tests/pruefe-fragen.mjs`) und veröffentlicht nur, wenn
alles stimmt. Lokal geht dieselbe Prüfung mit `node tests/pruefe-fragen.mjs`.

Neue Dateien in `web/` müssen in `web/sw.js` in der Liste `FILES` stehen, damit sie offline verfügbar
sind; danach `VERSION` erhöhen. Die Prüfung meldet, wenn eine Datei fehlt.

**Lokal testen:** `python -m http.server 8000 --directory web`, dann http://localhost:8000/ öffnen.

## Aufbau

```
web/                          wird auf GitHub Pages veröffentlicht
  index.html
  css/quiz.css
  js/fragen.js                Inhalte (Fragen, Lösungen, Begründungen, Merkzettel)
  js/quiz.js                  Quiz-Ablauf, Auswertung, Speichern des Fortschritts
  sw.js                       Offline-Speicher
  manifest.webmanifest        Installation als App
  icons/
  fonts/                      Public Sans, Zilla Slab, IBM Plex Mono (SIL Open Font License)
  Datenschutz_LEK_Fragen_mit_Loesungsblatt.pdf
tests/pruefe-fragen.mjs       Prüfung vor dem Veröffentlichen
.github/workflows/pages.yml   Veröffentlichung bei jedem Push auf main
```

## GitHub einrichten (einmalig)

Unter *Settings → Pages* als Source **„GitHub Actions“** wählen. Danach veröffentlicht jeder Push auf
`main` das Quiz automatisch; der Reiter **Actions** zeigt den Fortschritt. Schlägt der allererste Lauf
fehl, weil Pages noch nicht eingeschaltet war: Pages einschalten und im Reiter Actions den Lauf mit
„Re-run all jobs“ wiederholen.

## Quelle

LEK-Eingrenzung sowie Übungen und Lösungen zu Kapitel 1–3 (Datenschutz). Die Lösungen sind mit den
farbigen Markierungen der Lösungsblätter abgeglichen.
