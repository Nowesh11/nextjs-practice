import { GET } from './route';

// mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    task: {
      count: jest.fn(),
      groupBy: jest.fn(),
    }
  }
}));

describe('GET /api/stats', () => {
  test('returns 401 if no userId', async () => {
    // create fake request with no headers
    const req = new Request('http://localhost/api/stats');

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  test('returns stats if userId exists', async () => {
    // mock prisma responses
    const { prisma } = require('@/lib/prisma');
    prisma.task.count
      .mockResolvedValueOnce(8)   // total
      .mockResolvedValueOnce(3)   // completed
      .mockResolvedValueOnce(5);  // incomplete

    prisma.task.groupBy.mockResolvedValueOnce([
      { priority: 'high', _count: { id: 2 } }
    ]);

    // create fake request WITH userId header
    const req = new Request('http://localhost/api/stats', {
      headers: { 'x-user-id': '1' }
    });

    const response = await GET(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.total).toBe(8);
    expect(data.completed).toBe(3);
    expect(data.incomplete).toBe(5);
  });
});