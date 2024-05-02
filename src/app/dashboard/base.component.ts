import { ToastrService } from "ngx-toastr";

export class BaseComponent {

    constructor(protected toastrService: ToastrService) { 
    }
    
    checkAccessDenied(e: any): boolean {
        if (e.status == 401) {
            this.toastrService.error('Check your credentials and try again.', 'Access denied.');
            return true
        } else { return false; }
    }
}