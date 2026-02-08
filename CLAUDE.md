# En Ascuas → InvoiceApp: Genericization & Feature Roadmap

## Executive Summary

Transform "En Ascuas" from a single-business invoicing tool into a **generic, public-facing mobile app** distributed via App Store and Google Play. The app remains **offline-first with no backend**, leveraging on-device storage for all data. Priority features: **multi-language/multi-currency support** and **recurring invoices with templates**.

---

## Phase 1: Core Genericization (Foundation)

The current app has hardcoded business identity, Spanish tax rules, and a fixed PDF layout. Phase 1 removes all of that and replaces it with a user-driven configuration system.

### 1.1 Onboarding Flow

Replace `src/constants/company.ts` with a first-launch setup wizard that collects the user's business profile. This becomes the new entry point for fresh installs.

**New store: `businessProfileStore.ts`**

```typescript
interface BusinessProfile {
  companyName: string;
  address: string;
  postalCode: string;
  city: string;
  region: string;
  country: string; // ISO 3166-1 alpha-2
  taxIdLabel: string; // "NIF", "VAT", "EIN", "ABN", etc.
  taxId: string;
  paymentMethod: string;
  paymentDetails: string; // IBAN, account number, etc.
  logoUri: string | null; // local file URI from image picker
  primaryColor: string; // hex color for branding
  currency: string; // ISO 4217 code: "EUR", "USD", "GBP"
  locale: string; // BCP 47: "es-ES", "en-US", "fr-FR"
  defaultTaxRate: number; // e.g. 21 for Spain, 20 for UK
  taxName: string; // "IVA", "VAT", "GST", "Sales Tax"
  invoicePrefix: string; // e.g. "INV-", "FA-"
  quotePrefix: string; // e.g. "QUO-", "PRE-"
}
```

**Onboarding screens:**

1. **Welcome & Language** — pick app language, auto-detect from device locale
2. **Business Info** — company name, address, tax ID (with label auto-suggested from country)
3. **Branding** — logo upload (camera/gallery via `expo-image-picker`), primary color picker
4. **Financial Defaults** — currency, default tax rate/name, payment method & details
5. **Numbering** — invoice/quote prefix and starting number
6. **Review & Confirm** — summary card, tap to edit any section

All data persisted to AsyncStorage via Zustand. The onboarding flag (`hasCompletedOnboarding`) gates the app entry.

### 1.2 Tax System Abstraction

Replace the hardcoded 21% IVA / Inversión del Sujeto Pasivo with a flexible tax engine.

**New type: `TaxConfig`**

```typescript
interface TaxPreset {
  id: string;
  name: string; // "Standard VAT", "Reduced Rate", "Zero Rate", "Exempt"
  rate: number; // 0-100
  isDefault: boolean;
}

interface TaxConfig {
  taxName: string; // "IVA", "VAT", "GST"
  presets: TaxPreset[];
  allowPerLineItemTax: boolean;
  reverseChargeEnabled: boolean;
  reverseChargeLabel: string; // "Inversión del Sujeto Pasivo", "Reverse Charge"
}
```

**Country-based presets** (auto-populated during onboarding, editable later):

| Country   | Tax Name  | Rates                          |
| --------- | --------- | ------------------------------ |
| Spain     | IVA       | 21%, 10%, 4%, 0% (ISP)         |
| UK        | VAT       | 20%, 5%, 0%                    |
| Germany   | MwSt      | 19%, 7%, 0%                    |
| USA       | Sales Tax | Varies by state (user-defined) |
| Australia | GST       | 10%, 0%                        |
| Generic   | Tax       | User-defined                   |

### 1.3 Multi-Language (i18n)

**Implementation: `i18next` + `react-i18next` + `expo-localization`**

Migrate all strings from `src/constants/strings.ts` into JSON translation files.

```
src/
  i18n/
    index.ts          # i18n config
    locales/
      en.json
      es.json
      fr.json
      de.json
      pt.json
```

**Scope of translation:**

- All UI text (buttons, labels, placeholders, validation messages)
- PDF templates (headers, labels like "Invoice", "Subtotal", "Tax")
- Date formatting via `date-fns/locale`
- Number formatting via `Intl.NumberFormat`

**Language selection:** auto-detect device locale on first launch, manual override in Settings. Language change triggers full re-render (React context).

### 1.4 Multi-Currency

**No exchange rates needed** (offline-first, single-currency per document).

```typescript
interface CurrencyConfig {
  code: string; // "EUR", "USD", "GBP"
  symbol: string; // "€", "$", "£"
  position: "before" | "after"; // "$100" vs "100€"
  decimalSeparator: "." | ",";
  thousandsSeparator: "." | "," | " " | "";
  decimals: number; // typically 2
}
```

**Approach:**

- Default currency set during onboarding, stored in `businessProfileStore`
- Per-document currency override (for businesses invoicing in multiple currencies)
- `formatCurrency(amount: number, config: CurrencyConfig): string` utility replaces all hardcoded `€` formatting
- PDF generation uses the document's currency config

### 1.5 Dynamic PDF Templates

Replace the single hardcoded HTML template in `pdfGenerator.ts` with a template engine.

```typescript
type PdfTemplateId = "classic" | "modern" | "minimal";

interface PdfTemplateContext {
  business: BusinessProfile;
  client: Client;
  document: DocumentData;
  lineItems: LineItem[];
  calculations: Calculations;
  taxConfig: TaxConfig;
  currency: CurrencyConfig;
  translations: Record<string, string>; // pre-resolved i18n keys
  logoBase64: string | null;
}

function generatePdfHtml(
  templateId: PdfTemplateId,
  context: PdfTemplateContext,
): string;
```

**Template styles (ship with 3):**

1. **Classic** — traditional layout, logo top-left, clean lines (closest to current)
2. **Modern** — accent color sidebar, large typography, contemporary feel
3. **Minimal** — whitespace-heavy, no borders, elegant simplicity

All templates receive the same `PdfTemplateContext` and produce A4/Letter HTML. The user picks their preferred template in Settings → Branding.

---

## Phase 2: Recurring Invoices & Templates (Priority Feature)

### 2.1 Document Templates

Let users save any completed document as a reusable template.

```typescript
interface DocumentTemplate {
  id: string;
  name: string; // "Monthly Hosting Fee", "Catering Standard"
  type: "invoice" | "quote";
  clientId: string | null; // optional pre-filled client
  lineItems: LineItem[];
  taxRate: number;
  comments: string;
  createdAt: string;
  updatedAt: string;
}
```

**New store: `templateStore.ts`** with CRUD operations, persisted to AsyncStorage.

**UX Flow:**

- After generating a document → "Save as Template" button
- From home screen → "From Template" option alongside "New Invoice" / "New Quote"
- Template picker shows a list with template name, client (if any), and total
- Loading a template pre-fills the form, user adjusts date/number and generates

### 2.2 Recurring Invoices

Automated invoice generation on a schedule, stored and managed locally.

```typescript
interface RecurringRule {
  id: string;
  templateId: string;
  frequency: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
  startDate: string; // ISO date
  endDate: string | null; // null = indefinite
  nextDueDate: string; // computed
  autoNumbering: boolean; // auto-increment invoice number
  isActive: boolean;
  lastGeneratedDate: string | null;
  generatedDocumentIds: string[];
}
```

**New store: `recurringStore.ts`**

**Implementation strategy (offline-first, no push notifications needed):**

- On app launch, check all active recurring rules
- If `nextDueDate <= today` → auto-generate the invoice(s), save to `documentStore`, update rule
- Show a notification banner on the home screen: "2 recurring invoices were generated"
- User can review/edit before sharing
- Dedicated "Recurring" tab or section in the home screen

**Edge cases:**

- App not opened for weeks → generates all missed invoices on next launch, each with the correct date
- Invoice numbering follows the prefix + sequential pattern from `businessProfileStore`

---

## Phase 3: UX & Quality of Life Improvements

### 3.1 Settings Screen (New)

Currently missing — essential for a generic app.

**Sections:**

- **Business Profile** — edit all onboarding data
- **Branding** — logo, color, PDF template selection
- **Tax Configuration** — manage tax presets
- **Document Defaults** — numbering, prefix, default comments
- **Language & Region** — app language, date/number format
- **Data Management** — export all data (JSON backup), import, clear all data
- **About** — app version, licenses, support link

### 3.2 Data Export/Import (Backup)

Critical for offline-first with no cloud sync.

```typescript
interface AppBackup {
  version: string; // schema version for migration
  exportedAt: string;
  businessProfile: BusinessProfile;
  clients: Client[];
  documents: DocumentMetadata[];
  templates: DocumentTemplate[];
  recurringRules: RecurringRule[];
}
```

- Export as JSON file via `expo-sharing`
- Import from file via `expo-document-picker`
- Schema versioning for forward compatibility
- PDF files are NOT included in backup (can be regenerated)

### 3.3 Enhanced Client Management

- **Search & filter** in client list
- **Client categories/tags** (e.g., "Regular", "EU", "Domestic")
- **Client-level defaults** — preferred currency, tax treatment, payment terms
- **Usage stats** — total invoiced, last invoice date

### 3.4 Home Screen Dashboard

Replace the current simple home screen with a lightweight dashboard.

- **Quick stats:** invoices this month, total invoiced (current month/year), outstanding quotes
- **Recent documents:** last 5 documents with status indicators
- **Quick actions:** "New Invoice", "New Quote", "From Template"
- **Recurring alerts:** pending recurring invoices to review

### 3.5 Document Status Tracking

```typescript
type DocumentStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "paid"
  | "overdue"
  | "cancelled";
```

- Manual status updates (no backend to track opens/payments)
- Color-coded status badges in history
- Filter history by status
- "Mark as Paid" quick action

---

## Phase 4: App Store Readiness

### 4.1 App Identity & Branding

- New app name (drop "En Ascuas" — it's business-specific). Suggestions: **"InvoiceForge"**, **"BillCraft"**, **"QuickBill Pro"**, **"Factura"**
- App icon and splash screen designed for the new brand
- App Store screenshots showing the onboarding flow, PDF generation, and multi-language support
- Privacy policy (no data collection — strong selling point)

### 4.2 Monetization Strategy (Optional)

Since there's no backend, consider a one-time purchase or freemium model:

| Feature            | Free        | Pro (one-time)    |
| ------------------ | ----------- | ----------------- |
| Invoices/month     | 5           | Unlimited         |
| PDF templates      | 1 (Classic) | All 3 + future    |
| Recurring invoices | ✗           | ✓                 |
| Document templates | 3           | Unlimited         |
| Custom branding    | ✗           | ✓ (logo + colors) |
| Data export        | ✗           | ✓                 |

Managed via `expo-iap` (In-App Purchases) or `react-native-purchases` (RevenueCat).

### 4.3 Technical Debt & Polish

- **Accessibility (a11y):** screen reader labels, minimum touch targets (48x48), contrast ratios
- **Error boundaries:** graceful crash recovery with data preservation
- **Performance:** lazy loading for history screen, virtualized lists for large datasets
- **Testing:** unit tests for calculation/formatting utils, E2E tests with Detox or Maestro
- **OTA Updates:** `expo-updates` for pushing bug fixes without store review

---

## Proposed File Structure (Post-Genericization)

```
src/
├── i18n/
│   ├── index.ts
│   └── locales/
│       ├── en.json
│       ├── es.json
│       ├── fr.json
│       └── de.json
│
├── components/
│   ├── onboarding/
│   │   ├── WelcomeStep.tsx
│   │   ├── BusinessInfoStep.tsx
│   │   ├── BrandingStep.tsx
│   │   ├── FinancialStep.tsx
│   │   ├── NumberingStep.tsx
│   │   └── ReviewStep.tsx
│   ├── dashboard/
│   │   ├── QuickStats.tsx
│   │   ├── RecentDocuments.tsx
│   │   └── RecurringAlerts.tsx
│   ├── templates/
│   │   ├── TemplatePicker.tsx
│   │   └── TemplateCard.tsx
│   ├── recurring/
│   │   ├── RecurringRuleForm.tsx
│   │   └── RecurringRuleCard.tsx
│   ├── settings/
│   │   ├── BusinessProfileEditor.tsx
│   │   ├── TaxConfigEditor.tsx
│   │   ├── BrandingEditor.tsx
│   │   └── DataManagement.tsx
│   ├── cliente/          # existing, unchanged
│   ├── documento/        # existing, refactored
│   ├── historial/        # existing, enhanced
│   └── ui/               # existing, extended
│
├── stores/
│   ├── businessProfileStore.ts  # NEW
│   ├── templateStore.ts         # NEW
│   ├── recurringStore.ts        # NEW
│   ├── clientStore.ts           # existing
│   ├── documentStore.ts         # existing, extended with status
│   └── formStore.ts             # existing, refactored
│
├── services/
│   ├── pdfGenerator.ts          # refactored → template-driven
│   ├── pdfTemplates/
│   │   ├── classic.ts
│   │   ├── modern.ts
│   │   └── minimal.ts
│   ├── fileService.ts           # existing
│   ├── backupService.ts         # NEW
│   └── recurringService.ts      # NEW
│
├── config/
│   ├── taxPresets.ts             # country-based tax configs
│   ├── currencyConfig.ts         # currency formatting rules
│   └── countryDefaults.ts        # country → tax/currency/locale mapping
│
├── types/
│   ├── client.ts
│   ├── document.ts              # extended with status
│   ├── businessProfile.ts       # NEW
│   ├── template.ts              # NEW
│   ├── recurring.ts             # NEW
│   ├── tax.ts                   # NEW
│   └── currency.ts              # NEW
│
└── utils/
    ├── calculations.ts          # existing, refactored for flexible tax
    ├── formatters.ts            # existing, refactored for i18n
    ├── currencyFormatter.ts     # NEW
    ├── idGenerator.ts           # existing
    └── validation.ts            # existing, extended
```

---

## Implementation Priority & Timeline Estimate

| Phase       | Scope                               | Effort Estimate  |
| ----------- | ----------------------------------- | ---------------- |
| **1.1**     | Onboarding + Business Profile Store | 1–2 weeks        |
| **1.2**     | Tax System Abstraction              | 1 week           |
| **1.3**     | i18n (English + Spanish to start)   | 1 week           |
| **1.4**     | Multi-Currency Formatting           | 3–4 days         |
| **1.5**     | Dynamic PDF Templates (3 styles)    | 1–2 weeks        |
| **2.1**     | Document Templates                  | 1 week           |
| **2.2**     | Recurring Invoices                  | 1–2 weeks        |
| **3.1–3.5** | Settings, Export, Dashboard, Status | 2–3 weeks        |
| **4**       | App Store prep, testing, polish     | 2–3 weeks        |
|             | **Total**                           | **~10–14 weeks** |

---

## Key Architectural Decisions

1. **No backend, no auth** — all data lives on-device via AsyncStorage + Zustand persistence. This is the app's strongest differentiator: zero accounts, zero data collection, instant setup.

2. **Country defaults, not country lock-in** — selecting "Spain" during onboarding pre-fills IVA rates and EUR currency, but users can override everything. No assumptions are permanent.

3. **PDF templates as pure functions** — `(context: PdfTemplateContext) => string`. No state, no side effects, easy to test and add new templates.

4. **i18n covers both UI and PDFs** — the same translation system feeds the app interface and the generated documents. A French user gets French PDFs automatically.

5. **Schema versioning from day one** — every persisted store includes a `schemaVersion` field. Migration functions handle upgrades when the app updates.

---

## Migration Path for Existing "En Ascuas" Users

Since the original app is already deployed for one business:

1. Add a migration utility that reads current AsyncStorage data
2. Map existing data into the new `businessProfileStore` (pre-fill from current `company.ts` constants)
3. Migrate existing documents and clients to the extended schemas
4. Skip onboarding if migration detects existing data
5. Show a "What's New" screen explaining the update
