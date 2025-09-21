export async function postJson(url: string, body: any) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw data || new Error('Request failed')
  return data
}

export async function getJson(url: string) {
  const res = await fetch(url)
  const data = await res.json().catch(() => null)
  if (!res.ok) throw data || new Error('Request failed')
  return data
}
