export class Service {

    public id: string = '';
    public host: string = '';
    public name: string = '';
    public ping: boolean = true;
    public ping_threshold: number = 500;
    public ping_last: number = -1;
    public http: boolean = true;
    public https: boolean = true;
    public http_path: string = '';
    public http_path_last: boolean = true;
    public https_path_last: boolean = true;
    public http_xquery: string = '';
    public http_xquery_last: boolean = true;
    public http_preview: boolean = true;
    public http_screenshot: string = '';

    public checked_at: Date | null = null;

    public created_at: Date | null = null;
    public updated_at: Date | null = null;
}