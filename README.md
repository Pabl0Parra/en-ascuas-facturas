# 🔥 En Ascuas - Facturación / Billing App

<div align="center">

**Professional mobile application for generating invoices and quotes**  
**Aplicación móvil profesional para la generación de facturas y presupuestos**

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Pabl0Parra_en-ascuas-facturas&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Pabl0Parra_en-ascuas-facturas)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=flat&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0-000020?style=flat&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)

[English](#english) | [Español](#español)

</div>

---

# English

## 📋 Table of Contents

- [Description](#-description)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)

---

## 📖 Description

**En Ascuas** is a modern and professional mobile application designed for small businesses and freelancers who need to create invoices and quotes quickly, elegantly, and without complications.

The application allows you to:

- ✅ Create professional invoices and quotes in PDF
- ✅ Manage clients with all their tax information
- ✅ Store and view complete document history
- ✅ Share documents directly from the app
- ✅ Work offline (offline-first)

---

## ✨ Features

### 📄 Document Management

- **Invoices**: Create invoices with custom numbering
- **Quotes**: Generate quotes with or without document number
- **Flexible VAT**: Support for 21% VAT and Reverse Charge (0%)
- **Line Items**: Add multiple lines with description, quantity, unit price, and amount
- **Comments**: Free text field for payment terms and additional notes

### 👥 Client Management

- Local storage of client data
- Complete information: name, address, Tax ID, contact
- Persistent clients for reuse
- Optional client for quotes

### 📱 User Interface

- **Modern Design**: Clean UI with corporate orange/red color scheme
- **Intuitive Navigation**: Bottom tab bar with clear icons
- **Adaptive Forms**: Auto-scroll when keyboard is open
- **Visual Feedback**: Real-time form validation

### 📊 History

- Filter by type (All, Invoices, Quotes)
- View saved documents
- Delete documents
- Quick access to generated PDFs

### 🎨 Professional PDFs

- Corporate design with "En Ascuas" logo
- A4 format optimized for printing
- Complete tax information
- Automatic calculations of totals and VAT
- Direct export and sharing

---

## 🖼 Screenshots

> _Add screenshots here_

---

## 🛠 Technologies

### Frontend

- **[React Native](https://reactnative.dev/)** `0.81.5` - Mobile development framework
- **[Expo](https://expo.dev/)** `~54.0` - Toolchain and SDK for React Native
- **[TypeScript](https://www.typescriptlang.org/)** `5.8` - Static typing
- **[Expo Router](https://docs.expo.dev/router/introduction/)** `6.0` - File-based navigation

### State Management

- **[Zustand](https://github.com/pmndrs/zustand)** `5.0` - Lightweight and modern state management
  - `clientStore` - Client management
  - `documentStore` - Document metadata management
  - `formStore` - Document form state

### Storage and Files

- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)** - Data persistence
- **[Expo File System](https://docs.expo.dev/versions/latest/sdk/filesystem/)** - File management
- **[Expo Print](https://docs.expo.dev/versions/latest/sdk/print/)** - PDF generation
- **[Expo Sharing](https://docs.expo.dev/versions/latest/sdk/sharing/)** - Document sharing

### UI/UX

- **[React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)** - Notch/edge support
- **[Keyboard Aware ScrollView](https://github.com/APSL/react-native-keyboard-aware-scroll-view)** - Auto-scroll with keyboard
- **[Ionicons](https://ionic.io/ionicons)** - Vector icons

---

## 🚀 Installation

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn**
- **Expo CLI** (installed automatically)
- **Expo Go** app on your mobile device (optional, for testing)

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/en-ascuas-facturas.git
cd en-ascuas-facturas
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure company information**

Edit `src/constants/company.ts` with your company data:

```typescript
export const COMPANY = {
  nombre: "YOUR COMPANY",
  direccion: "YOUR ADDRESS",
  codigoPostal: "POSTAL CODE",
  ciudad: "CITY",
  provincia: "STATE/PROVINCE",
  nif: "TAX ID",
  metodoPago: "BANK TRANSFER",
  iban: "ES00-0000-0000-0000-0000-0000",
};
```

4. **Start development server**

```bash
npm start
```

5. **Run on device/simulator**

- **Android**: Press `a` or run `npm run android`
- **iOS**: Press `i` or run `npm run ios`
- **Web**: Press `w` or run `npm run web`
- **Expo Go**: Scan QR from Expo Go app

---

## 📱 Usage

### Create an Invoice

1. Go to home screen
2. Tap **"Nueva Factura"**
3. Fill in document number and date
4. Select or create a client
5. Add product/service lines
6. Adjust VAT if needed
7. Add comments (optional)
8. Tap **"Generar PDF"**
9. Share the generated document

### Create a Quote

1. Go to home screen
2. Tap **"Nuevo Presupuesto"**
3. Fill in data (document number is optional)
4. Client is optional for quotes
5. Complete the rest of the form
6. Generate and share PDF

---

## 📜 Available Scripts

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web

# Clear Expo cache
npx expo start -c
```

---

## 📄 License

Private - All rights reserved © 2026 En Ascuas

---

## 👨‍💻 Author

**Pabl0Parra**

---

<div align="center">

**Made with ❤️ and 🔥 in React Native**

[⬆ Back to top](#-en-ascuas---facturación--billing-app)

</div>

---

---

# Español

## 📋 Tabla de Contenidos

- [Descripción](#-descripción-1)
- [Características](#-características-1)
- [Capturas](#-capturas-1)
- [Tecnologías](#-tecnologías-1)
- [Instalación](#-instalación-1)
- [Uso](#-uso-1)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles-1)

---

## 📖 Descripción

**En Ascuas** es una aplicación móvil moderna y profesional diseñada para pequeños negocios y autónomos que necesitan crear facturas y presupuestos de forma rápida, elegante y sin complicaciones.

La aplicación permite:

- ✅ Crear facturas y presupuestos profesionales en PDF
- ✅ Gestionar clientes con toda su información fiscal
- ✅ Almacenar y consultar el historial completo de documentos
- ✅ Compartir documentos directamente desde la app
- ✅ Trabajar sin conexión (offline-first)

---

## ✨ Características

### 📄 Gestión de Documentos

- **Facturas**: Creación de facturas con numeración personalizada
- **Presupuestos**: Generación de presupuestos con o sin número de documento
- **IVA Flexible**: Soporte para IVA 21% e Inversión del Sujeto Pasivo (0%)
- **Líneas de Detalle**: Añade múltiples líneas con descripción, cantidad, precio unitario e importe
- **Observaciones**: Campo de texto libre para condiciones de pago y notas adicionales

### 👥 Gestión de Clientes

- Almacenamiento local de datos de clientes
- Información completa: nombre, dirección, NIF/CIF, contacto
- Clientes persistentes para reutilización
- Cliente opcional para presupuestos

### 📱 Interfaz de Usuario

- **Diseño Moderno**: UI limpia con el esquema de colores corporativo naranja/rojo
- **Navegación Intuitiva**: Tab bar inferior con iconos claros
- **Formularios Adaptativos**: Scroll automático cuando el teclado está abierto
- **Feedback Visual**: Validación en tiempo real de formularios

### 📊 Historial

- Filtrado por tipo (Todos, Facturas, Presupuestos)
- Visualización de documentos guardados
- Eliminación de documentos
- Rápido acceso a PDFs generados

### 🎨 PDFs Profesionales

- Diseño corporativo con logo "En Ascuas"
- Formato A4 optimizado para impresión
- Información fiscal completa
- Cálculos automáticos de totales e IVA
- Exportación y compartición directa

---

## 🖼 Capturas

> _Añade aquí capturas de pantalla de la aplicación_

---

## 🛠 Tecnologías

### Frontend

- **[React Native](https://reactnative.dev/)** `0.81.5` - Framework de desarrollo móvil
- **[Expo](https://expo.dev/)** `~54.0` - Toolchain y SDK para React Native
- **[TypeScript](https://www.typescriptlang.org/)** `5.8` - Tipado estático
- **[Expo Router](https://docs.expo.dev/router/introduction/)** `6.0` - Navegación basada en archivos

### Gestión de Estado

- **[Zustand](https://github.com/pmndrs/zustand)** `5.0` - Gestión de estado ligera y moderna
  - `clientStore` - Gestión de clientes
  - `documentStore` - Gestión de metadatos de documentos
  - `formStore` - Estado del formulario de documentos

### Almacenamiento y Archivos

- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)** - Persistencia de datos
- **[Expo File System](https://docs.expo.dev/versions/latest/sdk/filesystem/)** - Gestión de archivos
- **[Expo Print](https://docs.expo.dev/versions/latest/sdk/print/)** - Generación de PDFs
- **[Expo Sharing](https://docs.expo.dev/versions/latest/sdk/sharing/)** - Compartir documentos

### UI/UX

- **[React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)** - Soporte para notch/bordes
- **[Keyboard Aware ScrollView](https://github.com/APSL/react-native-keyboard-aware-scroll-view)** - Scroll automático con teclado
- **[Ionicons](https://ionic.io/ionicons)** - Iconos vectoriales

### Utilidades

- **[date-fns](https://date-fns.org/)** - Manipulación de fechas

---

## 🚀 Instalación

### Prerrequisitos

- **Node.js** >= 18.x
- **npm** o **yarn**
- **Expo CLI** (se instalará automáticamente)
- **Expo Go** app en tu dispositivo móvil (opcional, para testing)

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/tuusuario/en-ascuas-facturas.git
cd en-ascuas-facturas
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar información de empresa**

Edita el archivo `src/constants/company.ts` con los datos de tu empresa:

```typescript
export const COMPANY = {
  nombre: "TU EMPRESA",
  direccion: "TU DIRECCIÓN",
  codigoPostal: "CÓDIGO",
  ciudad: "CIUDAD",
  provincia: "PROVINCIA",
  nif: "NIF/CIF",
  metodoPago: "TRANSFERENCIA",
  iban: "ES00-0000-0000-0000-0000-0000",
};
```

4. **Iniciar el servidor de desarrollo**

```bash
npm start
```

5. **Ejecutar en dispositivo/simulador**

- **Android**: Presiona `a` o ejecuta `npm run android`
- **iOS**: Presiona `i` o ejecuta `npm run ios`
- **Web**: Presiona `w` o ejecuta `npm run web`
- **Expo Go**: Escanea el QR desde la app Expo Go

---

## 📱 Uso

### Crear una Factura

1. Ve a la pantalla principal
2. Tap en **"Nueva Factura"**
3. Rellena el número de documento y fecha
4. Selecciona o crea un cliente
5. Añade líneas de productos/servicios
6. Ajusta el IVA si es necesario
7. Añade observaciones (opcional)
8. Tap en **"Generar PDF"**
9. Comparte el documento generado

### Crear un Presupuesto

1. Ve a la pantalla principal
2. Tap en **"Nuevo Presupuesto"**
3. Rellena los datos (el número de documento es opcional)
4. El cliente es opcional para presupuestos
5. Completa el resto del formulario
6. Genera y comparte el PDF

### Gestionar Clientes

1. Ve a la pestaña **"Clientes"**
2. Tap en **"+"** para añadir nuevo cliente
3. Rellena la información del cliente
4. Los clientes se guardan automáticamente

### Ver Historial

1. Ve a la pestaña **"Historial"**
2. Filtra por Facturas, Presupuestos o ver Todos
3. Tap en un documento para abrirlo
4. Usa el icono de papelera para eliminar

---

## 📁 Estructura del Proyecto

```
en-ascuas-facturas/
├── app/                          # Pantallas y navegación (Expo Router)
│   ├── (tabs)/                   # Navegación por pestañas
│   │   ├── index.tsx            # Pantalla principal (home)
│   │   ├── clientes.tsx         # Listado de clientes
│   │   ├── historial.tsx        # Historial de documentos
│   │   ├── pdf-viewer.tsx       # Visor de PDFs
│   │   └── _layout.tsx          # Layout de tabs
│   ├── cliente/
│   │   ├── nuevo.tsx            # Crear nuevo cliente
│   │   └── [id].tsx             # Editar cliente
│   ├── documento/
│   │   └── nuevo.tsx            # Crear documento
│   └── _layout.tsx              # Layout raíz
│
├── src/
│   ├── components/              # Componentes React
│   │   ├── cliente/            # Componentes de clientes
│   │   ├── documento/          # Componentes de documentos
│   │   ├── historial/          # Componentes de historial
│   │   └── ui/                 # Componentes UI reutilizables
│   │
│   ├── constants/              # Constantes y configuración
│   │   ├── company.ts          # Datos de la empresa
│   │   ├── logo.ts             # Logo en Base64
│   │   ├── strings.ts          # Textos de la app
│   │   └── theme.ts            # Colores y estilos
│   │
│   ├── services/               # Lógica de negocio
│   │   ├── fileService.ts      # Gestión de archivos
│   │   └── pdfGenerator.ts     # Generación de PDFs
│   │
│   ├── stores/                 # Estado global (Zustand)
│   │   ├── clientStore.ts      # Store de clientes
│   │   ├── documentStore.ts    # Store de documentos
│   │   └── formStore.ts        # Store del formulario
│   │
│   ├── types/                  # Definiciones TypeScript
│   │   ├── client.ts
│   │   └── document.ts
│   │
│   └── utils/                  # Utilidades
│       ├── calculations.ts     # Cálculos de IVA y totales
│       ├── formatters.ts       # Formateo de datos
│       ├── idGenerator.ts      # Generación de IDs y nombres
│       └── validation.ts       # Validaciones
│
├── assets/                     # Recursos estáticos
├── package.json
├── tsconfig.json
├── app.json                    # Configuración de Expo
└── README.md
```

---

## 📜 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en Web
npm run web

# Limpiar caché de Expo
npx expo start -c
```

---

## 🔧 Configuración Avanzada

### Cambiar el Logo

Reemplaza el logo en Base64 en `src/constants/logo.ts`:

```typescript
export const LOGO_BASE64 = "TU_IMAGEN_EN_BASE64";
```

### Personalizar Colores

Edita `src/constants/theme.ts` para cambiar el esquema de colores:

```typescript
export const COLORS = {
  primary: "#FF4500", // Color principal
  primaryDark: "#CC3700", // Variante oscura
  // ...
};
```

### Modificar Strings

Todos los textos de la app están centralizados en `src/constants/strings.ts`.

---

## 🐛 Problemas Conocidos

- **PDF Viewer en iOS**: En algunos dispositivos iOS, el visor de PDFs puede tardar en cargar
- **Teclado en Android**: Asegúrate de tener `android:windowSoftInputMode="adjustResize"` en AndroidManifest

---

## 📄 Licencia

Privado - Todos los derechos reservados © 2026 En Ascuas

---

## 👨‍💻 Autor

**Pabl0Parra**

---

## 📞 Soporte

Para soporte y consultas, contacta a través de los canales internos de la empresa.

---

<div align="center">

**Hecho por Pabl0Parra© con ❤️ y 🔥 en React Native**

[⬆ Volver arriba](#-en-ascuas---facturación--billing-app)

</div>
