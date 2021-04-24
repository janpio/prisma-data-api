import { Prisma } from "@prisma/client";
import fetch from 'node-fetch';

type DataApiOptions = {
  endpoint: string;
};

export const DataApi = (options: DataApiOptions): Prisma.Middleware => {
  const endpoint = options.endpoint;

  return async (params, next) => {
    console.log('')
    console.log('Query:', params)

    const response = await fetch(endpoint, {method:'POST', body: JSON.stringify(params), headers: { 'Content-Type': 'application/json' }});
    const result = await response.json();

    // TODO error handling

    return result;
  };
};