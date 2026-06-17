import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bytes',
  standalone: true
})
export class BytesPipe implements PipeTransform {
  private readonly UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];
  private readonly UNITS_LONG = ['Bytes', 'Kilobytes', 'Megabytes', 'Gigabytes', 'Terabytes'];

  transform(bytes: number, precision: number = 2, long: boolean = false): string {
    if (!bytes || bytes <= 0) return '0 B';

    const units = long ? this.UNITS_LONG : this.UNITS;
    const exponent = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, exponent);

    return `${value.toFixed(precision)} ${units[exponent]}`;
  }
}
