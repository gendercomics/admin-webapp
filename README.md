# gendercomics-admin-webapp

## URLs
### production: https://gendercomics.net/admin/ [![Build Status](https://travis-ci.com/gendercomics/admin-webapp.svg?branch=master)](https://travis-ci.com/gendercomics/admin-webapp)
### stage: https://stage.gendercomics.net/admin/ [![Build Status](https://travis-ci.com/gendercomics/admin-webapp.svg?branch=master)](https://travis-ci.com/gendercomics/admin-webapp)

## Release Notes

---
### gendercomics-admin-webapp-1.6.0-SNAPSHOT

#### Comic Liste
- TODO


---
### gendercomics-admin-webapp-1.5.0-SNAPSHOT

#### Comic Liste
- Edit-Button durch Link in Titel ersetzt
- Delete-Button ans Ende der Zeile verschoben
- Untertitel werden unterhalb des Titels angezeigt
- Neue Spalte: "type" = comic_type: C=comic, A=anthology, W=webcomic, S=comic_series, R=publishing_series (Reihe), M=magazine

#### Comic Detailansicht
- issue: Ergänzt um zweites Feld "issue title"
- issue: Hinzufügen fügt beide Felder ("issue" und "issue titel") zum comic hinzu, jedes Feld kann einzeln gelöscht werden
- printer: Neues Feld für Druckerei (nur verfügbar, wenn das Feld "publisher" nicht vorhanden ist)
- link: Zusätzliches Datumsfeld (last access), wird mit dem aktuellen Datum vorbelegt
- link: Bereits vorhandene Link-Einträge werden ohne Datumsfeld angezeigt. Wenn ein Datumsfeld dazugefügt werden soll, muss der Eintrag gelöscht und neu angelegt werden.
- series: Durchsuchbares Auswahlfeld für Serien-Titel (comic_series & publishing_series) und Text-Feld "volume".
- in: Durchsuchbares Auswahlfeld für Anthologien und Magazine
- pages: Feld und Button sind nur verfügbar wenn "in" hinzugefügt wurde.
- Buttons werden je nach comic_type eingeblendet

---
### gendercomics-admin-webapp-1.4.2

#### Comic Liste
- Button "new comic" in Header-Dropdown verschoben
- Neue Filter-Möglichkeit nach Status (kombinierbar mit Textfilter)
- Neue Spalte "publisher" (filterbar über Textfilter)

#### Comic Detailansicht
- Header Zeile mit Comic-Titel entfernt (redundante Information)
- Type als Auswahlfeld dem Comic-Titel vorangestellt
- Neuer Type: series
- Statusauswahl und Save-/Back-Button in Titelzeile verschoben (verschwindet sonst unter Kommentaren)
- Neuer Status: CLARIFICATION

#### Header
- Comic, Person, Publisher können über neues Dropdown erstellt werden
