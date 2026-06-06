const KEYS = {
  CLIENTS: 'csmhub_clients',
  KB_TEMPLATES: 'csmhub_kb_templates',
};

export function getClients() {
  try {
    const data = localStorage.getItem(KEYS.CLIENTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveClients(clients) {
  localStorage.setItem(KEYS.CLIENTS, JSON.stringify(clients));
}

export function addClient(client) {
  const clients = getClients();
  const newClient = { ...client, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  saveClients([...clients, newClient]);
  return newClient;
}

export function updateClient(id, updates) {
  const clients = getClients();
  const updated = clients.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  saveClients(updated);
  return updated;
}

export function deleteClient(id) {
  const clients = getClients().filter((c) => c.id !== id);
  saveClients(clients);
}

export function getKBTemplate(id) {
  try {
    const data = localStorage.getItem(`${KEYS.KB_TEMPLATES}_${id}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveKBTemplate(id, content) {
  localStorage.setItem(`${KEYS.KB_TEMPLATES}_${id}`, JSON.stringify({ content, updatedAt: new Date().toISOString() }));
}
