import { vi } from 'vitest';

/**
 * Mock API response for testing
 */
export const mockApiResponse = (data, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
};

/**
 * Mock API error response
 */
export const mockApiError = (message, status = 500) => {
  return Promise.reject(new Error(message));
};

/**
 * Setup fetch mock for tests
 */
export const setupFetchMock = (responses = {}) => {
  global.fetch = vi.fn((url, options) => {
    const key = typeof url === 'string' ? url : url.toString();
    if (responses[key]) {
      return responses[key];
    }
    return mockApiResponse({ error: 'Not Found' }, 404);
  });
};

/**
 * Create mock user object for testing
 */
export const createMockUser = (overrides = {}) => {
  return {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
};

/**
 * Create mock product object for testing
 */
export const createMockProduct = (overrides = {}) => {
  return {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    stock: 10,
    category: 'Test Category',
    imageUrl: '/test-image.jpg',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
};

/**
 * Create mock order object for testing
 */
export const createMockOrder = (overrides = {}) => {
  return {
    id: 1,
    userId: 1,
    items: [],
    totalPrice: 0,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
};

/**
 * Mock localStorage for tests
 */
export const setupLocalStorageMock = () => {
  const store = {};

  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};
