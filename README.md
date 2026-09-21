# Spectra ⚛️
<img width="1920" height="1080" alt="Screenshot from 2026-09-21 19-21-12" src="https://github.com/user-attachments/assets/25400512-1df2-4a2e-959b-33672d7e0ee5" />

### An interactive periodic table built for exploration, learning, and discovery.

**Spectra** is a modern, interactive periodic table of the elements that goes beyond basic element names and symbols. Explore all **118 chemical elements** through an interactive interface featuring physical properties, electron structure, reactivity, common compounds, discovery information, and simulated spectral fingerprints.

---

## ✨ Features

* 🧪 **All 118 Elements** — Explore the complete periodic table.
* 🔎 **Instant Search** — Search by element name, symbol, or atomic number.
* 🎨 **Category Visualization** — Color-code elements by chemical category.
* 🌡️ **Phase View** — Visualize elements by their physical state at STP.
* 📋 **Detailed Element Profiles** — View key physical and chemical properties.
* ⚛️ **Electron Structure** — Explore electron shells and configurations.
* 🧬 **Reactivity Information** — See common elements and substances each element reacts with.
* 🧫 **Common Compounds** — Explore examples of compounds associated with each element.
* 🌈 **Spectral Fingerprints** — View a simulated spectral visualization for each element.
* 🔬 **Discovery Information** — See who discovered and named each element where available.
* ⌨️ **Keyboard Navigation** — Navigate between elements with the arrow keys.
* 📱 **Responsive Interface** — Designed for modern desktop and mobile browsers.
* ♿ **Accessible Controls** — Interactive elements include labels and keyboard-friendly controls.

---

## 🖥️ Preview

The interface presents the periodic table as an interactive grid. Selecting an element opens a detailed information panel containing its properties, electron structure, reactivity, compounds, and discovery information.

> Add screenshots or a GIF of the application here to make the repository more visually engaging.

```text
┌──────────────────────────────────────────────────────────────┐
│ SPECTRA                         Search...     Category Phase │
├──────────────────────────────────────────────────────────────┤
│ H                                                     He     │
│ Li  Be                              B  C  N  O  F  Ne        │
│ Na  Mg                              ...                     │
│                                                              │
│                    PERIODIC TABLE                            │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ Click an element → detailed properties & chemistry          │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Live Demo

**[Open Spectra](https://damien222201.github.io/spectra/)**

---

## 🛠️ Built With

* **HTML5** — Application structure
* **CSS3** — Layout, responsive design, visual system, and animations
* **JavaScript (Vanilla JS)** — Application logic and interactivity
* **SVG** — Electron-shell visualization
* **Google Fonts** — Space Grotesk, Inter, and JetBrains Mono

Spectra has **no frontend framework or build system**, keeping the application lightweight and easy to run directly in a browser.

---

## 📂 Project Structure

```text
spectra/
├── index.html      # Main application interface
├── style.css       # Styling and responsive layout
├── app.js          # Application logic and interactions
├── data.js         # Periodic table element dataset
└── README.md       # Project documentation
```

---

## 🔬 What You Can Explore

Selecting an element opens a detailed information panel containing:

### Physical Properties

* Atomic mass
* Physical phase
* Density
* Appearance
* Melting point
* Boiling point
* Molar heat
* Block
* Period
* Group

### Electron Structure

* Electron configuration
* Electron shells
* Electronegativity
* Electron affinity
* First ionization energy
* Visual shell diagram

### Chemical Information

* Reactivity
* Common reactions
* Common compounds
* Chemical formulas

### Historical Information

* Discoverer
* Naming information

---

## 🌈 Spectral Visualization

Each element includes a **simulated spectral fingerprint** generated from deterministic data based on its atomic number and electronegativity.

The visualization is intended as an interactive representation rather than a replacement for experimentally measured emission spectra.

---

## 🔎 Searching

You can search using:

```text
Hydrogen
```

```text
H
```

or:

```text
1
```

The search dynamically filters the periodic table to matching elements.

---

## 🎨 Visualization Modes

Spectra provides two ways to visualize the periodic table:

### Category

Elements are color-coded according to their chemical category, including:

* Alkali metals
* Alkaline earth metals
* Transition metals
* Post-transition metals
* Metalloids
* Reactive nonmetals
* Halogens
* Noble gases
* Lanthanides
* Actinides

### Phase

Elements can also be viewed according to their physical phase at standard conditions:

* Solid
* Liquid
* Gas
* Unknown

---

## ⌨️ Keyboard Controls

When an element information panel is open:

| Key   | Action              |
| ----- | ------------------- |
| `←`   | Previous element    |
| `→`   | Next element        |
| `Esc` | Close element panel |

---

## 💻 Running Locally

Spectra is a static web application, so no backend or package installation is required.

### 1. Clone the repository

```bash
git clone https://github.com/damien222201/spectra.git
```

### 2. Enter the project directory

```bash
cd spectra
```

### 3. Open the application

You can open `index.html` directly in your browser.

For a local development server, you can also use Python:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## 📊 Data

The application contains structured data for the 118 known chemical elements, including:

* Atomic numbers
* Symbols
* Names
* Categories
* Atomic masses
* Periods and groups
* Blocks
* Physical phases
* Density
* Melting and boiling points
* Electron configurations
* Electron shells
* Electronegativity
* Electron affinity
* Ionization energies
* Reactivity information
* Common compounds
* Discovery information

The application also distinguishes between general element information and curated chemistry information.

---

## ⚠️ Scientific Disclaimer

Spectra is an educational and visualization project.

The chemical information presented is intended for **learning and exploration**, not as a substitute for authoritative chemical databases, laboratory references, safety documentation, or professional scientific literature.

Reactivity descriptions are simplified summaries and do not represent a complete reaction inventory.

The spectral fingerprint visualization is **simulated** and should not be interpreted as experimentally measured emission data.

Always consult authoritative sources when using chemical information for laboratory, industrial, medical, or safety-related purposes.

---

## 🗺️ Roadmap

Potential future improvements include:

* [ ] Isotope information
* [ ] Oxidation states
* [ ] More detailed reaction information
* [ ] Interactive periodic trends
* [ ] Real emission-spectrum data
* [ ] Element comparison mode
* [ ] Compound explorer
* [ ] Dark/light theme controls
* [ ] Improved mobile interactions
* [ ] Educational quizzes
* [ ] More detailed references for element data

---

## 🎯 Project Goals

Spectra was created to make exploring the periodic table more interactive and visually engaging.

Instead of presenting the periodic table as a static reference chart, the project combines:

**Chemistry + Data + Visualization + Interactive Web Design**

into a single browser-based experience.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

3. Commit your changes:

```bash
git commit -m "feat: add your feature"
```

4. Push your branch:

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

---

## 📄 License

This project is available under the license included in the repository.

---

## 👨‍💻 Author

**Franklin**

Built under **HeXeNe Corporation**

> **IGNITE REALITY.**

GitHub: [@damien222201](https://github.com/damien222201)

---

⭐ If you find Spectra useful or interesting, consider starring the repository.
