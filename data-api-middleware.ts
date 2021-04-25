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

    const response = await fetch(endpoint, { method: 'POST', body: JSON.stringify(params), headers: { 'Content-Type': 'application/json' } });
    const result = await response.json();

    if (response.status === 200)
      return result

    console.log({ result })
    const error = JSON.parse(result.error)
    const message = JSON.parse(result.message)

    // TODO Use actual error type to throw
    // let errorType: string = result.type.substring(0, result.type.length - 1)
    // console.log({errorType})
    throw new Prisma.PrismaClientKnownRequestError(message, error.code, error.clientVersion, error.meta)
  };
};