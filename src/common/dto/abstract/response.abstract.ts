export interface ManyRecordsResponse<T> {
  metadata: {
    total: number;
  };
  data: T[];
}

export interface SingleRecordResponse<T> {
  data: T;
}

export namespace ResponseWrap {
  export function many<T>(data: T[]): ManyRecordsResponse<T> {
    return {
      metadata: {
        total: data.length,
      },
      data,
    };
  }

  export function single<T>(data: T): SingleRecordResponse<T> {
    return {
      data,
    };
  }
}
