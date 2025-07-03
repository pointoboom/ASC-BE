export const users = Array.from({ length: 50 }, (_, index) => ({
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  age: index + 1,
  avatarUrl: `https://example.com/avatar${index + 1}.jpg`,
  createdAt: new Date(),
  updatedAt: new Date(),
}));
