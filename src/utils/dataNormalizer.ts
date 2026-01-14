import { Deserializer } from 'ts-jsonapi'

export const format = new Deserializer({ keyForAttribute: 'camelCase' })

export type RawResponse = {
    meta?: Record<string, unknown> | null
    data?: Array<unknown> | Record<string, unknown> | null
}

export type Result<T, V> = {
    data: T
    meta: V
}

export async function dataNormalizer<
    NormalizedData,
    MetaData extends Record<string, unknown>,
    RawData extends RawResponse = RawResponse,
>(rawData: RawData): Promise<Result<NormalizedData, MetaData>> {
    const data = (await format.deserialize(rawData)) as NormalizedData
    const meta = (rawData.meta ?? {}) as MetaData
    return { data, meta }
}