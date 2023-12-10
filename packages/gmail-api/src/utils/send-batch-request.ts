import {
  GMAIL_BATCH_SEPARATOR_PREFIX,
  GMAIL_MAX_BATCH_REQUEST_SIZE,
} from "../constants";

const GMAIL_BATCH_ENDPOINT = "https://gmail.googleapis.com/batch/gmail/v1";

export async function sendBatchRequest({
  accessToken,
  reqs,
}: {
  emailId: string;
  accessToken: string;
  reqs: {
    contentType: string;
    type: "POST" | "GET";
    url: string;
    body?: Record<string, string | string[]>;
  }[];
}) {
  if (reqs.length > GMAIL_MAX_BATCH_REQUEST_SIZE) {
    throw new Error(
      `Cannot batch more than ${GMAIL_MAX_BATCH_REQUEST_SIZE} requests.`,
    );
  }

  const url = new URL(GMAIL_BATCH_ENDPOINT);
  const boundary = GMAIL_BATCH_SEPARATOR_PREFIX + Date.now();
  const headers = new Headers({
    "Content-Type": `multipart/form-data; boundary=${boundary}`,
    Authorization: `Bearer ${accessToken}`,
  });

  const batchRequestBody =
    reqs
      .map((req, index) => {
        const bodyString = req.body
          ? `\r\n${JSON.stringify(req.body, null, 2)}\r\n`
          : "";

        const individualRequest =
          `--${boundary}\r\n` +
          `Content-Type: ${req.contentType}\r\n` +
          `Content-ID: <${index + 1}>\r\n\r\n` +
          `${req.type} ${req.url}\r\n` +
          bodyString;
        return individualRequest;
      })
      .join("") + `--${boundary}--`;

  const res = await fetch(url, {
    method: "POST",
    headers: headers,
    body: batchRequestBody,
  });

  return res;
}
