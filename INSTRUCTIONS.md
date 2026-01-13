# EN ASCUAS
## Aplicación de Facturación y Presupuestos

### Descripción General

Aplicación móvil React Native (Expo SDK 54) para **En Ascuas**, un taller artesanal de hierro y metal que crea esculturas y estructuras únicas. La app permite crear facturas y presupuestos, guardarlos como PDF en el dispositivo y exportarlos por email.

**Plataforma**: Android únicamente

---

## INFORMACIÓN DE LA EMPRESA (HARDCODED)

```
Nombre: ALEJANDRO CANTOS RAMIREZ
Dirección: C/NUEVA N 4 6-E
Ciudad: 18600 MOTRIL
Provincia: GRANADA
NIF: 74717895-A

Método de Pago: TRANSFERENCIA
IBAN: ES87-0049-4197-9825-1413-9105
```

---

## FUNCIONALIDADES PRINCIPALES

1. **Crear Facturas**: Formulario completo con datos del cliente, líneas de detalle, IVA configurable
2. **Crear Presupuestos**: Mismo formato que facturas, diferente etiqueta
3. **Gestión de Clientes**: Guardar clientes para reutilizar en futuros documentos
4. **Historial de Documentos**: Lista de facturas/presupuestos creados con acceso al PDF
5. **Generación PDF**: Crear PDF con formato profesional
6. **Exportar**: Compartir PDF via email, WhatsApp, o guardar en Files

---

## ARQUITECTURA DE DATOS

### Persistencia (Sin Backend)

| Dato | Almacenamiento | Motivo |
|------|----------------|--------|
| Clientes | Zustand + AsyncStorage | Reutilizar en nuevos documentos |
| Metadatos documentos | Zustand + AsyncStorage | Mostrar historial en app |
| PDFs | expo-file-system (App Documents) | Acceso via share sheet |

### Flujo de Documento

```
Usuario crea documento → Genera PDF → Guarda en App Documents → Share Sheet
                                    ↓
                         Guarda metadata en Zustand (historial)
```

---

## ESPECIFICACIONES TÉCNICAS

### Stack Tecnológico

- **Framework**: React Native + Expo SDK 54
- **Lenguaje**: TypeScript estricto (nunca usar `any`)
- **Navegación**: Expo Router (file-based routing)
- **Estado + Persistencia**: Zustand con persist middleware + AsyncStorage
- **Almacenamiento PDFs**: expo-file-system
- **Generación PDF**: expo-print
- **Compartir**: expo-sharing
- **Animaciones**: react-native-reanimated
- **Splash Animation**: lottie-react-native (opcional) o Reanimated
- **Idioma**: Solo Español

### Paleta de Colores (Tema Minimalista Fire)

```typescript
// src/constants/theme.ts
export const COLORS = {
  // Primarios (acentos fuego)
  primary: '#FF4500',        // Orange Red - acento principal
  primaryDark: '#CC3700',    // Pressed states
  primaryLight: '#FF6A33',   // Highlights
  
  // Neutros
  background: '#FFFFFF',     // Fondo principal
  surface: '#F5F5F5',        // Superficies elevadas
  card: '#FAFAFA',           // Cards
  
  // Texto
  textPrimary: '#1A1A1A',    // Texto principal (casi negro)
  textSecondary: '#666666',  // Texto secundario
  textMuted: '#999999',      // Texto deshabilitado
  textInverse: '#FFFFFF',    // Texto sobre fondos oscuros
  
  // Bordes
  border: '#E0E0E0',
  borderDark: '#CCCCCC',
  divider: '#EEEEEE',
  
  // Estados
  success: '#28A745',
  error: '#DC3545',
  warning: '#FFC107',
  
  // Especiales
  black: '#000000',          // Logo, headers importantes
  ember: '#E25822',          // Variante brasa
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
} as const;
```

---

## ESTRUCTURA DEL PROYECTO

```
en-ascuas-app/
├── app/                              # Expo Router pages
│   ├── _layout.tsx                   # Root layout con providers
│   ├── index.tsx                     # Splash screen animado
│   ├── (tabs)/                       # Tab navigation
│   │   ├── _layout.tsx               # Tab bar config
│   │   ├── index.tsx                 # Home/Dashboard
│   │   ├── clientes.tsx              # Lista de clientes
│   │   └── historial.tsx             # Historial documentos
│   ├── documento/
│   │   ├── nuevo.tsx                 # Crear factura o presupuesto
│   │   └── [id].tsx                  # Ver detalle (abre PDF)
│   └── cliente/
│       ├── nuevo.tsx                 # Crear cliente
│       └── [id].tsx                  # Editar cliente
├── src/
│   ├── components/
│   │   ├── ui/                       # Componentes base reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Toggle.tsx
│   │   │   ├── IconButton.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── Loading.tsx
│   │   ├── documento/                # Componentes formulario
│   │   │   ├── DocumentForm.tsx
│   │   │   ├── ClientSection.tsx
│   │   │   ├── LineItemRow.tsx
│   │   │   ├── LineItemsList.tsx
│   │   │   ├── IVAToggle.tsx
│   │   │   └── TotalsSummary.tsx
│   │   ├── cliente/
│   │   │   ├── ClientForm.tsx
│   │   │   ├── ClientCard.tsx
│   │   │   └── ClientPicker.tsx
│   │   ├── historial/
│   │   │   ├── DocumentCard.tsx
│   │   │   └── DocumentList.tsx
│   │   └── splash/
│   │       └── AnimatedSplash.tsx
│   ├── constants/
│   │   ├── theme.ts                  # Colores, espaciado, tipografía
│   │   ├── company.ts                # Datos empresa (hardcoded)
│   │   └── strings.ts                # Textos UI en español
│   ├── stores/
│   │   ├── clientStore.ts            # Zustand store clientes
│   │   ├── documentStore.ts          # Zustand store documentos (metadata)
│   │   └── formStore.ts              # Estado temporal del formulario
│   ├── services/
│   │   ├── pdfGenerator.ts           # Generar HTML y crear PDF
│   │   ├── fileService.ts            # Guardar PDF en Documents
│   │   └── shareService.ts           # Compartir via share sheet
│   ├── types/
│   │   ├── client.ts
│   │   ├── document.ts
│   │   └── index.ts                  # Re-exports
│   └── utils/
│       ├── formatters.ts             # Formato moneda, fechas
│       ├── calculations.ts           # Cálculos IVA, totales
│       ├── validators.ts             # Validación formularios
│       └── idGenerator.ts            # Generar UUIDs
├── assets/
│   ├── images/
│   │   ├── logo.png                  # Logo En Ascuas
│   │   ├── icon.png                  # App icon
│   │   └── adaptive-icon.png         # Android adaptive icon
│   └── animations/
│       └── flame.json                # Lottie animation (opcional)
├── app.json
├── package.json
├── tsconfig.json
└── babel.config.js
```

---

## TIPOS TYPESCRIPT

```typescript
// src/types/client.ts
export interface Client {
  id: string;
  nombre: string;
  direccion: string;
  codigoPostal: string;
  ciudad: string;
  provincia: string;
  nifCif: string;
  email?: string;
  telefono?: string;
  createdAt: string;
  updatedAt: string;
}

export type ClientFormData = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;


// src/types/document.ts
export type DocumentType = 'factura' | 'presupuesto';

export type IVARate = 0 | 21;

export interface LineItem {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  importe: number;  // Calculado: cantidad * precioUnitario
}

// Metadata guardada en Zustand para el historial
export interface DocumentMetadata {
  id: string;
  tipo: DocumentType;
  numeroDocumento: string;
  fechaDocumento: string;
  clienteNombre: string;
  clienteNifCif: string;
  total: number;
  pdfFileName: string;
  createdAt: string;
}

// Documento completo para generar PDF
export interface DocumentData {
  tipo: DocumentType;
  numeroDocumento: string;
  fechaDocumento: string;
  
  // Datos cliente
  clienteId: string;
  clienteNombre: string;
  clienteDireccion: string;
  clienteCodigoPostal: string;
  clienteCiudad: string;
  clienteProvincia: string;
  clienteNifCif: string;
  
  // Líneas
  lineas: LineItem[];
  
  // IVA
  tipoIVA: IVARate;
  
  // Totales (calculados)
  baseImponible: number;
  importeIVA: number;
  total: number;
}

export type DocumentFormData = Omit<DocumentData, 'baseImponible' | 'importeIVA' | 'total'>;
```

---

## FASES DE DESARROLLO

---

### FASE 1: Setup del Proyecto

**Objetivo**: Crear proyecto Expo, configurar TypeScript estricto, instalar dependencias.

#### 1.1 Crear proyecto

```bash
npx create-expo-app@latest en-ascuas-app --template blank-typescript
cd en-ascuas-app
```

#### 1.2 Instalar dependencias

```bash
# Navegación
npx expo install expo-router expo-linking expo-constants expo-status-bar

# Almacenamiento
npx expo install @react-native-async-storage/async-storage expo-file-system

# PDF y compartir
npx expo install expo-print expo-sharing

# Animaciones
npx expo install react-native-reanimated lottie-react-native

# Estado
npm install zustand

# Utilidades
npm install date-fns uuid
npm install -D @types/uuid

# Iconos
npx expo install @expo/vector-icons
```

#### 1.3 Configurar tsconfig.json

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@ui/*": ["src/components/ui/*"],
      "@constants/*": ["src/constants/*"],
      "@stores/*": ["src/stores/*"],
      "@services/*": ["src/services/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

#### 1.4 Configurar babel.config.js

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@ui': './src/components/ui',
            '@constants': './src/constants',
            '@stores': './src/stores',
            '@services': './src/services',
            '@types': './src/types',
            '@utils': './src/utils',
          },
        },
      ],
    ],
  };
};
```

Instalar module-resolver:
```bash
npm install -D babel-plugin-module-resolver
```

#### 1.5 Configurar app.json

```json
{
  "expo": {
    "name": "En Ascuas",
    "slug": "en-ascuas-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "enascuas",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/images/icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.enascuas.facturacion"
    },
    "plugins": [
      "expo-router"
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

#### 1.6 Crear estructura de carpetas

Crear todas las carpetas según el árbol de estructura definido arriba.

#### 1.7 Crear archivos de constantes

**src/constants/company.ts**
```typescript
export const COMPANY = {
  nombre: 'ALEJANDRO CANTOS RAMIREZ',
  direccion: 'C/NUEVA N 4 6-E',
  codigoPostal: '18600',
  ciudad: 'MOTRIL',
  provincia: 'GRANADA',
  nif: '74717895-A',
  
  metodoPago: 'TRANSFERENCIA',
  iban: 'ES87-0049-4197-9825-1413-9105',
} as const;
```

**src/constants/strings.ts**
```typescript
export const STRINGS = {
  app: {
    name: 'En Ascuas',
    tagline: 'Metal Fusión',
  },
  
  navigation: {
    home: 'Inicio',
    clientes: 'Clientes',
    historial: 'Historial',
    nuevaFactura: 'Nueva Factura',
    nuevoPresupuesto: 'Nuevo Presupuesto',
  },
  
  document: {
    factura: 'FACTURA',
    presupuesto: 'PRESUPUESTO',
    numeroDocumento: 'Nº Documento',
    fechaDocumento: 'Fecha',
    datosEmpresa: 'DATOS',
    datosFacturacion: 'DATOS DE FACTURACIÓN',
  },
  
  form: {
    descripcion: 'Descripción',
    cantidad: 'Cantidad',
    precio: 'Precio',
    importe: 'Importe',
    añadirLinea: 'Añadir línea',
    eliminar: 'Eliminar',
  },
  
  iva: {
    label: 'IVA',
    inversionSujetoPasivo: 'Inversión del sujeto pasivo',
    inversionNota: 'INVERSIÓN SUJETO PASIVO IVA 0%',
    normal: 'IVA 21%',
  },
  
  totals: {
    base: 'BASE',
    iva: 'IVA',
    total: 'TOTAL',
  },
  
  payment: {
    metodoPago: 'MÉTODO DE PAGO',
    transferencia: 'TRANSFERENCIA',
  },
  
  actions: {
    guardar: 'Guardar',
    generarPDF: 'Generar PDF',
    compartir: 'Compartir',
    cancelar: 'Cancelar',
    editar: 'Editar',
    eliminar: 'Eliminar',
    nuevoCliente: 'Nuevo Cliente',
    seleccionarCliente: 'Seleccionar cliente',
  },
  
  client: {
    nombre: 'Nombre / Razón Social',
    direccion: 'Dirección',
    codigoPostal: 'Código Postal',
    ciudad: 'Ciudad',
    provincia: 'Provincia',
    nifCif: 'NIF / CIF',
    email: 'Email (opcional)',
    telefono: 'Teléfono (opcional)',
  },
  
  empty: {
    clientes: 'No hay clientes guardados',
    historial: 'No hay documentos',
    lineas: 'Añade al menos una línea',
  },
  
  errors: {
    campoRequerido: 'Este campo es requerido',
    seleccionaCliente: 'Selecciona un cliente',
    añadeLinea: 'Añade al menos una línea',
    cantidadInvalida: 'Cantidad debe ser mayor a 0',
    precioInvalido: 'Precio debe ser mayor a 0',
  },
  
  success: {
    clienteGuardado: 'Cliente guardado',
    documentoGenerado: 'Documento generado correctamente',
    pdfGuardado: 'PDF guardado',
  },
} as const;
```

**Entregables Fase 1**:
- [ ] Proyecto creado y compilando sin errores
- [ ] Todas las dependencias instaladas
- [ ] TypeScript estricto configurado
- [ ] Estructura de carpetas creada
- [ ] Constantes de empresa, tema y strings creadas

---

### FASE 2: Componentes UI Base

**Objetivo**: Crear sistema de componentes reutilizables.

#### Componentes a implementar:

##### 2.1 Button.tsx

```typescript
// Props
interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}
```

- Variante `primary`: Fondo naranja (#FF4500), texto blanco
- Variante `secondary`: Fondo gris claro, texto negro
- Variante `outline`: Borde naranja, fondo transparente
- Variante `ghost`: Sin fondo ni borde, solo texto
- Estados: normal, pressed (oscurecer), disabled (opacity 0.5), loading (spinner)

##### 2.2 Input.tsx

```typescript
interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  rightIcon?: React.ReactNode;
}
```

- Label encima del input
- Borde gris por defecto, naranja en focus, rojo con error
- Mensaje de error debajo en rojo

##### 2.3 Card.tsx

```typescript
interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}
```

- Fondo blanco
- Sombra sutil (elevation: 2)
- Border radius: 12

##### 2.4 Header.tsx

```typescript
interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
}
```

##### 2.5 Select.tsx (Dropdown)

```typescript
interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  searchable?: boolean;  // Para buscar clientes
}
```

- Usa Modal con FlatList para las opciones
- Opción de búsqueda para lista de clientes

##### 2.6 Toggle.tsx

```typescript
interface ToggleProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
}
```

- Switch nativo de React Native
- Color naranja cuando está activo

##### 2.7 IconButton.tsx

```typescript
interface IconButtonProps {
  icon: string;  // Nombre del icono de @expo/vector-icons
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
}
```

##### 2.8 EmptyState.tsx

```typescript
interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

- Icono grande centrado
- Texto descriptivo
- Botón de acción opcional

##### 2.9 Loading.tsx

- Spinner centrado con color primario

**Entregables Fase 2**:
- [ ] Todos los componentes UI creados
- [ ] Tipos TypeScript completos
- [ ] Estilos siguiendo el tema definido
- [ ] Componentes probados visualmente

---

### FASE 3: Splash Screen Animado

**Objetivo**: Crear una splash screen atractiva con animación.

#### Secuencia de animación:

1. **Fondo blanco** (0ms)
2. **Logo aparece** con fade in + scale desde 0.5 a 1 con efecto bounce (0-600ms)
3. **Efecto glow/pulse** sutil en el logo simulando brasa (600ms-1500ms, loop suave)
4. **Texto "Metal Fusión"** aparece con slide up + fade in (800-1200ms)
5. **Pausa** (1200-2000ms)
6. **Fade out** de toda la pantalla (2000-2300ms)
7. **Navegar** a Home

#### Implementación con Reanimated:

```typescript
// src/components/splash/AnimatedSplash.tsx

// Usar:
// - useSharedValue para opacity, scale, translateY
// - withTiming, withSpring, withSequence para animaciones
// - Animated.View y Animated.Image
// - useAnimatedStyle para los estilos

// El componente debe:
// 1. Recibir onAnimationComplete callback
// 2. Ejecutar la secuencia de animaciones
// 3. Llamar onAnimationComplete al terminar
```

#### Integración en app/index.tsx:

```typescript
// Mostrar AnimatedSplash
// Al completar, usar router.replace('/(tabs)') para ir a Home
```

**Entregables Fase 3**:
- [ ] AnimatedSplash.tsx funcional
- [ ] Animación fluida a 60fps
- [ ] Logo correctamente posicionado
- [ ] Transición suave a Home

---

### FASE 4: Stores de Zustand

**Objetivo**: Implementar estado global con persistencia.

#### 4.1 clientStore.ts

```typescript
interface ClientStore {
  clients: Client[];
  
  // Actions
  addClient: (client: ClientFormData) => Client;
  updateClient: (id: string, data: Partial<ClientFormData>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  searchClients: (query: string) => Client[];
}

// Usar persist middleware con AsyncStorage
```

#### 4.2 documentStore.ts

```typescript
interface DocumentStore {
  documents: DocumentMetadata[];
  
  // Actions
  addDocument: (metadata: Omit<DocumentMetadata, 'id' | 'createdAt'>) => DocumentMetadata;
  deleteDocument: (id: string) => void;
  getDocumentById: (id: string) => DocumentMetadata | undefined;
  getDocumentsByType: (tipo: DocumentType) => DocumentMetadata[];
}

// Usar persist middleware con AsyncStorage
```

#### 4.3 formStore.ts (temporal, sin persistencia)

```typescript
interface FormStore {
  // Estado del formulario actual
  documentType: DocumentType;
  numeroDocumento: string;
  fechaDocumento: string;
  selectedClientId: string | null;
  lineas: LineItem[];
  tipoIVA: IVARate;
  
  // Actions
  setDocumentType: (tipo: DocumentType) => void;
  setNumeroDocumento: (numero: string) => void;
  setFechaDocumento: (fecha: string) => void;
  setSelectedClient: (clientId: string | null) => void;
  
  // Líneas
  addLinea: () => void;
  updateLinea: (id: string, data: Partial<LineItem>) => void;
  removeLinea: (id: string) => void;
  
  // IVA
  setTipoIVA: (tipo: IVARate) => void;
  
  // Calculated getters
  getBaseImponible: () => number;
  getImporteIVA: () => number;
  getTotal: () => number;
  
  // Reset
  resetForm: () => void;
}
```

**Entregables Fase 4**:
- [ ] Todos los stores implementados
- [ ] Persistencia funcionando (clients y documents)
- [ ] Tipos TypeScript correctos
- [ ] Actions probadas

---

### FASE 5: Navegación y Pantallas

**Objetivo**: Implementar navegación con Expo Router y pantallas básicas.

#### 5.1 Root Layout (app/_layout.tsx)

- Configurar fuentes si se usan custom
- Envolver con providers necesarios
- Configurar StatusBar

#### 5.2 Tab Layout (app/(tabs)/_layout.tsx)

```typescript
// 3 tabs:
// - Inicio (home icon)
// - Clientes (users icon)  
// - Historial (file-text icon)

// Tab bar:
// - Fondo blanco
// - Iconos grises inactivos, naranja activos
// - Labels en español
```

#### 5.3 Pantallas a implementar:

**Home (app/(tabs)/index.tsx)**
- Logo de la empresa (grande, centrado arriba)
- Texto "Metal Fusión" debajo del logo
- 2 botones grandes:
  - "Nueva Factura" (icono file-plus)
  - "Nuevo Presupuesto" (icono file-text)
- Los botones navegan a /documento/nuevo con query param `tipo`

**Clientes (app/(tabs)/clientes.tsx)**
- Header con título "Clientes"
- Barra de búsqueda
- Lista de ClientCard
- FAB (Floating Action Button) para añadir cliente → /cliente/nuevo
- EmptyState si no hay clientes

**Historial (app/(tabs)/historial.tsx)**
- Header con título "Historial"
- Tabs/filtros: "Todos" | "Facturas" | "Presupuestos"
- Lista de DocumentCard ordenada por fecha (más reciente primero)
- Tap en documento → abre PDF con shareService
- EmptyState si no hay documentos

**Nuevo/Editar Cliente (app/cliente/nuevo.tsx y app/cliente/[id].tsx)**
- Formulario completo con ClientForm
- Validación de campos requeridos
- Guardar → volver a lista

**Nuevo Documento (app/documento/nuevo.tsx)**
- Recibe `tipo` como query param
- Formulario completo (ver Fase 6)

**Ver Documento (app/documento/[id].tsx)**
- Obtener metadata del store
- Abrir PDF directamente con share sheet
- O mostrar preview básico con opción de compartir

**Entregables Fase 5**:
- [ ] Navegación completa funcionando
- [ ] Todas las pantallas con layout básico
- [ ] Tab bar estilizado
- [ ] Navegación entre pantallas fluida

---

### FASE 6: Formulario de Documento

**Objetivo**: Implementar formulario completo para crear facturas/presupuestos.

#### Estructura del formulario:

```
┌─────────────────────────────────────┐
│ Header: "Nueva Factura/Presupuesto" │
├─────────────────────────────────────┤
│ Nº Documento: [___________]         │
│ Fecha: [___________] 📅             │
├─────────────────────────────────────┤
│ DATOS DE FACTURACIÓN                │
│ [Seleccionar cliente ▼]             │
│ [+ Nuevo cliente]                   │
│                                     │
│ (Si cliente seleccionado, mostrar:) │
│ Nombre: XXXXX                       │
│ Dirección: XXXXX                    │
│ CP Ciudad: XXXXX                    │
│ Provincia: XXXXX                    │
│ NIF/CIF: XXXXX                      │
├─────────────────────────────────────┤
│ LÍNEAS DE DETALLE                   │
│ ┌─────────────────────────────────┐ │
│ │ Descripción: [______________]   │ │
│ │ Cant: [__] Precio: [____] = XXX │ │
│ │                           [🗑️] │ │
│ └─────────────────────────────────┘ │
│ [+ Añadir línea]                    │
├─────────────────────────────────────┤
│ ○ Inversión sujeto pasivo (IVA 0%) │
│   (Toggle switch)                   │
├─────────────────────────────────────┤
│ BASE:        XXX,XX €               │
│ IVA (21%):   XXX,XX €               │
│ ─────────────────────               │
│ TOTAL:       XXX,XX €               │
├─────────────────────────────────────┤
│ [    GENERAR PDF    ]               │
└─────────────────────────────────────┘
```

#### Componentes del formulario:

**DocumentForm.tsx** - Contenedor principal
- Scroll view con todas las secciones
- Maneja el estado via formStore
- Validación antes de generar PDF

**ClientSection.tsx** - Sección de cliente
- ClientPicker (Select searchable)
- Botón "Nuevo cliente" que abre modal o navega
- Muestra datos del cliente seleccionado

**LineItemRow.tsx** - Una línea de detalle
- Input descripción (multiline)
- Input cantidad (numeric)
- Input precio unitario (numeric, formato moneda)
- Importe calculado (read-only)
- Botón eliminar

**LineItemsList.tsx** - Lista de líneas
- FlatList de LineItemRow
- Botón "Añadir línea"
- Validación mínimo 1 línea

**IVAToggle.tsx** - Selector de IVA
- Toggle para inversión sujeto pasivo
- Muestra texto explicativo según selección

**TotalsSummary.tsx** - Resumen de totales
- Base imponible
- IVA (0% o 21%)
- Total (destacado, texto grande)

#### Validaciones:

- Número documento: requerido
- Fecha: requerida
- Cliente: debe estar seleccionado
- Líneas: mínimo 1
- Cada línea: descripción requerida, cantidad > 0, precio > 0

**Entregables Fase 6**:
- [ ] DocumentForm completo
- [ ] Todos los subcomponentes
- [ ] Cálculos automáticos funcionando
- [ ] Validaciones implementadas
- [ ] UX fluida (teclados apropiados, scroll a errores)

---

### FASE 7: Generación de PDF

**Objetivo**: Generar PDF profesional que replica la plantilla.

#### 7.1 Template HTML (src/services/pdfGenerator.ts)

El PDF debe replicar EXACTAMENTE el formato de la plantilla proporcionada:

```
┌────────────────────────────────────────────────────────┐
│ DATOS                    │ DATOS DE FACTURACIÓN       │
│ ALEJANDRO CANTOS RAMIREZ │ [Nombre Cliente]           │
│ C/NUEVA N 4 6-E          │ [Dirección]                │
│ 18600 MOTRIL             │ [CP Ciudad]                │
│ GRANADA                  │ [Provincia]                │
│ 74717895-A               │ [NIF/CIF]                  │
├──────────────────────────┴────────────────────────────┤
│ Nº FACTURA 250022          FECHA DE FACTURA 14/10/25  │
├───────────────────────────────────────────────────────┤
│ DESCRIPCIÓN        │ CANTIDAD │ PRECIO   │ IMPORTE   │
├───────────────────────────────────────────────────────┤
│ MANO DE OBRA       │    11    │  25,00   │  275,00   │
│ ELECTRODOS         │     1    │  35,20   │   35,20   │
│ DISCOS             │     1    │   4,70   │    4,70   │
│                    │          │          │           │
│ INVERSIÓN SUJETO PASIVO IVA 0%                       │
│                                                       │
├───────────────────────────────────────────────────────┤
│ MÉTODO DE PAGO                    │ BASE      314,90  │
│ TRANSFERENCIA                     │ IVA 21%          │
│ ES87-0049-4197-9825-1413-9105    │ TOTAL     314,90  │
└───────────────────────────────────────────────────────┘
```

```typescript
// src/services/pdfGenerator.ts

export const generateInvoiceHTML = (data: DocumentData): string => {
  const isPresupuesto = data.tipo === 'presupuesto';
  const docLabel = isPresupuesto ? 'PRESUPUESTO' : 'FACTURA';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        /* Reset y base */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: Arial, sans-serif; 
          font-size: 11px;
          color: #000;
          padding: 30px;
          max-width: 210mm;
        }
        
        /* Header con datos empresa y cliente */
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .datos-section {
          width: 48%;
        }
        .datos-title {
          font-weight: bold;
          font-size: 12px;
          margin-bottom: 8px;
          border-bottom: 1px solid #000;
          padding-bottom: 4px;
        }
        .datos-row {
          margin-bottom: 2px;
          font-size: 11px;
        }
        
        /* Info documento */
        .doc-info {
          display: flex;
          justify-content: space-between;
          background: #f0f0f0;
          padding: 10px 15px;
          margin-bottom: 20px;
          font-weight: bold;
        }
        
        /* Tabla de líneas */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        th {
          background: #000;
          color: #fff;
          padding: 8px 10px;
          text-align: left;
          font-size: 10px;
          font-weight: bold;
        }
        th.center { text-align: center; }
        th.right { text-align: right; }
        td {
          padding: 6px 10px;
          border-bottom: 1px solid #ddd;
          font-size: 11px;
        }
        td.center { text-align: center; }
        td.right { text-align: right; }
        
        /* Nota IVA */
        .iva-note {
          padding: 10px;
          font-style: italic;
          color: #333;
        }
        
        /* Footer con pago y totales */
        .footer {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          border-top: 2px solid #000;
          padding-top: 15px;
        }
        .payment-info {
          width: 55%;
        }
        .payment-title {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .totals {
          width: 40%;
          text-align: right;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3px;
        }
        .total-final {
          font-weight: bold;
          font-size: 14px;
          border-top: 1px solid #000;
          padding-top: 5px;
          margin-top: 5px;
        }
      </style>
    </head>
    <body>
      <!-- Header: Datos empresa y cliente -->
      <div class="header">
        <div class="datos-section">
          <div class="datos-title">DATOS</div>
          <div class="datos-row">ALEJANDRO CANTOS RAMIREZ</div>
          <div class="datos-row">C/NUEVA N 4 6-E</div>
          <div class="datos-row">18600 MOTRIL</div>
          <div class="datos-row">GRANADA</div>
          <div class="datos-row">74717895-A</div>
        </div>
        <div class="datos-section">
          <div class="datos-title">DATOS DE FACTURACIÓN</div>
          <div class="datos-row">${data.clienteNombre}</div>
          <div class="datos-row">${data.clienteDireccion}</div>
          <div class="datos-row">${data.clienteCodigoPostal} ${data.clienteCiudad}</div>
          <div class="datos-row">${data.clienteProvincia}</div>
          <div class="datos-row">${data.clienteNifCif}</div>
        </div>
      </div>
      
      <!-- Info documento -->
      <div class="doc-info">
        <span>Nº ${docLabel} ${data.numeroDocumento}</span>
        <span>FECHA DE ${docLabel} ${formatDateForPDF(data.fechaDocumento)}</span>
      </div>
      
      <!-- Tabla de líneas -->
      <table>
        <thead>
          <tr>
            <th style="width: 50%">DESCRIPCIÓN</th>
            <th class="center" style="width: 15%">CANTIDAD</th>
            <th class="right" style="width: 15%">PRECIO</th>
            <th class="right" style="width: 20%">IMPORTE</th>
          </tr>
        </thead>
        <tbody>
          ${data.lineas.map(linea => `
            <tr>
              <td>${linea.descripcion}</td>
              <td class="center">${linea.cantidad}</td>
              <td class="right">${formatCurrency(linea.precioUnitario)}</td>
              <td class="right">${formatCurrency(linea.importe)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <!-- Nota IVA si aplica -->
      ${data.tipoIVA === 0 ? `
        <div class="iva-note">INVERSIÓN SUJETO PASIVO IVA 0%</div>
      ` : ''}
      
      <!-- Footer: Pago y totales -->
      <div class="footer">
        <div class="payment-info">
          <div class="payment-title">MÉTODO DE PAGO</div>
          <div>TRANSFERENCIA</div>
          <div>ES87-0049-4197-9825-1413-9105</div>
        </div>
        <div class="totals">
          <div class="total-row">
            <span>BASE</span>
            <span>${formatCurrency(data.baseImponible)}</span>
          </div>
          <div class="total-row">
            <span>IVA ${data.tipoIVA}%</span>
            <span>${formatCurrency(data.importeIVA)}</span>
          </div>
          <div class="total-row total-final">
            <span>TOTAL</span>
            <span>${formatCurrency(data.total)}</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Helper para formato de fecha en PDF
const formatDateForPDF = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};

// Helper para formato de moneda
const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
```

#### 7.2 Servicio de generación (usando expo-print)

```typescript
// src/services/pdfGenerator.ts
import * as Print from 'expo-print';

export const createPDF = async (data: DocumentData): Promise<string> => {
  const html = generateInvoiceHTML(data);
  
  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });
  
  return uri;  // Ruta temporal del PDF
};
```

#### 7.3 Guardar y compartir (src/services/fileService.ts)

```typescript
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const savePDF = async (
  tempUri: string, 
  fileName: string
): Promise<string> => {
  const documentsDir = FileSystem.documentDirectory;
  const finalPath = `${documentsDir}${fileName}.pdf`;
  
  await FileSystem.copyAsync({
    from: tempUri,
    to: finalPath,
  });
  
  return finalPath;
};

export const sharePDF = async (filePath: string): Promise<void> => {
  const isAvailable = await Sharing.isAvailableAsync();
  
  if (isAvailable) {
    await Sharing.shareAsync(filePath, {
      mimeType: 'application/pdf',
      dialogTitle: 'Compartir documento',
    });
  }
};

export const deletePDF = async (filePath: string): Promise<void> => {
  const fileInfo = await FileSystem.getInfoAsync(filePath);
  if (fileInfo.exists) {
    await FileSystem.deleteAsync(filePath);
  }
};
```

#### 7.4 Flujo completo al generar:

1. Validar formulario
2. Construir `DocumentData` desde formStore + clientStore
3. Llamar `createPDF(data)` → obtener URI temporal
4. Generar nombre archivo: `FACTURA_250022_ClienteNombre.pdf`
5. Llamar `savePDF(tempUri, fileName)` → obtener path final
6. Guardar metadata en documentStore
7. Llamar `sharePDF(finalPath)` → mostrar share sheet
8. Resetear formulario y navegar a historial

**Entregables Fase 7**:
- [ ] Template HTML que replica exactamente el diseño
- [ ] Generación de PDF funcional
- [ ] Guardado en Documents
- [ ] Share sheet funcionando
- [ ] Metadata guardada en store

---

### FASE 8: Pulido y Testing

**Objetivo**: Refinar UX, manejar errores, y testing básico.

#### 8.1 Mejoras de UX

- Loading states durante generación PDF
- Toasts/snackbars para feedback (guardado, error, etc.)
- Confirmación antes de descartar formulario con cambios
- Scroll automático a campos con error
- Keyboard avoiding view en formularios

#### 8.2 Manejo de errores

- Try/catch en todas las operaciones async
- Mensajes de error amigables en español
- Fallbacks si algo falla (ej: share no disponible)

#### 8.3 Validaciones adicionales

- Formato NIF/CIF (regex básico)
- Código postal (5 dígitos)
- Email válido si se proporciona

#### 8.4 Testing manual

- [ ] Crear cliente nuevo
- [ ] Editar cliente existente
- [ ] Eliminar cliente
- [ ] Crear factura con IVA 21%
- [ ] Crear factura con IVA 0% (inversión sujeto pasivo)
- [ ] Crear presupuesto
- [ ] Verificar cálculos correctos
- [ ] Generar PDF y verificar formato
- [ ] Compartir por email
- [ ] Compartir por WhatsApp
- [ ] Ver historial
- [ ] Abrir PDF desde historial
- [ ] Verificar persistencia (cerrar y abrir app)

#### 8.5 Optimizaciones

- Memoización de componentes pesados
- Lazy loading de pantallas
- Debounce en búsqueda de clientes

**Entregables Fase 8**:
- [ ] App pulida y sin crashes
- [ ] Todos los flujos probados
- [ ] Errores manejados gracefully
- [ ] Performance aceptable

---

## ASSETS NECESARIOS

1. **logo.png** - Logo En Ascuas (proporcionado)
2. **icon.png** - Icono de app (512x512)
3. **adaptive-icon.png** - Icono adaptativo Android (1024x1024)
4. **flame.json** (opcional) - Animación Lottie para splash

---

## UTILIDADES HELPER

### formatters.ts

```typescript
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(date);
};

export const formatDateLong = (isoDate: string): string => {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};
```

### calculations.ts

```typescript
import type { LineItem, IVARate } from '@types/document';

export const calculateLineImporte = (
  cantidad: number, 
  precioUnitario: number
): number => {
  return cantidad * precioUnitario;
};

export const calculateBaseImponible = (lineas: LineItem[]): number => {
  return lineas.reduce((sum, linea) => sum + linea.importe, 0);
};

export const calculateIVA = (base: number, rate: IVARate): number => {
  return base * (rate / 100);
};

export const calculateTotal = (base: number, iva: number): number => {
  return base + iva;
};
```

### validators.ts

```typescript
export const isValidNIF = (nif: string): boolean => {
  // Regex básico para NIF/CIF español
  const nifRegex = /^[0-9]{8}[A-Z]$/i;
  const cifRegex = /^[A-Z][0-9]{7}[A-Z0-9]$/i;
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/i;
  
  return nifRegex.test(nif) || cifRegex.test(nif) || nieRegex.test(nif);
};

export const isValidPostalCode = (cp: string): boolean => {
  return /^[0-9]{5}$/.test(cp);
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

export const isPositiveNumber = (value: number): boolean => {
  return value > 0;
};
```

### idGenerator.ts

```typescript
import { v4 as uuidv4 } from 'uuid';

export const generateId = (): string => uuidv4();

export const generatePDFFileName = (
  tipo: 'factura' | 'presupuesto',
  numero: string,
  clienteNombre: string
): string => {
  const tipoLabel = tipo === 'factura' ? 'FACTURA' : 'PRESUPUESTO';
  const cleanNombre = clienteNombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 20);
  
  return `${tipoLabel}_${numero}_${cleanNombre}`;
};
```

---

## NOTAS IMPORTANTES

1. **TypeScript Estricto**: NUNCA usar `any`. Definir tipos para todo.

2. **Idioma**: TODA la UI en español. No usar inglés en ningún texto visible.

3. **Formato Moneda**: Siempre usar formato español (1.234,56 €).

4. **Formato Fecha**: DD/MM/YY (ej: 14/10/25).

5. **IVA por defecto**: 21% (toggle OFF). Solo 0% si toggle ON.

6. **PDF**: El diseño debe ser EXACTO a la plantilla proporcionada.

7. **Datos Empresa**: SIEMPRE hardcoded, nunca editable por usuario.

8. **Sin Backend**: Todo local. Preparar estructura para escalar si es necesario.

9. **Plataforma**: Solo Android. No preocuparse por iOS por ahora.

---

## CHECKLIST FINAL

- [ ] Fase 1: Setup completo
- [ ] Fase 2: Componentes UI
- [ ] Fase 3: Splash animado
- [ ] Fase 4: Stores Zustand
- [ ] Fase 5: Navegación
- [ ] Fase 6: Formulario documento
- [ ] Fase 7: Generación PDF
- [ ] Fase 8: Pulido y testing
- [ ] App lista para producción