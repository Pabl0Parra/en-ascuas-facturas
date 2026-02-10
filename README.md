# 📱 Bilio - Professional Invoicing App

<div align="center">

**Privacy-first mobile application for creating invoices and quotes**
**Aplicación móvil orientada a la privacidad para crear facturas y presupuestos**

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Pabl0Parra_en-ascuas-facturas&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Pabl0Parra_en-ascuas-facturas)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=flat&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0-000020?style=flat&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-227%20passing-success)](./src/__tests__)

[English](#english) | [Español](#español)

</div>

---

# English

## 📋 Table of Contents

- [Description](#-description)
- [Features](#-features)
- [Privacy First](#-privacy-first)
- [Screenshots](#-screenshots)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Development Phases](#-development-phases)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 Description

**Bilio** is a modern, privacy-first mobile application designed for freelancers, small businesses, and entrepreneurs who need to create professional invoices and quotes quickly, elegantly, and without complications.

### What Makes Bilio Different?

- 🔒 **100% Private** - Your data NEVER leaves your device
- 📴 **Offline-First** - Works perfectly without internet
- 🚫 **No Accounts** - No sign-up, no cloud, no tracking
- 🌍 **Global Ready** - Multiple languages and currencies
- 💼 **Professional** - Beautiful PDF templates with custom branding
- ⚡ **Fast** - Setup in under 2 minutes

---

## ✨ Features

### 📄 Document Management

- **Professional Invoices** - Create invoices with automatic numbering
- **Custom Quotes** - Generate quotes with flexible numbering
- **Flexible Tax System** - Support for any tax rate, any country
- **Line Items** - Multiple lines with description, quantity, price, and amount
- **Comments** - Free text for payment terms and additional notes
- **Document Templates** - Save frequently used documents as templates
- **Recurring Invoices** - Automate monthly, quarterly, or yearly billing

### 👥 Enhanced Client Management

- Complete client profiles with tax information
- Client tags and categorization
- Revenue tracking per client
- Search and filter clients
- Client-level defaults (currency, tax treatment)
- Usage statistics (total invoiced, last invoice date)

### 📊 Business Dashboard

- Real-time statistics (monthly and all-time)
- Revenue tracking
- Recent documents with status badges
- Overdue invoice alerts
- Recurring invoice notifications
- Quick actions for common tasks

### 🎨 Professional PDFs

- **3 Beautiful Templates** - Classic, Modern, Minimal
- Custom branding with your logo
- Primary color customization
- A4 format optimized for printing
- Multi-language support (PDFs in 5+ languages)
- Multi-currency formatting

### 🌍 Multi-Language & Multi-Currency

- **Languages**: English, Spanish, French, German, Portuguese
- **Currencies**: EUR, USD, GBP, CAD, AUD, and more
- **Smart Defaults**: Auto-configure based on country selection
- **Flexible Tax System**: Works in any country with any tax rules

### 📈 Document Status Tracking

- **Lifecycle States**: Draft, Sent, Viewed, Paid, Overdue, Cancelled
- **Automatic Overdue Detection**: Based on due dates
- **Payment Tracking**: Record payment method and date
- **Visual Status Badges**: Color-coded indicators

### ⚙️ Settings & Configuration

- Business profile management
- Custom branding (logo, colors, templates)
- Tax configuration with presets
- Language and regional settings
- Data export/import for backups
- Privacy policy access

---

## 🔒 Privacy First

Bilio is built with privacy as a core principle, not an afterthought.

### What We DON'T Do

- ❌ No user accounts
- ❌ No cloud storage
- ❌ No data collection
- ❌ No analytics or tracking
- ❌ No third-party data sharing
- ❌ No advertisements

### What We DO

- ✅ All data stays on YOUR device
- ✅ AsyncStorage for local persistence
- ✅ Offline-first architecture
- ✅ You control exports and sharing
- ✅ Transparent open-source code
- ✅ Complete privacy policy available in-app

**Bottom Line:** Your business data is YOUR data. We never see it, never store it, never share it.

---

## 🖼 Screenshots

> _App Store screenshots coming soon_

---

## 🛠 Technologies

### Core

- **[React Native](https://reactnative.dev/)** `0.81.5` - Mobile development framework
- **[Expo](https://expo.dev/)** `~54.0` - Toolchain and SDK for React Native
- **[TypeScript](https://www.typescriptlang.org/)** `5.8` - Static typing
- **[Expo Router](https://docs.expo.dev/router/introduction/)** `6.0` - File-based navigation

### State Management

- **[Zustand](https://github.com/pmndrs/zustand)** `5.0` - Lightweight state management
  - `businessProfileStore` - Business profile and branding
  - `clientStore` - Client management
  - `documentStore` - Document metadata
  - `templateStore` - Document templates
  - `recurringStore` - Recurring invoice rules
  - `taxConfigStore` - Tax presets
  - `formStore` - Form state

### Storage and Files

- **[AsyncStorage](https://react-native-async-storage.github.io/async-storage/)** - Local data persistence
- **[Expo File System](https://docs.expo.dev/versions/latest/sdk/filesystem/)** - File management
- **[Expo Print](https://docs.expo.dev/versions/latest/sdk/print/)** - PDF generation
- **[Expo Sharing](https://docs.expo.dev/versions/latest/sdk/sharing/)** - Document sharing
- **[Expo Document Picker](https://docs.expo.dev/versions/latest/sdk/document-picker/)** - Data import

### Internationalization

- **[i18next](https://www.i18next.com/)** `25.8` - Translation framework
- **[react-i18next](https://react.i18next.com/)** `16.5` - React bindings
- **[expo-localization](https://docs.expo.dev/versions/latest/sdk/localization/)** - Device locale detection

### UI/UX

- **[React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)** - Notch/edge support
- **[Keyboard Aware ScrollView](https://github.com/APSL/react-native-keyboard-aware-scroll-view)** - Auto-scroll with keyboard
- **[Ionicons](https://ionic.io/ionicons)** - Vector icons
- **[Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)** - Logo upload

### Utilities

- **[date-fns](https://date-fns.org/)** `4.1` - Date manipulation
- **[Jest](https://jestjs.io/)** `30.2` - Testing framework
- **[ts-jest](https://kulshekhar.github.io/ts-jest/)** `29.4` - TypeScript Jest integration

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
git clone https://github.com/yourusername/Bilio-app.git
cd Bilio-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm start
```

4. **Run on device/simulator**

- **Android**: Press `a` or run `npm run android`
- **iOS**: Press `i` or run `npm run ios`
- **Web**: Press `w` or run `npm run web`
- **Expo Go**: Scan QR from Expo Go app

5. **Complete onboarding**

On first launch, you'll be guided through a 6-step onboarding process:

- Welcome & Language Selection
- Business Information
- Branding (Logo & Colors)
- Financial Setup (Currency & Tax)
- Document Numbering
- Review & Confirm

---

## 📱 Usage

### First-Time Setup

1. Open the app
2. Select your language
3. Enter your business information
4. Upload your logo (optional)
5. Choose your currency and default tax rate
6. Set invoice/quote numbering preferences
7. Start creating documents!

### Create an Invoice

1. Tap **"New Invoice"** from home or quick actions
2. Select a client (or create new)
3. Fill in document number and date
4. Add line items (description, quantity, price)
5. Adjust tax rate if needed
6. Add comments (optional)
7. Tap **"Generate PDF"**
8. Share via any app

### Create a Quote

1. Tap **"New Quote"**
2. Follow same process as invoice
3. Document number is optional
4. Client is optional

### Use Document Templates

1. Create a document as usual
2. Tap **"Save as Template"**
3. Give it a name
4. Next time, tap **"From Template"** to reuse

### Set Up Recurring Invoices

1. Create a document template
2. Go to Recurring section
3. Create recurring rule
4. Set frequency (weekly, monthly, quarterly, yearly)
5. App auto-generates invoices on schedule

### Manage Clients

1. Go to **"Clients"** tab
2. Tap **"+"** to add new client
3. Fill in client information
4. Add tags for organization
5. View client statistics (revenue, invoice count)

### View Dashboard

1. Home screen shows:
   - This month's statistics
   - Recent documents
   - Overdue alerts
   - Recurring invoice notifications
   - Quick actions

---

## 📁 Project Structure

```
Bilio-app/
├── app/                          # Screens and navigation (Expo Router)
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.tsx            # Home dashboard
│   │   ├── clientes.tsx         # Clients list
│   │   └── historial.tsx        # Document history
│   ├── cliente/
│   │   ├── nuevo.tsx            # New client
│   │   └── [id].tsx             # Edit client
│   ├── documento/
│   │   └── nuevo.tsx            # New document
│   ├── onboarding.tsx           # Onboarding flow
│   ├── privacy.tsx              # Privacy policy screen
│   ├── about.tsx                # About screen
│   └── _layout.tsx              # Root layout with error boundary
│
├── src/
│   ├── components/              # React components
│   │   ├── onboarding/         # Onboarding wizard steps
│   │   ├── migration/          # Migration screens
│   │   ├── dashboard/          # Dashboard components
│   │   ├── cliente/            # Client components
│   │   ├── documento/          # Document components
│   │   ├── historial/          # History components
│   │   ├── settings/           # Settings components
│   │   ├── ui/                 # Reusable UI components
│   │   └── ErrorBoundary.tsx   # Error handling
│   │
│   ├── i18n/                   # Internationalization
│   │   ├── index.ts            # i18n configuration
│   │   └── locales/            # Translation files
│   │       ├── en.json
│   │       ├── es.json
│   │       ├── fr.json
│   │       ├── de.json
│   │       └── pt.json
│   │
│   ├── config/                 # Configuration
│   │   ├── currencyConfig.ts   # Currency formatting
│   │   └── countryDefaults.ts  # Country-based defaults
│   │
│   ├── constants/              # Constants
│   │   ├── logo.ts             # Logo (legacy)
│   │   ├── strings.ts          # Strings (legacy)
│   │   └── theme.ts            # Colors and styles
│   │
│   ├── services/               # Business logic
│   │   ├── fileService.ts      # File management
│   │   ├── pdfGenerator.ts     # PDF generation
│   │   ├── dashboardService.ts # Dashboard statistics
│   │   ├── migrationService.ts # Data migration
│   │   └── recurringService.ts # Recurring invoices
│   │
│   ├── services/pdfTemplates/  # PDF templates
│   │   ├── classic.ts
│   │   ├── modern.ts
│   │   └── minimal.ts
│   │
│   ├── stores/                 # Zustand stores
│   │   ├── businessProfileStore.ts
│   │   ├── clientStore.ts
│   │   ├── documentStore.ts
│   │   ├── templateStore.ts
│   │   ├── recurringStore.ts
│   │   ├── taxConfigStore.ts
│   │   └── formStore.ts
│   │
│   ├── types/                  # TypeScript definitions
│   │   ├── businessProfile.ts
│   │   ├── client.ts
│   │   ├── document.ts
│   │   ├── template.ts
│   │   ├── recurring.ts
│   │   ├── tax.ts
│   │   └── currency.ts
│   │
│   ├── utils/                  # Utilities
│   │   ├── calculations.ts     # Tax and total calculations
│   │   ├── formatters.ts       # Data formatting
│   │   ├── currencyFormatter.ts # Currency formatting
│   │   ├── idGenerator.ts      # ID and filename generation
│   │   └── validation.ts       # Form validation
│   │
│   └── __tests__/              # Test files
│       ├── integration/        # Integration tests
│       └── unit/               # Unit tests
│
├── assets/                     # Static resources
├── docs/                       # Documentation
│   ├── CLAUDE.md              # Project instructions
│   ├── PHASE_*.md             # Phase summaries
│   └── APP_STORE_ASSETS.md    # Marketing materials
│
├── package.json
├── tsconfig.json
├── app.json                    # Expo configuration
├── jest.config.js              # Jest configuration
└── README.md                   # This file
```

---

## 📜 Available Scripts

```bash
# Development
npm start                  # Start Expo dev server
npm run android            # Run on Android
npm run ios                # Run on iOS
npm run web                # Run on Web
npx expo start -c          # Clear cache and start

# Testing
npm test                   # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage

# Code Quality
npx eslint .               # Lint code
npx prettier --write .     # Format code
```

---

## 🚀 Development Phases

Bilio was built in 4 major phases over 14 weeks:

### Phase 1: Core Genericization (Weeks 1-7)

- ✅ Business profile & onboarding
- ✅ Tax system abstraction
- ✅ Multi-language (i18n)
- ✅ Multi-currency
- ✅ Dynamic PDF templates
- ✅ Migration service

### Phase 2: Power Features (Weeks 8-10)

- ✅ Document templates
- ✅ Recurring invoices
- ✅ Template picker UI
- ✅ Recurring rules management

### Phase 3: UX & Quality of Life (Weeks 11-13)

- ✅ Settings screen
- ✅ Data export/import
- ✅ Enhanced client management
- ✅ Home screen dashboard
- ✅ Document status tracking

### Phase 4: App Store Readiness (Week 14)

- ✅ Complete app rebranding
- ✅ Privacy policy
- ✅ About screen
- ✅ Error boundary
- ✅ Marketing materials
- ✅ Store configurations

**Total:** 227 passing tests, 15,000+ lines of code, 100+ components

See [CLAUDE.md](./CLAUDE.md) for the full implementation plan and [PHASE\_\*.md](./docs/) files for detailed phase summaries.

---

## 🧪 Testing

```bash
# Run all 227 tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

**Test Coverage:**

- ✅ All stores (Zustand)
- ✅ All services (PDF, migration, dashboard, recurring)
- ✅ All utilities (calculations, formatters, validators)
- ✅ All configuration (currency, country defaults, tax)
- ✅ Integration tests (Phase 1 flow)

---

## 🐛 Known Limitations

1. **App Icon** - Using placeholder, needs professional design
2. **Screenshots** - Marketing materials ready, screenshots not yet taken
3. **Monetization** - Currently free, no IAP implemented
4. **Additional Languages** - Currently EN + ES, can add FR, DE, PT
5. **PDF Templates** - 3 templates, more can be added

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details

Copyright © 2026 Bilio

---

## 👨‍💻 Author

**Pabl0Parra**

- GitHub: [@Pabl0Parra](https://github.com/Pabl0Parra)
- Original Project: Bilio (private business tool)
- Bilio: Generic public release

---

## 📞 Support

- **Email**: support@Bilio.app
- **GitHub Issues**: [Report a bug](https://github.com/yourusername/Bilio-app/issues)
- **Privacy Policy**: Available in-app under About → Privacy Policy

---

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- React Native community
- All open-source contributors
- Beta testers (coming soon)

---

<div align="center">

**Made with ❤️ and privacy in mind**

[⬆ Back to top](#-Bilio---professional-invoicing-app)

</div>

---

---

# Español

## 📋 Tabla de Contenidos

- [Descripción](#-descripción-1)
- [Características](#-características-1)
- [Privacidad Primero](#-privacidad-primero-1)
- [Capturas](#-capturas-1)
- [Tecnologías](#-tecnologías-1)
- [Instalación](#-instalación-1)
- [Uso](#-uso-1)
- [Estructura del Proyecto](#-estructura-del-proyecto-1)
- [Scripts Disponibles](#-scripts-disponibles-1)
- [Fases de Desarrollo](#-fases-de-desarrollo-1)
- [Contribuir](#-contribuir-1)
- [Licencia](#-licencia-1)

---

## 📖 Descripción

**Bilio** es una aplicación móvil moderna y orientada a la privacidad, diseñada para autónomos, pequeñas empresas y emprendedores que necesitan crear facturas y presupuestos profesionales de forma rápida, elegante y sin complicaciones.

### ¿Qué Hace Diferente a Bilio?

- 🔒 **100% Privado** - Tus datos NUNCA salen de tu dispositivo
- 📴 **Offline-First** - Funciona perfectamente sin internet
- 🚫 **Sin Cuentas** - Sin registro, sin nube, sin rastreo
- 🌍 **Global** - Múltiples idiomas y monedas
- 💼 **Profesional** - Plantillas PDF hermosas con marca personalizada
- ⚡ **Rápido** - Configuración en menos de 2 minutos

---

## ✨ Características

### 📄 Gestión de Documentos

- **Facturas Profesionales** - Crea facturas con numeración automática
- **Presupuestos Personalizados** - Genera presupuestos con numeración flexible
- **Sistema de Impuestos Flexible** - Soporte para cualquier tasa de impuesto, cualquier país
- **Líneas de Detalle** - Múltiples líneas con descripción, cantidad, precio e importe
- **Observaciones** - Texto libre para condiciones de pago y notas adicionales
- **Plantillas de Documentos** - Guarda documentos de uso frecuente como plantillas
- **Facturas Recurrentes** - Automatiza la facturación mensual, trimestral o anual

### 👥 Gestión Mejorada de Clientes

- Perfiles completos de clientes con información fiscal
- Etiquetas y categorización de clientes
- Seguimiento de ingresos por cliente
- Búsqueda y filtrado de clientes
- Valores predeterminados por cliente (moneda, tratamiento fiscal)
- Estadísticas de uso (total facturado, última factura)

### 📊 Panel de Control

- Estadísticas en tiempo real (mensuales y totales)
- Seguimiento de ingresos
- Documentos recientes con insignias de estado
- Alertas de facturas vencidas
- Notificaciones de facturas recurrentes
- Acciones rápidas para tareas comunes

### 🎨 PDFs Profesionales

- **3 Plantillas Hermosas** - Clásica, Moderna, Minimalista
- Marca personalizada con tu logo
- Personalización del color principal
- Formato A4 optimizado para impresión
- Soporte multiidioma (PDFs en 5+ idiomas)
- Formateo de múltiples monedas

### 🌍 Multiidioma y Multidivisa

- **Idiomas**: Inglés, Español, Francés, Alemán, Portugués
- **Monedas**: EUR, USD, GBP, CAD, AUD, y más
- **Valores Inteligentes**: Auto-configuración según selección de país
- **Sistema de Impuestos Flexible**: Funciona en cualquier país con cualquier regla fiscal

### 📈 Seguimiento de Estado de Documentos

- **Estados del Ciclo de Vida**: Borrador, Enviado, Visto, Pagado, Vencido, Cancelado
- **Detección Automática de Vencidos**: Basada en fechas de vencimiento
- **Seguimiento de Pagos**: Registra método y fecha de pago
- **Insignias Visuales de Estado**: Indicadores codificados por colores

### ⚙️ Ajustes y Configuración

- Gestión del perfil empresarial
- Marca personalizada (logo, colores, plantillas)
- Configuración fiscal con preajustes
- Configuración de idioma y región
- Exportación/importación de datos para copias de seguridad
- Acceso a política de privacidad

---

## 🔒 Privacidad Primero

Bilio está construido con la privacidad como principio fundamental, no como una idea tardía.

### Lo Que NO Hacemos

- ❌ Sin cuentas de usuario
- ❌ Sin almacenamiento en la nube
- ❌ Sin recopilación de datos
- ❌ Sin analíticas o rastreo
- ❌ Sin compartir datos con terceros
- ❌ Sin publicidad

### Lo Que SÍ Hacemos

- ✅ Todos los datos se quedan en TU dispositivo
- ✅ AsyncStorage para persistencia local
- ✅ Arquitectura offline-first
- ✅ Tú controlas las exportaciones y el compartir
- ✅ Código abierto transparente
- ✅ Política de privacidad completa disponible en la app

**En Resumen:** Los datos de tu negocio son TUS datos. Nunca los vemos, nunca los almacenamos, nunca los compartimos.

---

## 🖼 Capturas

> _Capturas de pantalla próximamente_

---

## 🛠 Tecnologías

[Same as English section - technical content remains identical]

---

## 🚀 Instalación

[Same installation steps as English section]

---

## 📱 Uso

### Configuración Inicial

1. Abre la aplicación
2. Selecciona tu idioma
3. Ingresa la información de tu negocio
4. Sube tu logo (opcional)
5. Elige tu moneda y tasa de impuesto predeterminada
6. Establece las preferencias de numeración de facturas/presupuestos
7. ¡Comienza a crear documentos!

[Rest of usage section with Spanish translations]

---

## 📁 Estructura del Proyecto

[Same as English section - file structure is universal]

---

## 📜 Scripts Disponibles

[Same as English section]

---

## 🚀 Fases de Desarrollo

[Same phases as English, with Spanish descriptions]

---

## 🧪 Pruebas

```bash
# Ejecutar todas las 227 pruebas
npm test

# Modo observación
npm run test:watch

# Reporte de cobertura
npm run test:coverage
```

---

## 🐛 Limitaciones Conocidas

[Same as English section]

---

## 📄 Licencia

Licencia MIT - Ver archivo [LICENSE](./LICENSE) para detalles

Copyright © 2026 Bilio

---

## 👨‍💻 Autor

**Pabl0Parra**

- GitHub: [@Pabl0Parra](https://github.com/Pabl0Parra)
- Proyecto Original: Bilio (herramienta empresarial privada)
- Bilio: Lanzamiento público genérico

---

## 📞 Soporte

- **Email**: support@Bilio.app
- **GitHub Issues**: [Reportar un error](https://github.com/yourusername/Bilio-app/issues)
- **Política de Privacidad**: Disponible en la app en Acerca de → Política de Privacidad

---

## 🙏 Agradecimientos

- Equipo de Expo por la increíble plataforma de desarrollo
- Comunidad de React Native
- Todos los contribuidores de código abierto
- Beta testers (próximamente)

---

<div align="center">

**Hecho con ❤️ y privacidad en mente**

[⬆ Volver arriba](#-Bilio---professional-invoicing-app)

</div>
