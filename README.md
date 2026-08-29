# Dynamic Memory Management Visualizer

An interactive web-based simulator for visualizing **page replacement algorithms** and understanding dynamic memory management concepts through step-by-step frame state visualization.

## 📌 Overview

The **Dynamic Memory Management Visualizer** is a CSE-316 project designed to make memory management concepts easier to understand through an interactive interface.

Users can configure the number of memory frames, provide a page reference string, select a page replacement algorithm, and observe how pages are loaded, replaced, and accessed over time.

The visualizer currently supports:

- **FIFO (First-In, First-Out)**
- **LRU (Least Recently Used)**

Each page reference is represented as a step in the simulation, allowing users to observe **page hits, page faults, and frame states**.

---

## ✨ Features

- Configure the number of memory frames
- Enter a custom page reference string
- Simulate **FIFO** page replacement
- Simulate **LRU** page replacement
- Visualize memory frame states step-by-step
- Identify page hits and page faults
- Display total page hits
- Display total page faults
- Adjustable animation speed
- Reset the simulation
- Interactive visualization of memory frames

---

## 🧠 Concepts Covered

This project demonstrates core **Operating Systems** concepts including:

- Dynamic memory management
- Virtual memory
- Paging
- Page replacement
- Page faults
- Page hits
- FIFO page replacement algorithm
- LRU page replacement algorithm
- Memory frame allocation

---

## 🛠️ Tech Stack

- **HTML5** — Application structure
- **CSS3** — Styling and user interface
- **JavaScript** — Simulation logic and interactivity
- **Google Fonts** — Interface typography

No backend or database is required.

---

## ⚙️ How It Works

### 1. Configure Memory

Enter the number of available memory frames.

Example:

```text
Number of Frames: 3
```
### 2. Enter Page Reference String

Provide a comma-separated sequence of page references.

Example:
```text
7,0,1,2,0,3,0,4,2,3,0,3,2
```
### 3. Select an Algorithm

Choose between:

- FIFO
- LRU

### 4. Run the Simulation

The application processes each page reference one at a time.

For every page:

- If the page is already present in memory → Page Hit
- If the page is not present → Page Fault
- If all frames are occupied, the selected replacement algorithm determines which page is replaced.

### 5. Analyze the Results
The simulator displays:

- Total page hits
- Total page faults
- Memory frame states
- Hit and fault status for each reference

---


## 🔄 Algorithms
FIFO — First-In, First-Out
FIFO replaces the page that entered memory first.

It follows a queue-based replacement strategy:
```text
First Page Loaded → First Page Replaced
```
FIFO is simple to implement but does not consider how recently or frequently a page has been accessed.

LRU — Least Recently Used
LRU replaces the page that has not been accessed for the longest period of time.

It uses recent page access history to determine which page should be replaced.
```text
Least Recently Used Page → Replaced First
```
LRU uses the principle of locality of reference to make replacement decisions.

---

## 📊 Example

Using:
```text
Frames = 3

Reference String =
7,0,1,2,0,3,0,4,2,3,0,3,2
```
The simulator processes the reference string one page at a time and records the resulting memory frame state.

Each reference is classified as either:

- PAGE HIT
- PAGE FAULT

The resulting frame states can then be used to understand how FIFO and LRU handle the same page-reference sequence.

---

## 📁 Project Structure
```text
Dynamic-Memory-Visualizer/
│
├── index.html
├── style.css
├── script.js
└── README.md
```
```index.html```
Contains the structure of the application, including:

- Configuration panel
- Number of frames input
- Page reference string input
- Algorithm selection
- Simulation controls
- Statistics cards
- Visualization area

```style.css```
Controls the visual appearance of the application, including:

- Dark-themed interface
- Layout
- Buttons
- Input fields
- Statistics cards
- Page hit/fault indicators
- Typography
- Memory visualization styling

```script.js```
Contains the simulation and interaction logic, including:

- Input validation
- FIFO implementation
- LRU implementation
- Simulation state management
- Page hit/fault calculation
- Frame state generation
- Visualization updates
- Reset functionality

---

## 🚀 Getting Started

Prerequisites
No special dependencies are required.

A modern web browser is sufficient.

Run Locally
Clone the repository:
```text
git clone https://github.com/himanshiyadav605/Dynamic-Memory-Visualizer.git
```
Navigate to the project directory:
```text
cd Dynamic-Memory-Visualizer
```
Open ```index.html``` in your browser.

You can also use VS Code Live Server for local development.

---

## 🎯 Project Objective

The objective of this project is to provide an interactive way to understand page replacement and memory management instead of relying only on theoretical examples.

The visualization helps demonstrate:

- When page faults occur
- When page hits occur
- How pages are loaded into memory
- How pages are replaced
- How FIFO and LRU differ
- How memory frames change after each page reference

---

## 🔮 Future Improvements
The project can be extended with:

- Optimal Page Replacement
- Clock / Second-Chance Algorithm
- Step-by-step playback controls
- Previous/Next simulation steps
- FIFO vs LRU comparison
- Page fault graph
- Hit-rate visualization
- Performance statistics
- Responsive mobile interface
- Detailed explanation of each replacement decision
- Improved simulation controls
