// Author: Preston Lee

import { Service } from '../service/service';

export class Dashboard {
    public id: string = '';
    public name: string = '';

    public services: Service[] = [];
    
    public created_at: Date | null = null;
    public updated_at: Date | null = null;
}