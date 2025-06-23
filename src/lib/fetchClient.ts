const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const authUtils = {
  setAccessToken: (accessToken: string): void => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("accessToken", accessToken);
      } catch (e) {
        console.error("Failed to set access token in localStorage:", e);
      }
    }
  },
  getAccessToken: (): string | null => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("accessToken");
      } catch (e) {
        console.error("Failed to get access token from localStorage:", e);
        return null;
      }
    }
    return null;
  },
  clearAccessToken: (): void => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("accessToken");
      } catch (e) {
        console.error("Failed to clear access token from localStorage:", e);
      }
    }
  },
  refreshAccessToken: async (): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: {},
      });

      if (!response.ok) {
        throw new Error("토큰 갱신 API 호출 실패");
      }

      const responseText = await response.text();
      if (!responseText) {
        throw new Error("토큰 갱신 응답 비어있음");
      }

      const refreshData: { accessToken?: string } = JSON.parse(responseText);
      if (!refreshData?.accessToken) {
        throw new Error("갱신 응답에 accessToken 없음");
      }

      authUtils.setAccessToken(refreshData.accessToken);
      return refreshData.accessToken;
    } catch (error: any) {
      authUtils.clearAccessToken();
      throw new Error(`토큰 갱신 중 오류: ${error.message}`);
    }
  },
};

export const defaultPandaFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  let processedBody = options.body;

  if (
    processedBody &&
    typeof processedBody === "object" &&
    !(processedBody instanceof FormData) &&
    ((requestHeaders as Record<string, string>)["Content-Type"] || "")
      .toLowerCase()
      .includes("application/json")
  ) {
    try {
      processedBody = JSON.stringify(processedBody);
    } catch (e) {
      throw new Error("요청 데이터 JSON 변환 실패");
    }
  } else if (processedBody instanceof FormData) {
    delete (requestHeaders as Record<string, string>)["Content-Type"];
  }

  const config: RequestInit = {
    ...options,
    headers: requestHeaders,
    body: processedBody as BodyInit,
  };
  const response = await fetch(url, config);

  if (response.status === 204) {
    return null;
  }

  const responseText = await response.text();

  if (!response.ok) {
    const error = new Error(
      `API 오류 ${response.status}${
        responseText ? `: ${responseText.substring(0, 100)}` : ""
      }`
    );

    (error as any).status = response.status;
    throw error;
  }

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText) as T;
  } catch (e) {
    throw new Error("API 응답 JSON 파싱 실패");
  }
};

export const cookiePandaFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> => {
  let accessToken = authUtils.getAccessToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const performFetchWithToken = async (token: string): Promise<Response> => {
    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
    let processedBody = options.body;

    if (
      processedBody &&
      typeof processedBody === "object" &&
      !(processedBody instanceof FormData) &&
      ((requestHeaders as Record<string, string>)["Content-Type"] || "")
        .toLowerCase()
        .includes("application/json")
    ) {
      try {
        processedBody = JSON.stringify(processedBody);
      } catch (e) {
        throw new Error("요청 데이터 JSON 변환 실패");
      }
    } else if (processedBody instanceof FormData) {
      delete (requestHeaders as Record<string, string>)["Content-Type"];
    }
    const config: RequestInit = {
      ...options,
      headers: requestHeaders,
      body: processedBody as BodyInit,
    };
    return fetch(url, config);
  };

  if (!accessToken) {
    try {
      accessToken = await authUtils.refreshAccessToken();
    } catch (refreshError: any) {
      throw new Error(`초기 토큰 갱신 실패: ${refreshError.message}`);
    }
  }

  let response = await performFetchWithToken(accessToken);

  if (response.status === 401) {
    try {
      const newAccessToken = await authUtils.refreshAccessToken();
      response = await performFetchWithToken(newAccessToken);
    } catch (refreshError: any) {
      // <--- 여기에 중괄호가 빠져 있었습니다!
      throw new Error(`401 후 토큰 갱신 실패: ${refreshError.message}`);
    }
  }

  if (response.status === 204) {
    return null;
  }

  const responseText = await response.text();

  if (!response.ok) {
    const error = new Error(
      `API 오류 ${response.status}${
        responseText ? `: ${responseText.substring(0, 100)}` : ""
      }`
    );
    (error as any).status = response.status;
    throw error;
  }

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText) as T;
  } catch (e) {
    throw new Error("API 응답 JSON 파싱 실패");
  }
};
