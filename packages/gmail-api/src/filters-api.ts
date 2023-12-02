type Filter = {
  id: string;
  criteria: {
    from: string;
  };
  action: {
    addLabelIds?: [string];
    removeLabelIds?: [string];
    forward?: string;
  };
};

export async function createFilter<T extends Omit<Filter, "id">>({
  accessToken,
  emailId,
  filter,
}: {
  accessToken: string;
  emailId: string;
  filter: T;
}) {
  const url = new URL(
    `https://gmail.googleapis.com/gmail/v1/users/me/settings/filters`,
  );
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const res = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(filter),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to get history for ${emailId}. cause: ${await res.text()}`,
    );
  }

  return res.json() as Promise<T & { id: string }>;
}

export async function getFilters({
  accessToken,
  emailId,
}: {
  accessToken: string;
  emailId: string;
}) {
  const url = new URL(
    `https://gmail.googleapis.com/gmail/v1/users/me/settings/filters`,
  );
  const headers = new Headers({
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  });

  const res = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  if (!res.ok) {
    throw new Error(
      `Failed to get history for ${emailId}. cause: ${await res.text()}`,
    );
  }

  return res.json() as Promise<{ filter: Filter[] }>;
}
