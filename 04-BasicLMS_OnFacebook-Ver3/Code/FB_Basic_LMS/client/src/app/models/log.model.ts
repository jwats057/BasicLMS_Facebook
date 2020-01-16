export interface Log {
    id: string;
    time: Date;
    context: Context;
    description: string;
    user: string;
}

export interface Context {
    method: string;
    params: any[];
    result: any;
}

export interface LogDay {
    date: Date;
    logs: Log[];
}
