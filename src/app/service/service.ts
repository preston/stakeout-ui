export class Service {

    public id: string = '';
    public name: string = '';
    public host: string = '';
    public port: number = 0;
    public ping: boolean = false;
    public ping_threshold: number = 500;
    public ping_last: number = -1;
    public http: boolean = false;
    public https: boolean = false;
    public http_path: string = '';
    public http_path_last: boolean = true;
    public https_path_last: boolean = true;
    public http_xquery: string = '';
    public http_xquery_last: boolean = true;
    public http_preview: boolean = false;
    public http_screenshot: string = '';

    public checked_at: Date | null = null;

    public created_at: Date | null = null;
    public updated_at: Date | null = null;
}