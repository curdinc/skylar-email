export class MultipartMixedService {
  static async parseAsync(r: Response): Promise<MultipartMixedEntry[]> {
    const text = await r.text();
    const contentType = r.headers.get("Content-Type");

    return this.parse(text, contentType);
  }

  static parse(body: string, contentType: string): MultipartMixedEntry[] {
    const result: MultipartMixedEntry[] = [];

    const contentTypeData = this.parseHeader(contentType);
    const boundary = contentTypeData.directives.get("boundary");
    if (!boundary) {
      throw new Error("Invalid Content Type: no boundary");
    }
    const boundaryText = "--" + boundary;

    let line: string;
    let pos = -1;
    let currEntry: MultipartMixedEntry = null;
    let parsingEntryHeaders = false;
    let parsingBodyHeaders = false;
    let parsingBodyFirstLine = false;

    do {
      [line, pos] = this.nextLine(body, pos);

      if (line.length == 0 || line == "\r") {
        // Empty Line
        if (parsingEntryHeaders) {
          // Start parsing Body Headers
          parsingEntryHeaders = false;
          parsingBodyHeaders = true;
        } else if (parsingBodyHeaders) {
          // Start parsing body
          parsingBodyHeaders = false;
          parsingBodyFirstLine = true;
        } else if (currEntry != null) {
          // Empty line in body, just add it
          currEntry.body += (parsingBodyFirstLine ? "" : "\n") + "\n";
          parsingBodyFirstLine = false;
        }

        // Else, it's just empty starting lines
      } else if (line.startsWith(boundaryText)) {
        // Remove one extra line from the body
        if (currEntry != null) {
          currEntry.body = currEntry.body.substring(
            0,
            currEntry.body.length - 1,
          );
        }

        // Check if it is the end
        if (line.endsWith("--")) {
          return result;
        }

        // If not, it's the start of new entry
        currEntry = new MultipartMixedEntry();
        result.push(currEntry);
        parsingEntryHeaders = true;
      } else {
        if (!currEntry) {
          // Trash content
          throw new Error("Error parsing response: Unexpected data.");
        }

        // Add content
        if (parsingEntryHeaders || parsingBodyHeaders) {
          // Headers
          const headers = parsingEntryHeaders
            ? currEntry.entryHeaders
            : currEntry.bodyHeaders;
          const headerParts = line.split(":", 2);

          if (headerParts.length == 1) {
            headers.append("X-Extra", headerParts[0].trim());
          } else {
            headers.append(headerParts[0]?.trim(), headerParts[1].trim());
          }
        } else {
          // Body
          currEntry.body += (parsingBodyFirstLine ? "" : "\n") + line;
          parsingBodyFirstLine = false;
        }
      }
    } while (pos > -1);

    return result;
  }

  static parseHeader(headerValue: string): HeaderData {
    if (!headerValue) {
      throw new Error("Invalid Header Value: " + headerValue);
    }

    const result = new HeaderData();
    result.fullText = headerValue;

    const parts = headerValue.split(/;/g);
    result.value = parts[0];

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i].trim();
      const partData = part.split("=", 2);

      result.directives.append(partData[0], partData[1]);
    }

    return result;
  }

  private static nextLine(text: string, lastPos: number): [string, number] {
    const nextLinePos = text.indexOf("\n", lastPos + 1);

    let line = text.substring(
      lastPos + 1,
      nextLinePos == -1 ? null : nextLinePos,
    );
    while (line.endsWith("\r")) {
      line = line.substr(0, line.length - 1);
    }

    return [line, nextLinePos];
  }
}

export class MultipartMixedEntry {
  entryHeaders: Headers = new Headers();
  bodyHeaders: Headers = new Headers();

  body = "";

  json<T = any>(): T {
    return JSON.parse(this.body);
  }
}

export class HeaderData {
  fullText: string;
  value: string;
  directives: Headers = new Headers();
}
