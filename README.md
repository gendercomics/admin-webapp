# gendercomics-admin-webapp

## URLs
### production: https://gendercomics.net/admin/
![build status master branch](https://github.com/gendercomics/admin-webapp/actions/workflows/docker-image-production.yml/badge.svg?branch=master)
### stage: https://stage.gendercomics.net/admin/
![build status master branch](https://github.com/gendercomics/admin-webapp/actions/workflows/docker-image-stage.yml/badge.svg?branch=develop)

## Release Notes
---
### gendercomics-admin-webapp-1.16.1
- FIX: "IN" im Comic-Form prüft leere Einträge und funktioniert dadurch wieder
---

### gendercomics-admin-webapp-1.16.0
- NEU: Keywords im "NEW" Dropdown im Header
---

### gendercomics-admin-webapp-1.15.2
- FIX: Fehler (leere Auswahlfelder) beim Relationen

---

### gendercomics-admin-webapp-1.15.1
- FIX: Fehler (kein Auswahlfeld) beim Hinzufügen eines Publishers behoben

---

### gendercomics-admin-webapp-1.15.0
- NEU: Predicates zur Definition des Attributs der Relationen
- Relationen können mittels Predicates in Beziehung gesetzt werden
- Roles und Predicates in die Menügruppe "more" verschoben
- Bekannte Einschränkungen:
  - Aktualisierungsdatum bei Predicates wird erst nach erneutem Laden angezeigt
  - Neu angelegte Predicates werden erst nach erneutem Laden der Seite angezeigt

---

### gendercomics-admin-webapp-1.14.0
#### Comic Liste
- Zwei Such-Modi: Browse & Search
  - Browse = Datenbanksymbol, Funktion wie bisher
  - Search = Lupensymbol, Suche wird bei Eingabe eines Suchbegriffs aktiviert
  - Suchmodus ist Standardverhalten, die Suche wird nicht mehr automatisch bei Aufruf der Seite durchgeführt
  - Der Modus wird mit Klick auf den Button vor dem Suchschlitz umgeschaltet
- Suchbegriff wird gespeichert (pro Session bis zum Schließen der Anwendung)
- Filtereinstellungen werden gespeichert (pro Session bis zum Schließen der Anwendung)
- Bei Rückkehr aus der Comic-Detailansicht wird die gespeicherte Suche wieder ausgeführt (mit allen Filtereinstellungen)
  - _Known Issue_: Man landet derzeit immer auf Seite 1 des Suchergebnisses 

---

### gendercomics-admin-webapp-1.13.0
#### Alle Listen
-   Lade-Spinner für alle Listen (comics, persons, publishers, roles, keywords)

#### Comic Liste
-   Filterbegriff wird gespeichert (im Browser), bei Rückkehr zur Liste wird der gespeicherte Suchbegriff verwendet

#### Personen Liste
-   Anpassung an aktuelles Look&Feel
-   Abfrage vor dem Löschen eines Eintrags

#### Rollen Liste
-   Abfrage vor dem Löschen eines Eintrags

#### Keyword Liste
-   Anpassung an aktuelles Look&Feel
-   Abfrage vor dem Löschen eines Eintrags

---

### gendercomics-admin-webapp-1.12.0
#### Comic Detailansicht
-   Cover Upload & Cover Download von DNB (falls bei DNB ein Cover-Bild existiert)

---

### gendercomics-admin-webapp-1.11.1
#### Comic Detailansicht
-   Fehler beim Speichern eines Comic behoben

---

### gendercomics-admin-webapp-1.11.0
#### Comic Detailansicht
-   Beim Verlagseintrag kann die Ortsangabe überschrieben werden, wenn ein Ortseintrag vorhanden ist. Das Überschreiben der Ortsangabe wird nur für diesen Comic-Eintrag zugeordnet und nicht beim Verlag gespeichert.

---

### gendercomics-admin-webapp-1.10.0
#### Comic Detailansicht
-   Einem Comic können mehrere Serien zugeordnet werden

---

### gendercomics-admin-webapp-1.9.0
#### Comic Detailansicht
-   Einem Comic können mehrere Hyperlinks zugeordnet werden

---

### gendercomics-admin-webapp-1.8.0
#### Rollen-Liste
-   Layout Update (Link von Rollenname zu Detailansicht, Edit-Button entfernt, Delete-Button an letzte Stelle in der Tabelle verschoben, Sicherheitsabfrage beim Löschen)

#### Rollen Detailansicht
-   WYSIWYG-Beschreibungs-Editor

---

### gendercomics-admin-webapp-1.7.0
#### Comic Detailansicht
-   Einem Comic können mehrere Publisher zugewiesen werden
-   Einem Creator können mehrere Rollen zugewiesen werden

---

### gendercomics-admin-webapp-1.6.0
#### Comic Liste
-   Anzeige und Filterung von Serien & Reihen (inkludiert Titel-Spalte)
-   Serie wird als Link vor dem Titel angezeigt
-   "in" Spalte entfernt
-   "in" wird unter Titel/Subtitel als Link angezeigt

---

### gendercomics-admin-webapp-1.5.0
#### Comic Liste
-   Edit-Button durch Link in Titel ersetzt
-   Delete-Button ans Ende der Zeile verschoben
-   Untertitel werden unterhalb des Titels angezeigt
-   Neue Spalte: "type" = comic_type: C=comic, A=anthology, W=webcomic, S=comic_series, R=publishing_series (Reihe), M=magazine
-   Bestätigungsdialog beim Löschen eines Comic
-   Styling-Update für Filter/Pagination
-   Zusätzliche Filtermöglichkeit nach Comic-Typ

#### Comic Detailansicht
-   issue: Ergänzt um zweites Feld "issue title"
-   issue: Hinzufügen fügt beide Felder ("issue" und "issue titel") zum comic hinzu, jedes Feld kann einzeln gelöscht werden
-   printer: Neues Feld für Druckerei (nur verfügbar, wenn das Feld "publisher" nicht vorhanden ist)
-   link: Zusätzliches Datumsfeld (last access), wird mit dem aktuellen Datum vorbelegt
-   link: Bereits vorhandene Link-Einträge werden ohne Datumsfeld angezeigt. Wenn ein Datumsfeld dazugefügt werden soll, muss der Eintrag gelöscht und neu angelegt werden.
-   series: Durchsuchbares Auswahlfeld für Serien-Titel (comic_series & publishing_series) und Text-Feld "volume".
-   in: Durchsuchbares Auswahlfeld für Anthologien und Magazine
-   pages: Feld und Button sind nur verfügbar wenn "in" hinzugefügt wurde.
-   Buttons werden je nach comic_type eingeblendet

---

### gendercomics-admin-webapp-1.4.2
#### Comic Liste
-   Button "new comic" in Header-Dropdown verschoben
-   Neue Filter-Möglichkeit nach Status (kombinierbar mit Textfilter)
-   Neue Spalte "publisher" (filterbar über Textfilter)


-   Header Zeile mit Comic-Titel entfernt (redundante Information)
-   Type als Auswahlfeld dem Comic-Titel vorangestellt
-   Neuer Type: series
-   Statusauswahl und Save-/Back-Button in Titelzeile verschoben (verschwindet sonst unter Kommentaren)
-   Neuer Status: CLARIFICATION

#### Header
-   Comic, Person, Publisher können über neues Dropdown erstellt werden
