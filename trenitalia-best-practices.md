# Trenitalia App Prototype: Coding Best Practices & Architectural Guidelines

Questo documento illustra le best practices e le convenzioni di programmazione applicate finora nel prototipo dell'app Trenitalia. Serve come guida di riferimento per garantire coerenza, scalabilità e manutenibilità in tutto il codice, ed è particolarmente rivolto a LLM e sviluppatori che contribuiranno al progetto.

## 1. Stack Tecnologico Principale

- **Framework**: React Native con **Expo** e **Expo Router** (file-based routing con la cartella `app/`).
- **Styling**: **NativeWind** (v4) che permette l'utilizzo di classi **Tailwind CSS** direttamente nei componenti React Native tramite la prop `className`.
- **Linguaggio**: **TypeScript**, per garantire il type safety e una migliore documentazione inline.

---

## 2. Architettura e Componentizzazione (Cruciale)

La **componentizzazione degli elementi** è il pilastro fondante di questo progetto. L'obiettivo primario è frammentare l'interfaccia utente in micro-componenti (Atomic Design) altamente riutilizzabili, in modo da comporre view complesse assemblando blocchi elementari piuttosto che scrivere codice monolitico.

### Regole d'Oro della Componentizzazione
1. **Zero Monoliti**: Nessun componente o view deve superare le 150-200 righe di codice. Se una view sta crescendo, estrai le sue parti in sotto-componenti logici all'interno delle rispettive cartelle.
2. **Isolamento delle Responsabilità (Dumb vs Smart Components)**:
   - **Componenti UI ("Dumb")**: Situati in `components/ui/` (es. `main-button.tsx`, `icon.tsx`). Devono occuparsi *solo ed esclusivamente* della presentazione. Non devono avere stato interno o logica di navigazione. I dati e i trigger per le azioni vengono passati tramite props (`onPress`, `title`, ecc.).
   - **Componenti di Dominio ("Smart")**: Situati in folder specifiche (es. `components/home/ticket-purchase-card.tsx`). Possono aggregare più "Dumb Components", gestire logica locale e definire la struttura delle singole aree della schermata.
3. **Astrazione e Riusabilità Totale**: Ogni volta che un pattern di UI si ripete (es. una card, un badge, un input field particolare), DEVE essere estratto in un componente separato. Non duplicare mai JSX.
4. **Interfacce Chiare (Props Standardization)**: Ogni componente deve avere un'interfaccia TypeScript definita ed esportata, ad esempio `interface MyComponentProps`. Documenta i casi d'uso delle props opzionali.
5. **Riutilizzo Prima della Creazione**: Moltissimi elementi grafici base sono *già* stati componentizzati (bottoni, icone, testi formattati, modali). Prima di scrivere un nuovo componente da zero, esplora la cartella `components/` (specialmente `components/ui/`) e verifica che non esista già un elemento adatto al tuo scopo.

### Struttura delle Directory Dedicata
- `app/`: Da mantenere il più pulita possibile, delegando tutto il rendering complesso ai componenti.
- `components/`:
  - `components/ui/`: Per gli atomi e le molecole riutilizzabili ovunque (es. bottoni, modali generici, tipografia, icone).
  - `components/home/`, `components/modals/`, ecc.: Organismi e layout specifici per funzionalità o dominio.
- `constants/`: Configurazione e costanti (es. `theme.ts`).

---

## 3. Styling con NativeWind e Tailwind CSS

L'approccio principale allo styling è l'utilizzo delle utility classes di Tailwind.

### Regole per lo Styling
1. **Preferenza per Tailwind (`className`)**: Usa NativeWind per la maggior parte del layout, margini, padding, colori del testo e background (es. `className="flex-1 flex-row items-center justify-center px-4"`).
2. **Uso mirato di `style={...}`**: Limita l'uso dell'oggetto `style` di React Native esclusivamente a proprietà che non sono mappate perfettamente in NativeWind o che richiedono precisione assoluta. 
   - **Esempio tipico**: Le ombre su iOS/Android (Shadows/Elevations). *Nota:* Spesso vengono applicate con una combinazione di `elevation: 4`, `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`.
3. **Important (`!`) nei Colori**: Per superare alcuni limiti di ereditarietà o override cromatici di NativeWind in specifici contesti, è accettata e incoraggiata la sintassi `!text-white` o `!text-[#262626]` per garantire che il colore del testo sia applicato senza bug visivi.
4. **Variabili e Gradienti**: Per background complessi come i bottoni primari rossi (tipici di Trenitalia), usa `LinearGradient` da `expo-linear-gradient` (es. `colors={["#8a052b", "#f73d3d"]}`).

---

## 4. Tipografia Custom

L'app utilizza font custom, in particolare la famiglia **Plus Jakarta Sans**, configurata nel file `tailwind.config.js`.

### Regole Tipografiche
1. **Uso di `<ThemedText>`**: Qualsiasi elemento testuale **deve** essere wrappato nel componente `<ThemedText>`, che gestisce la corretta visualizzazione sia per il tema chiaro che per il tema scuro in modo globale. Evita di usare il normale `<Text>` di React Native direttamente nelle view finali.
2. **Classi Font di Tailwind**: Usa le classi custom configurate in `tailwind.config.js` per il peso del font:
   - `font-plus-jakarta` (Regular 400)
   - `font-plus-jakarta-medium` (Medium 500)
   - `font-plus-jakarta-semibold` (SemiBold 600)
   - `font-plus-jakarta-bold` (Bold 700)
   - `font-plus-jakarta-extrabold` (ExtraBold 800)

---

## 5. Iconografia

1. **Uso del componente `<Icon>`**: Tutte le icone dell'app devono passare per il wrapper `<Icon>` definito in `components/ui/icon.tsx`.
2. Questo componente uniforma il rendering delle icone vettoriali. Quando si usa un'icona, le props comuni sono `name` (stringa con il nome dell'icona), `size` (numero), `color` e `weight`.

---

## Riepilogo per i futuri sviluppi (Prompt per LLM)

Quando generi nuovo codice per questa applicazione, attieniti strettamente a queste direttive:
- **SI**: Cerca sempre componenti preesistenti in `components/` (specialmente `components/ui/`) prima di reinventare la ruota; quasi sicuramente quello che cerchi è già stato componentizzato.
- **SI**: Usa TypeScript con interfacce definite esplicitamente.
- **SI**: Usa `className` con NativeWind per lo styling.
- **SI**: Sfrutta `<ThemedText>` con le classi `font-plus-jakarta-*` per ogni label e testo.
- **SI**: Separa i componenti di interfaccia pura (in `/ui`) dalla logica di business.
- **SI**: Usa l'array `colors` in `LinearGradient` per le call-to-action principali usando i colori brand di Trenitalia (rosso borgogna/magenta).
- **NO**: Non usare `StyleSheet.create` a meno che non sia strettamente indispensabile (es. per animazioni complesse o ombre specifiche).
- **NO**: Non utilizzare colori inline `style={{color: 'red'}}`, ma usa `className="!text-red-500"`.
