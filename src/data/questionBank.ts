import type { Question, QuestionOption } from '../types/diagnostic'

/**
 * Curated 12-Question Diagnostic Bank for Bereit?
 * Aligned strictly with CEFR A1 (Goethe-Zertifikat A1: Start Deutsch 1 & ÖSD Zertifikat A1)
 *
 * Breakdown:
 * - 4 Vocabulary (2 Foundational, 2 Application)
 * - 4 Grammar (2 Foundational, 2 Application)
 * - 4 Reading (2 Foundational, 2 Application with authentic stimuli)
 * Total: 12 Questions (6 Foundational, 6 Application)
 *
 * Immutable data: Frozen with Object.freeze to guarantee runtime tamper-resistance.
 */

const rawQuestionBank: Question[] = [
  // ==========================================
  // VOCABULARY (Wortschatz) — Questions 1 to 4
  // ==========================================
  {
    id: 'q_vocab_01',
    skill: 'vocabulary',
    cognitiveLevel: 'foundational',
    topicTag: 'everyday_places',
    topicDisplayName: 'Orte im Alltag & Dienstleistungen',
    prompt: 'Wo kauft man in Deutschland Medikamente?',
    options: [
      { id: 'q_vocab_01_opt_a', text: 'In der Bibliothek' },
      { id: 'q_vocab_01_opt_b', text: 'In der Apotheke' },
      { id: 'q_vocab_01_opt_c', text: 'Am Bahnhof' },
      { id: 'q_vocab_01_opt_d', text: 'Im Museum' },
    ],
    correctOptionId: 'q_vocab_01_opt_b',
    explanation: 'Medikamente kauft man in einer Apotheke. Eine Drogerie oder ein Supermarkt verkauft in Deutschland keine rezeptpflichtigen Arzneimittel.',
    remediationTitle: 'Wortschatz: Orte in der Stadt und Dienstleistungen',
    remediationAction: 'Wiederholen Sie die wichtigsten öffentlichen Orte und Geschäfte (die Apotheke, die Post, die Bank, das Krankenhaus, der Bahnhof).',
  },
  {
    id: 'q_vocab_02',
    skill: 'vocabulary',
    cognitiveLevel: 'application',
    topicTag: 'food_and_shopping',
    topicDisplayName: 'Lebensmittel & Einkaufen',
    prompt: 'Frau Meier möchte frische Brötchen und ein Brot fürs Frühstück kaufen. Wohin geht sie?',
    options: [
      { id: 'q_vocab_02_opt_a', text: 'In die Metzgerei' },
      { id: 'q_vocab_02_opt_b', text: 'In die Buchhandlung' },
      { id: 'q_vocab_02_opt_c', text: 'In die Bäckerei' },
      { id: 'q_vocab_02_opt_d', text: 'In die Werkstatt' },
    ],
    correctOptionId: 'q_vocab_02_opt_c',
    explanation: 'Brot und Brötchen (Backwaren) kauft man in der Bäckerei. Fleisch und Wurst kauft man in der Metzgerei (Fleischerei).',
    remediationTitle: 'Wortschatz: Lebensmittelgeschäfte und Einkaufen',
    remediationAction: 'Lernen Sie die deutschen Fachgeschäfte für Lebensmittel (Bäckerei, Metzgerei, Markt, Supermarkt) sowie Mengenangaben (ein Kilo, ein Pfund).',
  },
  {
    id: 'q_vocab_03',
    skill: 'vocabulary',
    cognitiveLevel: 'foundational',
    topicTag: 'family_relationships',
    topicDisplayName: 'Familie & Beziehungen',
    prompt: 'Wie nennt man die Mutter und den Vater zusammen?',
    options: [
      { id: 'q_vocab_03_opt_a', text: 'Die Geschwister' },
      { id: 'q_vocab_03_opt_b', text: 'Die Eltern' },
      { id: 'q_vocab_03_opt_c', text: 'Die Großeltern' },
      { id: 'q_vocab_03_opt_d', text: 'Die Verwandten' },
    ],
    correctOptionId: 'q_vocab_03_opt_b',
    explanation: 'Mutter und Vater gemeinsam heißen „die Eltern“. „Geschwister“ bezeichnet Brüder und Schwestern; „Großeltern“ sind Oma und Opa.',
    remediationTitle: 'Wortschatz: Familie und Verwandtschaftsverhältnisse',
    remediationAction: 'Prägen Sie sich die Familienbezeichnungen im Deutschen ein (Eltern, Kinder, Geschwister, Ehepartner, Großeltern).',
  },
  {
    id: 'q_vocab_04',
    skill: 'vocabulary',
    cognitiveLevel: 'application',
    topicTag: 'weather_and_clothing',
    topicDisplayName: 'Wetter & Kleidung',
    prompt: 'Es schneit und das Thermometer zeigt -5 °C (Minus fünf Grad). Was zieht Lukas an?',
    options: [
      { id: 'q_vocab_04_opt_a', text: 'Eine Badehose' },
      { id: 'q_vocab_04_opt_b', text: 'Ein T-Shirt und Sandalen' },
      { id: 'q_vocab_04_opt_c', text: 'Eine warme Winterjacke und eine Mütze' },
      { id: 'q_vocab_04_opt_d', text: 'Ein leichtes Sommerkleid' },
    ],
    correctOptionId: 'q_vocab_04_opt_c',
    explanation: 'Bei Minustemperaturen und Schneefall benötigt man warme Kleidung: Winterjacke, Mütze, Schal und feste Stiefel.',
    remediationTitle: 'Wortschatz: Wetter und passende Kleidung',
    remediationAction: 'Kombinieren Sie Wetterausdrücke (es schneit, es regnet, die Sonne scheint) mit den entsprechenden Kleidungsstücken (Jacke, Pullover, Mantel, Schirm).',
  },

  // ==========================================
  // GRAMMAR (Grammatik) — Questions 5 to 8
  // ==========================================
  {
    id: 'q_gram_01',
    skill: 'grammar',
    cognitiveLevel: 'foundational',
    topicTag: 'accusative_articles',
    topicDisplayName: 'Akkusativ: Maskuline Artikel (den / einen)',
    prompt: 'Welcher Satz ist grammatisch korrekt?',
    options: [
      { id: 'q_gram_01_opt_a', text: 'Ich habe ein Hund.' },
      { id: 'q_gram_01_opt_b', text: 'Ich habe einen Hund.' },
      { id: 'q_gram_01_opt_c', text: 'Ich habe einem Hund.' },
      { id: 'q_gram_01_opt_d', text: 'Ich habe der Hund.' },
    ],
    correctOptionId: 'q_gram_01_opt_b',
    explanation: 'Das Verb „haben“ verlangt das direkte Objekt im Akkusativ. Da „Hund“ maskulin ist (der Hund), lautet der unbestimmte Artikel im Akkusativ „einen Hund“.',
    remediationTitle: 'Grammatik: Maskuline Artikel im Akkusativ',
    remediationAction: 'Üben Sie typische A1-Akkusativverben (haben, brauchen, kaufen, suchen, nehmen) gezielt mit maskulinen Nomen (den/einen Tisch, den/einen Kaffee).',
  },
  {
    id: 'q_gram_02',
    skill: 'grammar',
    cognitiveLevel: 'application',
    topicTag: 'verb_conjugation',
    topicDisplayName: 'Verben mit Vokalwechsel (Präsens)',
    prompt: 'Ergänzen Sie die Lücke: Anna ________ morgen früh mit dem Zug nach Berlin.',
    options: [
      { id: 'q_gram_02_opt_a', text: 'fahrt' },
      { id: 'q_gram_02_opt_b', text: 'fahre' },
      { id: 'q_gram_02_opt_c', text: 'fährt' },
      { id: 'q_gram_02_opt_d', text: 'fahren' },
    ],
    correctOptionId: 'q_gram_02_opt_c',
    explanation: 'Das unregelmäßige Verb „fahren“ hat in der 2. und 3. Person Singular einen Vokalwechsel von a zu ä (du fährst, er/sie/es fährt).',
    remediationTitle: 'Grammatik: Unregelmäßige Verben mit Vokalwechsel',
    remediationAction: 'Lernen Sie die vier häufigsten A1-Vokalwechselverben auswendig: fahren (fährt), sehen (sieht), lesen (liest) und sprechen (spricht).',
  },
  {
    id: 'q_gram_03',
    skill: 'grammar',
    cognitiveLevel: 'application',
    topicTag: 'verb_second_order',
    topicDisplayName: 'Wortstellung im Hauptsatz (Verb an Position 2)',
    prompt: 'Welcher Satz hat die richtige deutsche Wortstellung?',
    options: [
      { id: 'q_gram_03_opt_a', text: 'Am Sonntag ich spiele Fußball im Park.' },
      { id: 'q_gram_03_opt_b', text: 'Am Sonntag spiele ich Fußball im Park.' },
      { id: 'q_gram_03_opt_c', text: 'Am Sonntag Fußball ich spiele im Park.' },
      { id: 'q_gram_03_opt_d', text: 'Spiele am Sonntag ich Fußball im Park.' },
    ],
    correctOptionId: 'q_gram_03_opt_b',
    explanation: 'Im deutschen Aussagesatz steht das konjugierte Verb ausnahmslos an Position 2. Steht die Zeitangabe („Am Sonntag“) auf Position 1, folgt sofort das Verb („spiele“) und erst danach das Subjekt („ich“).',
    remediationTitle: 'Grammatik: Verb-Zweitstellung und Inversion',
    remediationAction: 'Üben Sie Sätze, die mit temporalen oder lokalen Angaben beginnen: „Heute lerne ich...“, „Morgen fahre ich...“ (immer Verb auf Position 2).',
  },
  {
    id: 'q_gram_04',
    skill: 'grammar',
    cognitiveLevel: 'foundational',
    topicTag: 'negation_kein_nicht',
    topicDisplayName: 'Negation: kein vs. nicht',
    prompt: 'Ergänzen Sie: „Möchtest du einen Kaffee?“ — „Nein danke, ich trinke ________ Kaffee.“',
    options: [
      { id: 'q_gram_04_opt_a', text: 'nicht' },
      { id: 'q_gram_04_opt_b', text: 'keinen' },
      { id: 'q_gram_04_opt_c', text: 'kein' },
      { id: 'q_gram_04_opt_d', text: 'keine' },
    ],
    correctOptionId: 'q_gram_04_opt_b',
    explanation: 'Nomen mit unbestimmtem Artikel oder ohne Artikel (Nullartikel) verneint man mit „kein-“. Da „Kaffee“ maskulin ist und im Akkusativ steht, lautet die richtige Form „keinen Kaffee“.',
    remediationTitle: 'Grammatik: Verneinung mit Formen von „kein“',
    remediationAction: 'Unterscheiden Sie: Nomen verneint man mit kein/keine/keinen (Ich habe kein Auto / keinen Hunger), während Verben und Adjektive mit „nicht“ verneint werden.',
  },

  // ==========================================
  // READING (Leseverstehen) — Questions 9 to 12
  // ==========================================
  {
    id: 'q_read_01',
    skill: 'reading',
    cognitiveLevel: 'application',
    topicTag: 'personal_messages',
    topicDisplayName: 'Leseverstehen: Persönliche E-Mails & Mitteilungen',
    contextStimulus: `Lieber Marco,

am kommenden Samstag feiere ich meinen Geburtstag! Die Feier beginnt um 19:00 Uhr bei mir in der Gartenstraße 14. 
Kuchen, Salate und Pizza habe ich schon vorbereitet. Bring bitte etwas zu trinken mit (z.B. Saft oder Cola). 
Gib mir bitte bis Donnerstag kurz Bescheid, ob du kommen kannst.

Liebe Grüße,
Stefan`,
    prompt: 'Was soll Marco zur Geburtstagsfeier mitbringen?',
    options: [
      { id: 'q_read_01_opt_a', text: 'Pizza und Salat' },
      { id: 'q_read_01_opt_b', text: 'Einen Geburtstagskuchen' },
      { id: 'q_read_01_opt_c', text: 'Getränke (z.B. Saft oder Cola)' },
      { id: 'q_read_01_opt_d', text: 'Musik für die Party' },
    ],
    correctOptionId: 'q_read_01_opt_c',
    explanation: 'Stefan schreibt ausdrücklich: „Bring bitte etwas zu trinken mit (z.B. Saft oder Cola).“ Kuchen, Salat und Pizza hat Stefan bereits selbst vorbereitet.',
    remediationTitle: 'Leseverstehen: Informelle Einladungen und E-Mails erfassen',
    remediationAction: 'Scannen Sie persönliche Nachrichten gezielt nach Schlüsselwörtern: Wer lädt ein? Wann und wo findet das Treffen statt? Was soll mitgebracht werden?',
  },
  {
    id: 'q_read_02',
    skill: 'reading',
    cognitiveLevel: 'foundational',
    topicTag: 'public_notices',
    topicDisplayName: 'Leseverstehen: Öffentliche Hinweise & Schilder',
    contextStimulus: `STADTBIBLIOTHEK NORD
Öffnungszeiten für Besucher:
• Montag bis Freitag: 10:00 – 19:00 Uhr
• Samstag: 10:00 – 14:00 Uhr
• Sonn- und Feiertage: Geschlossen

Buchrückgabe:
Außerhalb der Öffnungszeiten steht der Rückgabeautomat am Haupteingang 24 Stunden täglich zur Verfügung.`,
    prompt: 'Wann kann man an einem Samstag in der Bibliothek Bücher ausleihen?',
    options: [
      { id: 'q_read_02_opt_a', text: 'Den ganzen Tag (24 Stunden lang)' },
      { id: 'q_read_02_opt_b', text: 'Nur von 10:00 bis 14:00 Uhr' },
      { id: 'q_read_02_opt_c', text: 'Von 10:00 bis 19:00 Uhr' },
      { id: 'q_read_02_opt_d', text: 'Samstags ist die Bibliothek immer geschlossen' },
    ],
    correctOptionId: 'q_read_02_opt_b',
    explanation: 'Laut Hinweisschild hat die Bibliothek am Samstag nur von 10:00 bis 14:00 Uhr geöffnet. Der 24h-Automat dient ausschließlich der Rückgabe, nicht dem Ausleihen.',
    remediationTitle: 'Leseverstehen: Öffnungszeiten und Aushänge',
    remediationAction: 'Achten Sie bei öffentlichen Tafeln genau auf Wochentage (Mo–Fr vs. Sa/So) sowie die Unterscheidung zwischen Servicezeiten und Automatenbetrieb.',
  },
  {
    id: 'q_read_03',
    skill: 'reading',
    cognitiveLevel: 'application',
    topicTag: 'timetables_schedules',
    topicDisplayName: 'Leseverstehen: Fahrpläne & Reiseverbindungen',
    contextStimulus: `Fahrplan München Hbf -> Nürnberg Hbf (Dienstag, 15. Oktober)

Zug       | Abfahrt | Ankunft | Gleis | Bemerkungen
---------------------------------------------------------------
ICE 720   | 08:15   | 09:25   | 18    | Fährt nur Mo–Fr
RE 4012   | 08:42   | 10:30   | 24    | Täglich
ICE 824   | 09:15   | 10:25   | 18    | Täglich

Hinweis: Sitzplatzreservierung im ICE wird empfohlen.`,
    prompt: 'Herr Wagner fährt am Dienstag und muss unbedingt vor 10:00 Uhr in Nürnberg sein. Welchen Zug muss er wählen?',
    options: [
      { id: 'q_read_03_opt_a', text: 'Den Regionalexpress RE 4012 um 08:42 Uhr' },
      { id: 'q_read_03_opt_b', text: 'Den ICE 824 um 09:15 Uhr' },
      { id: 'q_read_03_opt_c', text: 'Den ICE 720 um 08:15 Uhr' },
      { id: 'q_read_03_opt_d', text: 'Kein Zug kommt vor 10:00 Uhr in Nürnberg an' },
    ],
    correctOptionId: 'q_read_03_opt_c',
    explanation: 'Der ICE 720 fährt um 08:15 Uhr ab und erreicht Nürnberg um 09:25 Uhr (also vor 10:00 Uhr). Da Dienstag ein Wochentag (Mo–Fr) ist, verkehrt dieser Zug planmäßig.',
    remediationTitle: 'Leseverstehen: Fahrpläne und Reiseinformationen',
    remediationAction: 'Üben Sie das systematische Ablesen von Fahrplantabellen: Abfahrtszeit, Ankunftszeit, Fahrtzeit und Verkehrstage (Mo–Fr vs. Wochenende).',
  },
  {
    id: 'q_read_04',
    skill: 'reading',
    cognitiveLevel: 'foundational',
    topicTag: 'classified_advertisements',
    topicDisplayName: 'Leseverstehen: Kleinanzeigen & Wohnungsangebote',
    contextStimulus: `WOHNUNGSANZEIGE:
Helle 2-Zimmer-Wohnung in Köln-Ehrenfeld, ab 1. Juni frei.
Kaltmiete: 620 € pro Monat (+ 160 € Nebenkosten für Heizung & Wasser).
Gesamtmiete (Warmmiete): 780 € monatlich.
Balkon, Einbauküche vorhanden. Keine Haustiere erlaubt.
Besichtigung nach Vereinbarung: mail@wohnen-koeln.de`,
    prompt: 'Wie hoch sind die Nebenkosten für die Wohnung pro Monat?',
    options: [
      { id: 'q_read_04_opt_a', text: '620 €' },
      { id: 'q_read_04_opt_b', text: '780 €' },
      { id: 'q_read_04_opt_c', text: '160 €' },
      { id: 'q_read_04_opt_d', text: 'Die Nebenkosten sind kostenlos' },
    ],
    correctOptionId: 'q_read_04_opt_c',
    explanation: 'Im Anzeigentext steht eindeutig: „+ 160 € Nebenkosten für Heizung & Wasser“. Die Kaltmiete beträgt 620 € und die Gesamtmiete 780 €.',
    remediationTitle: 'Leseverstehen: Wohnungs- und Kleinanzeigen',
    remediationAction: 'Prägen Sie sich die zentralen Begriffe deutscher Mietanzeigen ein: Kaltmiete, Nebenkosten, Warmmiete, Kaution, Zimmeranzahl und Besichtigung.',
  },
]

// Enforce deep immutability for the question bank
export const questionBank: readonly Question[] = Object.freeze(
  rawQuestionBank.map((q) =>
    Object.freeze({
      ...q,
      options: Object.freeze([...q.options]) as unknown as [
        QuestionOption,
        QuestionOption,
        QuestionOption,
        QuestionOption,
      ],
    })
  )
)
