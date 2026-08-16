const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  statusCode?: number;
  errors?: any[];
  constructor(message: string, statusCode?: number, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sb_auth_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new ApiError(data.message || 'Terjadi kesalahan pada permintaan ke server', res.status, data.errors);
    }

    return data;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || 'Gagal terhubung ke Backend API Server.');
  }
}

export const api = {
  // Auth
  auth: {
    login: (body: { email: string; password?: string }) =>
      request<{ success: boolean; data: { user: any; token: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: body.email, password: body.password || 'password123' })
      }),
    register: (body: { name: string; email: string; password?: string; role?: string }) =>
      request<{ success: boolean; data: { user: any; token: string } }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: body.name,
          email: body.email,
          password: body.password || 'password123',
          role: body.role || 'TALENT'
        })
      }),
    me: () => request<{ success: boolean; data: { user: any } }>('/auth/me'),
    listUsers: () => request<{ success: boolean; data: { users: any[] } }>('/auth/users')
  },

  // Bounties
  bounties: {
    list: (params?: Record<string, string>) => {
      const q = params ? `?${new URLSearchParams(params).toString()}` : '';
      return request<{ success: boolean; data: { bounties: any[] } }>(`/bounties${q}`);
    },
    get: (id: string) => request<{ success: boolean; data: { bounty: any } }>(`/bounties/${id}`),
    create: (body: any) =>
      request<{ success: boolean; data: { bounty: any } }>('/bounties', {
        method: 'POST',
        body: JSON.stringify(body)
      })
  },

  // Submissions
  submissions: {
    submit: (bountyId: string, body: { demoUrl: string; repoUrl?: string; notes?: string }) =>
      request<{ success: boolean; data: { submission: any } }>(`/bounties/${bountyId}/submit`, {
        method: 'POST',
        body: JSON.stringify(body)
      }),
    approve: (bountyId: string, submissionId: string) =>
      request<{ success: boolean; message: string }>(`/bounties/${bountyId}/submissions/${submissionId}/approve`, {
        method: 'POST'
      }),
    requestRevision: (bountyId: string, submissionId: string, notes: string) =>
      request<{ success: boolean; data: { submission: any } }>(`/bounties/${bountyId}/submissions/${submissionId}/revision`, {
        method: 'POST',
        body: JSON.stringify({ notes })
      })
  },

  // Portfolios
  portfolios: {
    list: (userId?: string) => {
      const q = userId ? `?userId=${userId}` : '';
      return request<{ success: boolean; data: { portfolios: any[] } }>(`/portfolios${q}`);
    },
    add: (body: any) =>
      request<{ success: boolean; data: { portfolio: any } }>('/portfolios', {
        method: 'POST',
        body: JSON.stringify(body)
      }),
    update: (id: string, body: any) =>
      request<{ success: boolean; data: { portfolio: any } }>(`/portfolios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body)
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/portfolios/${id}`, {
        method: 'DELETE'
      })
  },

  // Wallet & Withdrawals
  withdrawals: {
    request: (body: { amount: number; bankName: string; accountNum: string; accountName: string }) =>
      request<{ success: boolean; data: { withdrawal: any; remainingBalance: number } }>('/withdrawals', {
        method: 'POST',
        body: JSON.stringify(body)
      }),
    my: () => request<{ success: boolean; data: { withdrawals: any[] } }>('/withdrawals/my'),
    adminList: (status?: string) => {
      const q = status ? `?status=${status}` : '';
      return request<{ success: boolean; data: { withdrawals: any[] } }>(`/withdrawals/admin${q}`);
    },
    adminUpdate: (id: string, body: { status: string; rejectionReason?: string }) =>
      request<{ success: boolean; data: { withdrawal: any } }>(`/withdrawals/admin/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body)
      })
  },

  // Disputes
  disputes: {
    raise: (bountyId: string, body: { reason: string; clientNotes?: string; talentNotes?: string }) =>
      request<{ success: boolean; data: { dispute: any } }>(`/disputes/${bountyId}/dispute`, {
        method: 'POST',
        body: JSON.stringify(body)
      }),
    list: (status?: string) => {
      const q = status ? `?status=${status}` : '';
      return request<{ success: boolean; data: { disputes: any[] } }>(`/disputes${q}`);
    },
    get: (id: string) => request<{ success: boolean; data: { dispute: any } }>(`/disputes/${id}`),
    resolve: (id: string, body: { decision: 'RELEASE_TO_TALENT' | 'REFUND_TO_CLIENT' | 'SPLIT_50_50'; adminNotes: string }) =>
      request<{ success: boolean; message: string }>(`/disputes/${id}/resolve`, {
        method: 'POST',
        body: JSON.stringify(body)
      })
  },

  // Reviews
  reviews: {
    add: (bountyId: string, body: { rating: number; comment?: string }) =>
      request<{ success: boolean; data: { review: any } }>(`/reviews/${bountyId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(body)
      }),
    listTalent: (talentId: string) =>
      request<{ success: boolean; data: { reviews: any[] } }>(`/reviews/talents/${talentId}`)
  }
};

export default api;
