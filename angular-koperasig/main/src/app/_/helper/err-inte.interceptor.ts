import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errInteInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router)
  return next(req).pipe(catchError((err)=> {
    
    if([401,403].includes(JSON.parse(err.status))){
      router.navigate(['/login'])
    }

    const e = err.error.status || err.statusText;

    return throwError(() => e)
}));
};
