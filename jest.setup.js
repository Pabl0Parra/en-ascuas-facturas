// Mock AsyncStorage for tests with in-memory storage
let mockStorage = {};

const mockAsyncStorage = {
  getItem: jest.fn((key) => Promise.resolve(mockStorage[key] || null)),
  setItem: jest.fn((key, value) => {
    mockStorage[key] = value;
    return Promise.resolve();
  }),
  removeItem: jest.fn((key) => {
    delete mockStorage[key];
    return Promise.resolve();
  }),
  clear: jest.fn(() => {
    mockStorage = {};
    return Promise.resolve();
  }),
  getAllKeys: jest.fn(() => Promise.resolve(Object.keys(mockStorage))),
  multiGet: jest.fn((keys) =>
    Promise.resolve(keys.map((key) => [key, mockStorage[key] || null]))
  ),
  multiSet: jest.fn((keyValuePairs) => {
    keyValuePairs.forEach(([key, value]) => {
      mockStorage[key] = value;
    });
    return Promise.resolve();
  }),
  multiRemove: jest.fn((keys) => {
    keys.forEach((key) => {
      delete mockStorage[key];
    });
    return Promise.resolve();
  }),
};

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock expo-localization
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [
    {
      languageCode: 'en',
      languageTag: 'en-US',
      regionCode: 'US',
      currencyCode: 'USD',
      currencySymbol: '$',
      decimalSeparator: '.',
      digitGroupingSeparator: ',',
      textDirection: 'ltr',
      measurementSystem: 'metric',
      temperatureUnit: 'celsius',
    },
  ]),
  getCalendars: jest.fn(() => []),
}));

// Mock expo-print
jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn(({ html }) =>
    Promise.resolve({
      uri: `file:///mock/pdf/${Date.now()}.pdf`,
      numberOfPages: 1,
    })
  ),
  printAsync: jest.fn(() => Promise.resolve()),
  selectPrinterAsync: jest.fn(() => Promise.resolve({ name: 'Mock Printer' })),
  Orientation: {
    portrait: 'portrait',
    landscape: 'landscape',
  },
}));

// Reset mocks and storage before each test
beforeEach(() => {
  mockStorage = {};
  jest.clearAllMocks();
});
