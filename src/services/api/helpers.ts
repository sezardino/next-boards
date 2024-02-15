import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { NextResponse } from "next/server";
import { Schema, ZodIssue, z } from "zod";

export type BackendErrorResponse = NextResponse<{
  message: string;
  errors?: ZodIssue[];
}>;

type FetchProps<T extends z.Schema> = {
  endpoint: string;
  config?: AxiosRequestConfig;
  schema: T;
};

export abstract class AbstractApiModule {
  constructor(private readonly restUrl: string) {}

  protected async fetch<T extends z.Schema>(
    props: FetchProps<T>
  ): Promise<z.infer<T>> {
    const { endpoint, config, schema } = props;

    return axios<
      AxiosError<BackendErrorResponse>,
      AxiosResponse<z.infer<Schema>>
    >(`${this.restUrl}/${endpoint}`, { ...config }).then((res) => {
      const validationResponse = schema.safeParse(res.data);

      if (!validationResponse.success) {
        console.error(validationResponse.error);
      }

      return res.data as z.infer<T>;
    });
  }
}
