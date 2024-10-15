type Variables = Record<string, unknown>

export function callApi<T>(strings: TemplateStringsArray): Promise<T>
export function callApi<T>(variables: Variables): (strings: TemplateStringsArray) => Promise<T>
export function callApi(p: TemplateStringsArray | Variables) {
  if (Array.isArray(p)) {
    return fetchApi(p[0])
  }
  return (strings: TemplateStringsArray) => fetchApi(strings[0], p as Variables)
}

const fetchApi = async (query: string, variables?: Variables) => {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      })
    })
  
    if (!response.ok) {
      const errorMessage = await response.text()
      throw new Error(`Network response was not ok: ${errorMessage}`)
    }
  
    const json = await response.json()
  
    if (json.errors) {
      throw new Error(json.errors[0].message)
    }
  
    return json.data
  } catch (error) {
    throw error
  }
}
