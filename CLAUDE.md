# LED Kit Kalkulator — matlak.stream/led-kit

## Opis projektu

Statyczna strona HTML do planowania instalacji ekranów LED. Skierowana do laików (operatorzy AV, organizatorzy eventów). Dostępna pod adresem `matlak.stream/led-kit`.

## Struktura plików

```
led/
├── index.html        # Cała aplikacja — logika JS, style CSS, diagramy SVG
├── logo.png          # Logo matlak.stream (2500×1576px, branding)
└── CLAUDE.md         # Ten plik
```

## Wdrożenie (FTP)

- **Host:** `maslak.ftp.dhosting.pl`
- **Login:** `id7die_ledkit`
- **Katalog:** `~/matlak.stream-fai9/public_html/ledkit/`
- **Komenda upload:**
  ```bash
  curl --ftp-create-dirs -u "id7die_ledkit:<hasło>" -T plik.html "ftp://maslak.ftp.dhosting.pl/matlak.stream-fai9/public_html/ledkit/plik.html"
  ```

## Dane techniczne (hardcoded w JS)

### ESDLumen Dazzle Plus P2.84
| Parametr | Wartość |
|---|---|
| Wymiar kabinetu | 500 × 500 mm |
| Rozdzielczość kabinetu | 176 × 176 px |
| Pixel pitch | 2.84 mm |
| Maks. pobór mocy | 100 W/kabinet |
| Waga | 8.5 kg/kabinet |

### Novastar VX1000
| Parametr | Wartość |
|---|---|
| Porty wyjściowe | 10× Ethernet |
| Maks. pikseli łącznie | 6 500 000 px |
| Maks. pikseli na port | ~650 000 px |
| Maks. kabinetów na port | ~20 szt. (Dazzle Plus) |
| Topologia | Daisy chain per port |

### Limity zasilania (rozdzielnia 32A → Powercon True1 230V)
| Obwód | Bezpieczny limit | Maks. kabinetów |
|---|---|---|
| 16A | 3 000 W | 30 kab. |
| 32A | 6 000 W | 60 kab. |

## Funkcjonalność kalkulatora

### 3 tryby wejścia (zakładki)
- **A: Liczba kabinetów** — suwak + input (szerokość × wysokość)
- **B: Wymiary fizyczne** — metry → auto oblicz kabinety (zaokrąglenie do pełnych kabinetów)
- **C: Rozdzielczość docelowa** — piksele → ceil do pełnych kabinetów

### Podgląd układu
- Canvas z siatką kabinetów, numerami, wzorem LED (dots)
- Skaluje się do dostępnej przestrzeni

### Wyniki kalkulacji
- Łączna liczba kabinetów
- Wymiary fizyczne (m)
- Rozdzielczość (px)
- Proporcje ekranu (aspect ratio)
- Łączna liczba pikseli
- Waga (kg)
- Maks. pobór mocy (W)

### Sekcja zasilania
- Obliczenia: moc (kW), prąd (A przy 230V)
- Rekomendacja: 16A vs 32A vs wiele obwodów 32A
- Diagram SVG: rozdzielnia → zasilacze → grupy kabinetów
- 5 kabinetów na zasilacz 500W

### Schemat Novastar VX1000
- Tabela: port → liczba kabinetów → numery kabinetów → piksele
- Diagram SVG: prostokąt VX1000 (10 portów) → łańcuchy kabinetów
- Kolory portów unikalne per port (10 kolorów)

## Kolorystyka matlak.stream

```css
--bg: #13151a          /* tło główne */
--surface: #1e2028     /* karty */
--surface2: #252932    /* pola input, diagramy */
--border: #2d3340
--accent: #33b5d8      /* cyan — główny akcent */
--accent2: #1a8fb0
--text: #e5e7eb
--muted: #7a8394
```

## Planowane rozszerzenia

- [ ] Dodatkowe modele kabinetów (P3.9, P4.8, outdoor itp.)
- [ ] Eksport do PDF / wydruk
- [ ] Zapisywanie konfiguracji (localStorage)
- [ ] Kalkulator kabla (długości CAT6 między kabinetami)
