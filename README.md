# **IS–LM Interactive Economic Simulator**

### A React + Vite game that visualizes macroeconomic decisions through interactive UI, animations and real-time feedback.


Este proyecto es un <strong>simulador interactivo basado en el modelo macroeconómico IS–LM</strong>, donde el usuario puede modificar variables económicas (gasto público, impuestos, tasa monetaria, oferta monetaria, etc.) y ver cómo esas decisiones impactan visualmente en la economía del país dentro del juego.
Construido con <strong>React + Vite</strong>, animaciones con <strong>Framer Motion</strong>, componentes UI de **shadcn/ui** y estilos con <strong>TailwindCSS</strong>.
El objetivo del proyecto es combinar **conceptos económicos** con <strong>visualización interactiva</strong>, **gamificación** y una UI moderna.

***

## **Características principales**

### **Interactividad total**

* Sliders dinámicos para controlar variables económicas clave del modelo IS–LM.
* Cambios instantáneos en los indicadores del juego.
* Eventos aleatorios que afectan la economía (crisis, shocks, protestas, bonanza, etc.).

### **Animaciones y efectos visuales**

* Efectos como <em>money rain</em>, alertas, protestas animadas, banners y partículas.
* Transiciones fluidas con <strong>Framer Motion</strong>.
* Feedback visual inmediato según tus decisiones.

### **Lógica del juego**

* Simulación simplificada de política fiscal y monetaria.
* Estado económico basado en equilibrio IS–LM.
* Indicadores: estabilidad, productividad, inflación, apoyo social, crecimiento, etc.
* Estados ganadores/perdedores según la gestión económica.

### **UI moderna**

* Componentes reutilizables (`Card`, `Button`, `Slider`, etc.)
* Diseño limpio y responsivo con **TailwindCSS**
* Arquitectura de carpetas clara y mantenible

***

# **Tecnologías utilizadas**

| Área | Tecnologías |
| ---- | ----------- |
| **Frontend** | React, Vite, JavaScript (ES6+), JSX |
| **UI/Styling** | TailwindCSS, shadcn/ui, Framer Motion |
| **State & Logic** | Hooks (useState, useEffect, useMemo), lógica condicional, sistema de eventos |
| **Build/Tools** | Vite, ESLint, Prettier |
| **Arquitectura** | Componentes UI, `lib/` para lógica, `assets/`, separación limpia de responsabilidades |

***

# **Estructura del proyecto**

```
src/
 ├── assets/
 ├── components/
 │    └── ui/        # Botones, sliders, cards reutilizables
 ├── lib/            # Utilidades & lógica del juego
 ├── App.jsx         # Lógica principal del simulador
 ├── main.jsx
public/
```

Puntos fuertes:

* `components/ui/` muestra criterio y reutilización
* `lib/` separa lógica del render
* `App.jsx` funciona como orquestador principal

***

# **Cómo correrlo localmente**

```
# 1. Clonar el repo
git clone https://github.com/tuusuario/is-lm-game.git

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev
```

***

# **Demo online**
**https://is-lm-juego.vercel.app/**

<br>
***

# **Objetivo educativo**

Este proyecto combina:

* Macroeconomía (modelo IS–LM)
* Diseño interactivo
* Lógica de simulación
* UX basada en feedback visual
* Buenas prácticas de React

Es perfecto para mostrar en entrevistas porque demuestra:

* capacidad de manejar UI compleja
* animaciones
* interacción usuario ↔ estado
* arquitectura ordenada
* diseño propio
* creatividad
* pensamiento técnico

***

# **Autor**

**Pedro Vilamitjana**
Frontend Developer – React · Next.js · TypeScript · Firebase
[pedrovilamitjana98@gmail.com](mailto:pedrovilamitjana98@gmail.com)
[https://linkedin.com/in/pedro-vilamitjana](https://linkedin.com/in/pedro-vilamitjana)
[https://github.com/peter-vilamitjana](https://github.com/peter-vilamitjana)

***

# **Estado del proyecto**

✔ Completado (versión MVP)
⬜ Posibles mejoras: niveles, sistema de puntaje avanzado, gráfica IS–LM real, modo historia.