export interface IRequest {
    params: any;
    query: any;
    headers: { [key: string]: string };
    body: any;
    baseUrl: string;
    originalUrl: string;
    httpVersion: string;
    url: string;
    method: string;
}
