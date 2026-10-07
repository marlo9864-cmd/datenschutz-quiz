// Inhalte des Datenschutz-Quiz: die 21 eingegrenzten LEK-Aufgaben aus Kapitel 1–3.
// Die Lösungen sind mit den Lösungsblättern zu Kapitel 1–3 abgeglichen.
//
// Aufbau einer Aufgabe:
//   nr           Aufgabennummer wie auf dem Übungsblatt
//   sachverhalt  (optional) Absätze vor der eigentlichen Frage, normal gesetzt
//   frage        die Frage selbst (fett)
//   antworten    Antwortmöglichkeiten in der Reihenfolge A, B, C, …
//   loesung      Nummern der anzukreuzenden Antworten: 1 = A, 2 = B, 3 = C, …
//   negativ      true, wenn nach der falschen bzw. nicht zutreffenden Aussage gefragt ist –
//                dann sind in "loesung" die falschen Aussagen eingetragen
//   begruendung  Erklärung, die nach dem Prüfen angezeigt wird
//
// Erlaubte Auszeichnungen in den Texten: <b>fett</b>, <mark>Signalwort</mark> (gelb markiert).
// Vor dem Veröffentlichen prüft tests/pruefe-fragen.mjs diese Datei.

globalThis.QUIZ_DATA = {
  "titel": "Datenschutz-Quiz",
  "pdf": "Datenschutz_LEK_Fragen_mit_Loesungsblatt.pdf",
  "kapitel": [
    {
      "nr": 1,
      "titel": "Was ist Datenschutz?",
      "bereich": "Aufgaben 13–17",
      "fragen": [
        {
          "nr": 13,
          "frage": "Welche der folgenden Aussagen ist <mark>falsch</mark>?",
          "antworten": [
            "Die DSGVO beschäftigt sich überwiegend mit Datenschutz, enthält aber auch Vorschriften zur Datensicherheit.",
            "Beim Datenschutz geht es um die Grundrechte und Grundfreiheiten von natürlichen Personen.",
            "Datensicherheit beschäftigt sich überwiegend mit dem Schutz von Geschäftsgeheimnissen.",
            "Die Schnittmenge von Datenschutz und Datensicherheit sind die sogenannten technisch organisatorischen Maßnahmen (TOM)."
          ],
          "loesung": [3],
          "negativ": true,
          "begruendung": "Gesucht ist die falsche Aussage – das ist C. Datensicherheit schützt <b>alle Daten</b> (personenbezogen oder nicht) vor Verlust, Manipulation und unberechtigter Kenntnisnahme, also Vertraulichkeit, Integrität und Verfügbarkeit; Geschäftsgeheimnisse sind nur ein Teil davon. A, B und D stimmen: Die DSGVO regelt in <b>Art. 32 DSGVO</b> auch die Sicherheit der Verarbeitung, sie schützt die Grundrechte und Grundfreiheiten natürlicher Personen (<b>Art. 1 Abs. 2 DSGVO</b>), und die <b>TOM</b> bilden die Schnittmenge beider Bereiche."
        },
        {
          "nr": 14,
          "frage": "Welche beiden Aussagen zu den gesetzlichen Grundlagen des Datenschutzes sind korrekt?",
          "antworten": [
            "Die DSGVO gilt ausschließlich für Unternehmen, nicht für die öffentlichen Stellen des Bundes.",
            "Die DSGVO gilt als europäisches Recht in jedem Mitgliedsland der EU. Die nationalen Parlamente (in Deutschland der Bundestag) mussten der DSGVO nicht zustimmen.",
            "In Deutschland enthalten neben dem BDSG und der DSGVO noch zahlreiche weitere Gesetze Vorschriften zum Datenschutz.",
            "Das Bundesdatenschutzgesetz gilt ausschließlich für öffentliche Stellen."
          ],
          "loesung": [2, 3],
          "negativ": false,
          "begruendung": "Die DSGVO ist eine EU-<b>Verordnung</b> und gilt nach <b>Art. 288 AEUV</b> unmittelbar in allen Mitgliedstaaten – anders als eine Richtlinie braucht sie kein Umsetzungsgesetz und keine Zustimmung des Bundestags. Datenschutzregeln stehen außerdem in vielen weiteren Gesetzen, z. B. im <b>TDDDG</b>, im Sozialgesetzbuch oder im Kunsturhebergesetz. Falsch sind A und D: Die DSGVO gilt auch für Behörden, und das BDSG gilt für öffentliche <b>und</b> nichtöffentliche Stellen (<b>§ 1 Abs. 1 BDSG</b>)."
        },
        {
          "nr": 15,
          "sachverhalt": [
            "Ein kanadischer Konzern möchte seine Produkte online in Ländern des Europäischen Wirtschaftsraumes (EWR) anbieten. Er lässt dazu Onlineshops in Englisch, Deutsch und Französisch entwickeln, welche in einem Rechenzentrum in Südafrika gehostet sind."
          ],
          "frage": "Welche Aussage in Bezug auf den Datenschutz ist richtig?",
          "antworten": [
            "Die Regeln der DSGVO müssen nicht beachtet werden, da der Sitz des Unternehmens in Kanada liegt und der Online-Shop über Südafrika läuft.",
            "Da der Konzern seinen Sitz in Kanada hat, müssen die kanadischen Datenschutzgesetze beachtet werden, die DSGVO muss daher nicht einbezogen werden.",
            "Da der Onlineshop sich an Kunden (betroffene Personen) in Europa richtet, müssen alle Vorgaben der DSGVO beachtet werden."
          ],
          "loesung": [3],
          "negativ": false,
          "begruendung": "<b>Marktortprinzip (Art. 3 Abs. 2 lit. a DSGVO)</b>: Die DSGVO gilt auch für Unternehmen ohne Sitz in der EU, wenn sie Personen in der EU Waren oder Dienstleistungen anbieten – hier erkennbar an den Shops auf Deutsch und Französisch für den EWR (über das EWR-Abkommen gilt die DSGVO auch in Norwegen, Island und Liechtenstein). Firmensitz in Kanada und Server in Südafrika ändern daran nichts."
        },
        {
          "nr": 16,
          "frage": "Was sind personenbezogene Daten?",
          "antworten": [
            "Nur Daten, die eine identifizierte Person bezeichnen.",
            "Ausschließlich Namen, Adresse und Kontaktdaten, da diese Daten die Person direkt bezeichnen.",
            "Alle Daten, die ständig verfügbar sein müssen und eine natürliche Person betreffen.",
            "Alle Daten, von denen man direkt oder indirekt eine natürliche Person ermitteln kann."
          ],
          "loesung": [4],
          "negativ": false,
          "begruendung": "Definition in <b>Art. 4 Nr. 1 DSGVO</b>: alle Informationen, die sich auf eine <b>identifizierte oder identifizierbare</b> natürliche Person beziehen. Identifizierbar ist, wer <b>direkt oder indirekt</b> bestimmt werden kann, z. B. über eine Kennnummer, Standortdaten oder eine Online-Kennung wie die IP-Adresse. A und B sind zu eng, C nennt ein Merkmal (ständige Verfügbarkeit), das keine Rolle spielt."
        },
        {
          "nr": 17,
          "frage": "Wer ist bei einer verantwortlichen Stelle immer für die Einhaltung der Datenschutzvorschriften verantwortlich?",
          "antworten": [
            "Der Datenschutzbeauftragte",
            "Der Abteilungsleiter, in dessen Abteilung die Daten verarbeitet werden",
            "Die oberste Leitungsebene"
          ],
          "loesung": [3],
          "negativ": false,
          "begruendung": "Verantwortlich ist die verantwortliche Stelle selbst (<b>Art. 4 Nr. 7, Art. 24 DSGVO</b>) – und damit ihre oberste Leitung (Geschäftsführung, Vorstand, Behördenleitung). Sie trägt die <b>Rechenschaftspflicht</b> (<b>Art. 5 Abs. 2 DSGVO</b>). Der Datenschutzbeauftragte berät und überwacht nur (<b>Art. 39 DSGVO</b>); Abteilungsleiter können Aufgaben übernehmen, die Verantwortung bleibt aber bei der Leitung."
        }
      ]
    },
    {
      "nr": 2,
      "titel": "Grundsätze im Datenschutz",
      "bereich": "Aufgaben 30–37",
      "fragen": [
        {
          "nr": 30,
          "frage": "Welche Risikoansätze werden bei der Verarbeitung personenbezogener Daten nach DSGVO im Vergleich zur allgemeinen IT verfolgt?",
          "antworten": [
            "Es gibt keinen Unterschied, da beide die gleiche Formel zur Berechnung des Risikoausmaßes verwenden.",
            "Der Datenschutz nach DSGVO betrachtet die qualitativen Risiken, denen die Rechte und Freiheiten natürlicher Personen ausgesetzt sind. Diesen Risiken liegen keine direkt quantifizierbaren Werte zugrunde – sie müssen kategorisiert werden.",
            "Die allgemeine IT verfolgt einen quantifizierbaren Ansatz, bei dem die Schadenshöhe und die Eintrittswahrscheinlichkeit zum Einsatz kommen."
          ],
          "loesung": [2, 3],
          "negativ": false,
          "begruendung": "Der Datenschutz bewertet das Risiko <b>für die betroffenen Personen</b> (Rechte und Freiheiten, <b>Art. 24, 32, 35 DSGVO</b>). Schäden wie Diskriminierung, Rufschädigung oder Identitätsdiebstahl lassen sich nicht in Euro beziffern, deshalb wird <b>qualitativ</b> in Kategorien eingestuft (z. B. geringes – normales – hohes Risiko). Die klassische IT-Sicherheit betrachtet das Risiko <b>für das Unternehmen</b> und rechnet <b>quantitativ</b>: Risiko = Schadenshöhe × Eintrittswahrscheinlichkeit. Auch die DSGVO fragt nach Eintrittswahrscheinlichkeit und Schwere (<b>EG 76</b>) – aber aus Sicht der Betroffenen und in Kategorien statt in Euro. A ist deshalb falsch."
        },
        {
          "nr": 31,
          "frage": "Was versteht man im Datenschutz unter einer Schutzbedarfsanalyse?",
          "antworten": [
            "Die Methode, wie alle Informationen im Unternehmen abgesichert werden müssen.",
            "Bildung von Schutzbedarfskategorien aus einer Risikoanalyse über personenbezogene Daten.",
            "Die Beschreibung welche Technisch-Organisatorische Maßnahme zu welchem Risiko passt."
          ],
          "loesung": [2],
          "negativ": false,
          "begruendung": "Aus der Risikoanalyse der Verarbeitung werden <b>Schutzbedarfskategorien</b> gebildet (z. B. normal – hoch – sehr hoch). Nach dem Schutzbedarf richtet sich anschließend, welche TOM nötig sind. A beschreibt die allgemeine Informationssicherheit (alle Informationen), C den nachgelagerten Schritt der Maßnahmenauswahl – nicht die Analyse selbst."
        },
        {
          "nr": 32,
          "frage": "Welche der folgenden Daten zählen <mark>nicht</mark> zu den „Daten besonderer Kategorie“ nach Art. 9 DSGVO wie z. B. Gesundheitsdaten?",
          "antworten": [
            "Bankdaten",
            "Biometrische Daten",
            "Religiöse Überzeugung",
            "Polizeiliches Führungszeugnis"
          ],
          "loesung": [1, 4],
          "negativ": true,
          "begruendung": "Gesucht sind die Daten, die <b>nicht</b> unter Art. 9 fallen: <b>Bankdaten</b> sind „normale“ personenbezogene Daten (wenn auch schutzwürdig), das <b>Führungszeugnis</b> enthält Daten über strafrechtliche Verurteilungen – dafür gilt der eigene <b>Art. 10 DSGVO</b>. Biometrische Daten (zur eindeutigen Identifizierung) und religiöse Überzeugungen stehen ausdrücklich in <b>Art. 9 Abs. 1 DSGVO</b>."
        },
        {
          "nr": 33,
          "frage": "Welche der folgenden Rechte sind <mark>keine</mark> Betroffenenrechte gemäß DSGVO?",
          "antworten": [
            "Recht auf Berichtigung",
            "Recht auf Verschlüsselung",
            "Recht auf Einschränkung der Verarbeitung",
            "Recht auf Anonymisierung"
          ],
          "loesung": [2, 4],
          "negativ": true,
          "begruendung": "Die Betroffenenrechte stehen in <b>Art. 15–22 DSGVO</b> (Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch, keine rein automatisierte Entscheidung), dazu das Beschwerderecht bei der Aufsichtsbehörde (<b>Art. 77</b>). Verschlüsselung und Anonymisierung sind <b>technische Maßnahmen (TOM)</b>, keine Rechte. Berichtigung (<b>Art. 16</b>) und Einschränkung der Verarbeitung (<b>Art. 18</b>) sind dagegen echte Betroffenenrechte."
        },
        {
          "nr": 34,
          "frage": "Welche beiden der folgenden Aussagen sind <mark>falsch</mark>? Das Auskunftsrecht nach DSGVO …",
          "antworten": [
            "… gilt nur gegenüber Behörden, nicht gegenüber Privatunternehmen.",
            "… wird durch die Aufsichtsbehörde ausgeübt.",
            "… schließt das Recht auf eine Kopie der Daten ein.",
            "… kann bei exzessiver Nutzung verweigert werden."
          ],
          "loesung": [1, 2],
          "negativ": true,
          "begruendung": "A ist falsch: Das Auskunftsrecht (<b>Art. 15 DSGVO</b>) gilt gegenüber <b>jedem</b> Verantwortlichen, auch gegenüber Unternehmen. B ist falsch: Die <b>betroffene Person</b> macht es selbst geltend – die Aufsichtsbehörde ist Anlaufstelle für Beschwerden (<b>Art. 77</b>). C stimmt (Kopie der Daten, <b>Art. 15 Abs. 3</b>), D ebenfalls: Bei offenkundig unbegründeten oder exzessiven Anträgen darf der Verantwortliche ein angemessenes Entgelt verlangen oder sich weigern (<b>Art. 12 Abs. 5 DSGVO</b>)."
        },
        {
          "nr": 35,
          "sachverhalt": [
            "Die besonderen Kategorien des Art. 9 DSGVO wie z. B. biometrische Daten bezeichnen besonders schützenswerte personenbezogene Daten und untersagen grundsätzlich die Verarbeitung der bezeichneten Daten/Informationen. Es gibt aber Ausnahmen."
          ],
          "frage": "Welche Aussagen sind richtig?",
          "antworten": [
            "Die Einwilligung der betroffenen Person liegt in rechtsgültiger Form vor.",
            "Die Datenverarbeitung dient dem berechtigten Interesse der Verantwortlichen Stelle.",
            "Die Verarbeitung ist aus arbeits- und sozialrechtlichen Gründen notwendig.",
            "Die Verarbeitung dient zur Vertragserfüllung und -anbahnung oder eines Arbeitsvertrages."
          ],
          "loesung": [1, 3],
          "negativ": false,
          "begruendung": "<b>Art. 9 Abs. 2 DSGVO</b> enthält einen abschließenden Katalog von Ausnahmen, u. a. die <b>ausdrückliche Einwilligung</b> (lit. a) und die Erforderlichkeit für Pflichten aus dem <b>Arbeitsrecht und dem Recht der sozialen Sicherheit</b> (lit. b). Berechtigtes Interesse und Vertragserfüllung sind nur Rechtsgrundlagen nach <b>Art. 6 Abs. 1 lit. f bzw. lit. b</b> – für Daten nach Art. 9 reichen sie nicht aus."
        },
        {
          "nr": 36,
          "frage": "Welches ist im normalen Geschäftsbereich die sicherste und stärkste Rechtsgrundlage für die Verarbeitung personenbezogener Daten?",
          "antworten": [
            "Die Einwilligung, weil die von der betroffenen Person bewusst gegeben werden muss.",
            "Berechtigte Interessen, weil die am breitesten ausgelegt werden können.",
            "Ein Vertrag, der auf Anfrage der betroffenen Person zustande kommt."
          ],
          "loesung": [3],
          "negativ": false,
          "begruendung": "Ein <b>Vertrag</b> (<b>Art. 6 Abs. 1 lit. b DSGVO</b>) trägt die Verarbeitung, solange sie für den Vertrag erforderlich ist – er kann nicht wie eine Einwilligung jederzeit widerrufen werden. Die <b>Einwilligung</b> ist jederzeit widerrufbar (<b>Art. 7 Abs. 3</b>) und muss freiwillig, informiert und nachweisbar sein. <b>Berechtigte Interessen</b> (<b>lit. f</b>) erfordern eine Interessenabwägung, und die betroffene Person kann widersprechen (<b>Art. 21</b>) – breit auslegbar heißt nicht sicher."
        },
        {
          "nr": 37,
          "sachverhalt": [
            "Gemäß dem Grundsatz der Datensparsamkeit dürfen nach DSGVO nur die für die Zweckerfüllung benötigten Daten erhoben und verarbeitet werden.",
            "Als Fachinformatiker haben Sie die Aufgabe, für einen Online-Büchershop eine entsprechende Eingabemaske zu entwerfen.",
            "Die Maske soll zusätzlich zum Namen, zu Kontakt- und Zahlungsdaten noch Daten zum Einkommen, Alter und Familienstand enthalten."
          ],
          "frage": "Wie muss die Eingabemaske konditioniert werden?",
          "antworten": [
            "Alle Eingabefelder können als Pflichtfelder deklariert werden, da die Daten auch anderweitig verwendet werden können.",
            "Es müssen keine Pflichtfelder gekennzeichnet werden, damit die Kunden zum Ausfüllen aller Felder motiviert werden.",
            "Nur die für den Verkauf benötigten Daten dürfen als Pflichtfelder gekennzeichnet werden, die anderen müssen als optional erkennbar sein."
          ],
          "loesung": [3],
          "negativ": false,
          "begruendung": "<b>Datenminimierung</b> (<b>Art. 5 Abs. 1 lit. c DSGVO</b>) und datenschutzfreundliche Voreinstellungen (<b>Art. 25 Abs. 2</b>): Für den Buchkauf nötig sind Name, Kontakt- und Zahlungsdaten – nur diese dürfen Pflicht sein. Einkommen, Alter und Familienstand braucht ein Buchshop nicht; sie dürfen höchstens freiwillig und klar als optional gekennzeichnet abgefragt werden. <b>Art. 13 Abs. 2 lit. e</b> verlangt zudem die Information, welche Angaben verpflichtend sind. A koppelt den Kauf an Daten, die dafür nicht nötig sind (Kopplungsverbot, <b>Art. 7 Abs. 4</b>), B verschleiert, welche Angaben Pflicht sind."
        }
      ]
    },
    {
      "nr": 3,
      "titel": "Wichtige Einzelthemen",
      "bereich": "Aufgaben 17–24",
      "fragen": [
        {
          "nr": 17,
          "frage": "Welche der folgenden Aussagen ist richtig?",
          "antworten": [
            "Das Urheberrecht gilt nur für Werke der Musik und der bildenden Kunst, nicht aber für Computerprogramme.",
            "Das Urheberrecht wird erst mit der Veröffentlichung des Werkes wirksam.",
            "Das Urheberrecht erlischt 70 Jahre nach dem Tod des Urhebers.",
            "Urheberrecht kann nur für Werke in Anspruch genommen werden, die mit dem Copyright-Zeichen © gekennzeichnet sind."
          ],
          "loesung": [3],
          "negativ": false,
          "begruendung": "Nach <b>§ 64 UrhG</b> erlischt das Urheberrecht <b>70 Jahre nach dem Tod des Urhebers</b>. A ist falsch: Computerprogramme sind ausdrücklich geschützt (<b>§ 2 Abs. 1 Nr. 1, §§ 69a ff. UrhG</b>). B ist falsch: Der Schutz entsteht automatisch mit der <b>Schöpfung</b> des Werkes, nicht erst mit der Veröffentlichung. D ist falsch: Das ©-Zeichen ist in Deutschland keine Voraussetzung, sondern nur ein Hinweis."
        },
        {
          "nr": 18,
          "frage": "Damit eine natürliche oder juristische Person als „Verantwortlicher“ oder „verantwortliche Stelle“ gilt, muss sie Entscheidungsgewalt über zwei Dinge haben:",
          "antworten": [
            "Zeitpunkt und Art der Daten",
            "Erhebung und Verwendung der personenbezogenen Daten",
            "Mittel und Zweck der Verarbeitung von personenbezogenen Daten",
            "Organisieren und Auslesen von personenbezogenen Daten"
          ],
          "loesung": [3],
          "negativ": false,
          "begruendung": "<b>Art. 4 Nr. 7 DSGVO</b>: Verantwortlicher ist, wer allein oder gemeinsam mit anderen über die <b>Zwecke und Mittel</b> der Verarbeitung entscheidet – also über das „Warum“ und das „Wie/Womit“. Erheben, Verwenden, Organisieren oder Auslesen (B, D) sind bloße Verarbeitungsvorgänge nach <b>Art. 4 Nr. 2 DSGVO</b>."
        },
        {
          "nr": 19,
          "frage": "Kennzeichnen Sie die <mark>falsche</mark> Aussage in Bezug auf ein Verzeichnis der Verarbeitungstätigkeiten (VVT).",
          "antworten": [
            "Die meisten Unternehmen sind zum Erstellen eines VVT verpflichtet.",
            "Ein fehlendes VVT kann zur Verhängung eines Bußgeldes führen.",
            "Die Mindestinhalte des VVT sind in der DSGVO definiert, die Form des VVT hingegen nicht.",
            "Das VVT muss der Aufsichtsbehörde spätestens zum 2. Quartal eines jeden Jahres unaufgefordert vorgelegt werden."
          ],
          "loesung": [4],
          "negativ": true,
          "begruendung": "Gesucht ist die falsche Aussage – das ist D. Das VVT muss der Aufsichtsbehörde nur <b>auf Anfrage</b> zur Verfügung gestellt werden (<b>Art. 30 Abs. 4 DSGVO</b>); eine jährliche Vorlagepflicht gibt es nicht. Die übrigen Aussagen stimmen: Die Ausnahme für Unternehmen mit weniger als 250 Beschäftigten (<b>Art. 30 Abs. 5</b>) greift kaum, weil fast jedes Unternehmen regelmäßig Daten verarbeitet (z. B. Lohnabrechnung); ein fehlendes VVT ist bußgeldbewehrt (<b>Art. 83 Abs. 4 lit. a</b>); die Inhalte stehen in <b>Art. 30 Abs. 1</b>, zur Form heißt es nur „schriftlich, auch elektronisch“ (<b>Art. 30 Abs. 3</b>)."
        },
        {
          "nr": 20,
          "frage": "Um im Unternehmen herauszufinden, was die Rechtsgrundlage und was die Löschfrist für die Arbeitszeiterfassung ist, wird welches Dokument diese Angaben enthalten?",
          "antworten": [
            "Personalakte",
            "Stellenbeschreibung des Mitarbeiters",
            "Tätigkeitsbericht des DSB",
            "Verzeichnis der Verarbeitungstätigkeiten (VVT)"
          ],
          "loesung": [4],
          "negativ": false,
          "begruendung": "Das <b>VVT</b> (<b>Art. 30 DSGVO</b>) beschreibt jede Verarbeitungstätigkeit – u. a. Zweck, Datenkategorien, Empfänger und, wenn möglich, die <b>Löschfristen</b> (<b>Art. 30 Abs. 1 lit. f</b>). Die Rechtsgrundlage ist dort zwar nicht ausdrücklich vorgeschrieben, wird in der Praxis aber mit dokumentiert (Rechenschaftspflicht, <b>Art. 5 Abs. 2</b>). Personalakte, Stellenbeschreibung und Tätigkeitsbericht des DSB enthalten diese Angaben nicht."
        },
        {
          "nr": 21,
          "sachverhalt": [
            "Die Verarbeitung personenbezogener Daten darf nur zweckgebunden erfolgen. Nach der Zweckerfüllung darf auch keine Identifizierung der betroffenen Person mehr möglich sein."
          ],
          "frage": "Welche Aussagen sind richtig?",
          "antworten": [
            "Nach der Zweckerfüllung müssen die personenbezogenen Daten sofort gelöscht oder anonymisiert werden, wenn keine gesetzlichen Regelungen entgegenstehen.",
            "Wenn die gesetzliche Aufbewahrungsfrist noch nicht abgelaufen ist, bleiben die Daten gespeichert, müssen aber nach der Zweckerfüllung durch ein geeignetes Verfahren dem allgemeinen Zugriff entzogen werden.",
            "Solange die gesetzliche Aufbewahrungsfrist läuft, bleiben die Daten unverändert gespeichert, damit sie jederzeit eingesehen werden können."
          ],
          "loesung": [1, 2],
          "negativ": false,
          "begruendung": "Grundsatz der <b>Speicherbegrenzung</b> (<b>Art. 5 Abs. 1 lit. e DSGVO</b>): Ist der Zweck erfüllt, werden die Daten gelöscht oder anonymisiert (<b>Art. 17 Abs. 1 lit. a</b>). Steht eine gesetzliche Aufbewahrungspflicht entgegen (z. B. nach HGB oder AO), entfällt die Löschpflicht (<b>Art. 17 Abs. 3 lit. b</b>) – die Daten werden dann <b>gesperrt</b>, also in ihrer Verarbeitung eingeschränkt (<b>Art. 4 Nr. 3</b>), und dürfen nur noch für den Aufbewahrungszweck genutzt werden. C ist falsch: Die Daten dürfen nicht weiter frei einsehbar bleiben."
        },
        {
          "nr": 22,
          "frage": "Wann spricht man von einer Auftragsverarbeitung?",
          "antworten": [
            "Wenn ein Unternehmen die Daten von einer dritten Stelle bekommt und sie für eigene Zwecke verarbeitet.",
            "Wenn ein weiteres Unternehmen über Mittel und Zwecke der Verarbeitung entscheidet.",
            "Wenn eine natürliche oder juristische Person, Behörde oder Einrichtung personenbezogene Daten im Auftrag für den Verantwortlichen (dieser Daten) verarbeitet."
          ],
          "loesung": [3],
          "negativ": false,
          "begruendung": "Definition des Auftragsverarbeiters in <b>Art. 4 Nr. 8 DSGVO</b>: Er verarbeitet Daten <b>im Auftrag</b> und nach Weisung des Verantwortlichen; nötig ist ein <b>Auftragsverarbeitungsvertrag (AVV)</b> nach <b>Art. 28 DSGVO</b>. A beschreibt einen eigenen Verantwortlichen (eigene Zwecke), B ebenfalls: Wer über Zwecke und Mittel (mit)entscheidet, ist kein Auftragsverarbeiter (ggf. gemeinsame Verantwortung, <b>Art. 26</b>)."
        },
        {
          "nr": 23,
          "sachverhalt": [
            "Die DSGVO enthält keine detaillierten Regelungen zur Verarbeitung von personenbezogenen Daten für Werbezwecke. Diese sind explizit im Gesetz gegen den unlauteren Wettbewerb (UWG) formuliert."
          ],
          "frage": "Welche Aussage ist richtig?",
          "antworten": [
            "Da das UWG ein nationales deutsches Gesetz ist, müssen die Vorgaben der DSGVO im Hinblick auf Datenerhebung und Informationspflichten nicht beachtet werden.",
            "Sobald es sich gem. UWG um Bestandskunden handelt, darf ich Werbung zustellen und muss nichts weiter beachten.",
            "Zusätzlich zu den Erlaubnistatbeständen des UWG müssen die Informationspflichten der DSGVO erfüllt werden."
          ],
          "loesung": [3],
          "negativ": false,
          "begruendung": "UWG und DSGVO gelten <b>nebeneinander</b>: Das UWG regelt, wann Werbung wettbewerbsrechtlich zulässig ist (<b>§ 7 UWG</b>); die DSGVO regelt die Datenverarbeitung dafür – inklusive Informationspflichten (<b>Art. 13/14</b>) und Widerspruchsrecht gegen Direktwerbung (<b>Art. 21 Abs. 2</b>). A ist falsch: Die DSGVO gilt als EU-Recht unabhängig vom UWG. B ist falsch: Selbst bei Bestandskunden ist E-Mail-Werbung nur unter Bedingungen erlaubt (<b>§ 7 Abs. 3 UWG</b>: eigene ähnliche Produkte, kein Widerspruch, Hinweis auf das Widerspruchsrecht)."
        },
        {
          "nr": 24,
          "frage": "Innerhalb welches Zeitraums nach Bekanntwerden muss die verantwortliche Stelle meldepflichtige Datenschutzverstöße der Aufsichtsbehörde melden?",
          "antworten": [
            "Innerhalb 1 Monats",
            "Innerhalb von 72 Stunden",
            "Innerhalb von 3 Monaten"
          ],
          "loesung": [2],
          "negativ": false,
          "begruendung": "<b>Art. 33 Abs. 1 DSGVO</b>: Meldung an die Aufsichtsbehörde <b>unverzüglich und möglichst binnen 72 Stunden</b>, nachdem die Verletzung bekannt wurde – es sei denn, sie führt voraussichtlich zu keinem Risiko für die Betroffenen. Bei späterer Meldung muss die Verzögerung begründet werden. Bei <b>hohem Risiko</b> sind zusätzlich die Betroffenen zu benachrichtigen (<b>Art. 34</b>)."
        }
      ]
    }
  ],
  "merkzettel": {
    "fristen": [
      [
        "72 Stunden",
        "Meldung einer Datenpanne an die Aufsichtsbehörde (Art. 33 Abs. 1 DSGVO)"
      ],
      [
        "70 Jahre",
        "Schutzdauer des Urheberrechts nach dem Tod des Urhebers (§ 64 UrhG)"
      ],
      [
        "auf Anfrage",
        "VVT an die Aufsichtsbehörde – keine jährliche Vorlagepflicht (Art. 30 Abs. 4 DSGVO)"
      ],
      [
        "250 Beschäftigte",
        "Grenze der VVT-Ausnahme (Art. 30 Abs. 5) – greift in der Praxis kaum"
      ]
    ],
    "begriffe": [
      [
        "Art. 4 Nr. 1",
        "Personenbezogene Daten",
        "identifizierte oder identifizierbare natürliche Person – direkt oder indirekt"
      ],
      [
        "Art. 4 Nr. 7",
        "Verantwortlicher",
        "entscheidet über <b>Zwecke und Mittel</b> der Verarbeitung"
      ],
      [
        "Art. 4 Nr. 8",
        "Auftragsverarbeiter",
        "verarbeitet <b>im Auftrag</b> des Verantwortlichen, mit AVV (Art. 28)"
      ]
    ],
    "verwechslungen": [
      [
        "Art. 9 vs. Art. 10",
        "rassische und ethnische Herkunft, politische Meinung, Religion/Weltanschauung, Gewerkschaftszugehörigkeit, genetische und biometrische Daten, Gesundheit, Sexualleben/sexuelle Orientierung → <b>Art. 9</b>. Straftaten und Führungszeugnis → <b>Art. 10</b>. Bankdaten → keins von beiden."
      ],
      [
        "Rechte vs. Maßnahmen",
        "Auskunft, Berichtigung, Löschung, Einschränkung, Übertragbarkeit, Widerspruch, Beschwerde sind <b>Rechte</b>. Verschlüsselung, Pseudonymisierung, Anonymisierung sind <b>TOM</b>."
      ],
      [
        "Art. 6 vs. Art. 9 Abs. 2",
        "Vertrag und berechtigtes Interesse reichen für normale Daten – für besondere Kategorien braucht es eine Ausnahme aus Art. 9 Abs. 2 (z. B. ausdrückliche Einwilligung, Arbeits- und Sozialrecht)."
      ],
      [
        "Verantwortung vs. Beratung",
        "Verantwortlich ist die <b>oberste Leitung</b>; der DSB berät und überwacht nur."
      ],
      [
        "Datenschutz vs. Datensicherheit",
        "Schutz der <b>Person</b> (qualitativ, Rechte und Freiheiten) vs. Schutz <b>aller Daten</b> (quantitativ, Schadenshöhe × Eintrittswahrscheinlichkeit)."
      ],
      [
        "Löschen vs. Sperren",
        "Zweck erfüllt → löschen oder anonymisieren; Aufbewahrungsfrist läuft noch → sperren (Einschränkung der Verarbeitung)."
      ],
      [
        "Widerruf vs. Widerspruch",
        "Eine Einwilligung wird <b>widerrufen</b> (Art. 7 Abs. 3), einer Verarbeitung wird <b>widersprochen</b> (Art. 21)."
      ]
    ],
    "tipp": "Fünf der 21 Fragen fragen nach der <b>falschen</b> bzw. <b>nicht</b> zutreffenden Aussage: Kap. 1 Aufg. 13, Kap. 2 Aufg. 32, 33 und 34 sowie Kap. 3 Aufg. 19. Dort werden die falschen Aussagen angekreuzt – Signalwort beim Lesen markieren."
  }
};
