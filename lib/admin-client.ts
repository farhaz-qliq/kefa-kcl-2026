function token(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("kefa_admin_token") ?? "";
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token()}`,
  };
}

async function handle(res: Response) {
  const data = await res.json().catch(() => ({ error: res.statusText }));
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

export const api = {
  get:    (url: string)                    => fetch(url).then(handle),
  post:   (url: string, body: unknown)     => fetch(url, { method: "POST",   headers: authHeaders(), body: JSON.stringify(body) }).then(handle),
  patch:  (url: string, body: unknown)     => fetch(url, { method: "PATCH",  headers: authHeaders(), body: JSON.stringify(body) }).then(handle),
  delete: (url: string)                    => fetch(url, { method: "DELETE", headers: authHeaders() }).then(handle),
};
