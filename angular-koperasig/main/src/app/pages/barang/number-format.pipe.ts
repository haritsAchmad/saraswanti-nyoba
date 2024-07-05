import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'customNumberFormat'
})
export class NumberFormatPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: number, digitsInfo: string = '1.2-2', locale: string = 'de-DE'): string | null {
    return this.decimalPipe.transform(value, digitsInfo, locale);
  }
}
