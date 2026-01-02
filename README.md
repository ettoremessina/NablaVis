# NablaVis

**NablaVis** is an interactive educational tool designed to visualize and verify fundamental theorems of vector calculus: the Gradient Theorem, Curl Theorem, and the Divergence Theorem.

This application provides 3D interactive scenes where users can explore different scalar and vector fields, manipulate paths and surfaces, and see real-time numerical verification of the integrals.

🌐 **Deployed WebApp**: [https://computationalmindset.com/apps/NablaVis](https://computationalmindset.com/apps/NablaVis)

📘 **Additional Information**: [https://computationalmindset.com/en/mathematics/nablavis-stokes-theorem.html](https://computationalmindset.com/en/mathematics/nablavis-stokes-theorem.html)

---

## 🤖 AI Attribution
This project was written with **Gemini 3** inside the **Antigravity** IDE.

---

## Features

### 1. Gradient Theorem
*   **Visual**: A 3D scalar field (height map) with a path connecting two points, $P$ and $Q$.
*   **Interaction**: Click anywhere on the ground or surface to move the nearest point ($P$ or $Q$).
*   **Verification**: Displays $f(Q) - f(P)$ and verifies it equals the line integral $\int \nabla f \cdot d\mathbf{r}$.
*   **Presets**: Paraboloid, Saddle Surface, Gaussian Peak, Hill & Valley.

### 2. Curl Theorem
*   **Visual**: A 2D vector field on the $xy$-plane with a circular path and surface.
*   **Verification**: Compares the circulation $\oint \mathbf{F} \cdot d\mathbf{r}$ (LHS) with the flux of the curl $\iint (\nabla \times \mathbf{F}) \cdot d\mathbf{S}$ (RHS).
*   **Presets**: Simple Rotation, Shear Flow, Expanding Spiral, Saddle Field.

### 3. Divergence Theorem
*   **Visual**: A 3D vector field passing through a spherical surface.
*   **Verification**: Compares the total flux $\iint_{\partial V} \mathbf{F} \cdot d\mathbf{S}$ (LHS) with the volume integral of divergence $\iiint (\nabla \cdot \mathbf{F}) dV$ (RHS).
*   **Presets**: Source (Point Charge), Sink, Uniform Field, Vertical Expansion.

### 4. General Features
*   **Multilingual**: Fully localized in English and Italian.
*   **Real-time HUD**: Displays formulas, calculated values, and theorem verification instantly.
*   **Responsive**: Works on desktop and mobile.

---

## Technologies Used
*   **React** (v18)
*   **TypeScript**
*   **Vite**
*   **Three.js** / **@react-three/fiber** / **@react-three/drei** (3D Rendering)
*   **React Router** (HashRouter for portable deployment)

---

## Installation & Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/NablaVis.git
    cd NablaVis
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run development server**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```
    The output will be in the `dist/` folder, ready to be deployed to any static host or subfolder.

---

## License
[MIT](LICENSE)
