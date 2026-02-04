// Author: Preston Lee

import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export class BaseComponent {
  protected readonly toastrService = inject(ToastrService);

  checkAccessDenied(e: { status?: number }): boolean {
    if (e.status === 401) {
      this.toastrService.error(
        'Check your credentials and try again.',
        'Access denied.'
      );
      return true;
    }
    return false;
  }
}
