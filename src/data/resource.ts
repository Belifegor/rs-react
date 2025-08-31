import type { Co2Dataset } from "../types/co2";

type Co2Resource = {
  read(): Co2Dataset;
  cancel(): void;
};

export function createCo2Resource(url: string): Co2Resource {
  let status: "pending" | "success" | "error" = "pending";
  let result: unknown;
  const ac = new AbortController();

  const suspender = fetch(url, { cache: "no-store", signal: ac.signal })
    .then((r) => {
      if (!r.ok) {
        throw new Error(`Failed to fetch data: ${r.status} ${r.statusText}`);
      }
      return r.json() as Promise<Co2Dataset>;
    })
    .then(
      (data) => {
        status = "success";
        result = data;
      },
      (e: unknown) => {
        status = "error";
        result = e;
      },
    );

  return {
    read(): Co2Dataset {
      if (status === "pending") throw suspender;
      if (status === "error") throw result;
      return result as Co2Dataset;
    },
    cancel() {
      ac.abort();
    },
  };
}
