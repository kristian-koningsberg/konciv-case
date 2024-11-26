# Info:

Link til dataset brukt: https://data.ssb.no/api/v0/dataset/1076?lang=no
Charts.js installert(npm) : https://www.chartjs.org/docs/latest/getting-started/
Kan være jeg må nedgradere til react 18.

# Session 1

- Mål: Få inn data, vis data, filtrer data
- Tidsramme: 22.11.2024 - 14.00 - 16.00
- Tid brukt: 2 timer
- Resultat: Oppnådd import av data, filtrering av data, visualisere data.
  Ingen styling
- Problem: Hadde litt vanskelighet med å forstå formatet av dataen og å
  få rendret det korrekt. Fikk løst det med en kombinasjon av selvtesting
  og gpt. Dette gjaldt også mtp at dataen bestod kun av objekter som ikke
  kan bruke metoder som .map() ,som jeg ønsket å bruke for å rendre.
  Løsningen var da å omdefinere dem ved hjelp av Object.key(variabel).map()

# Session 2

- Mål: Få chart til å respondere på SSBData og filterdata. Abstrakte kode.
- Tidsramme: 23.11.2024 - kl.13.00 - kl.16.15
- Tid brukt: 3 timer
- Resultat: Bar chart bruker SSB data + filter. Abstraktet kodebase.
  Nedgradert til react 18 pga dependency issues.
- Problem: Litt issues med chart + SSBData visualisering. Mye frem og
  tilbake med copilot og research. Skulle kanskje definert egne data i
  SSB fremfor å gjøre det i kode, menmen.

# Session 3

- Mål: Start på litt styling, dropdowns ++.
  Funksjon som sammenligner 2 kommer i populasjon
  Start styling og design av dashboard.
- Tidsramme: 24.11.2024 - kl.13.00 - kl.16.00
- Tid brukt: 3 timer
- Resultat: Dropdowns som lar bruker velge region 1 og 2 for sammenligning.
  Styling er startet. Litt formatering av kode. Innstallert React Icons.
- Problem: Har fortsatt issues med skikkelig håndtering av dataen.

# Session 4

- Mål: Spice opp design med ikoner osv. Fiks mer på funksjonalitet. UU, UX, UI.
- Tidsramme: 25.11.2024 - kl.07.30 - kl.11.15 + kl.12.15 - 18.50
- Tid brukt: 10+ timer
- Resultat: Double Line Chart. "Badges" som lar bruker velge to fylker.
  Toggle mellom 2 chart typer (line/block). Renset opp UI. Fetcher nå
  2 dataset data2. Lagd ny chart som tar inn innflytting data til regioner.
- Problem: Rotet rundt mye med states pga forvirring rundt charts.

# Session 5

- Mål: Implementer data2 på en brukelig måte.
- Tidsramme: 26.11.2024 - kl.tid - kl.tid
- Tid brukt: x timer
- Resultat: Kort forklaring
- Problem: Kort forklaring
