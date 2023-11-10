import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Temperature } from '../../temperature';

@Component({
  selector: 'app-temperature-icon',
  templateUrl: './temperature-icon.component.html',
  styles: ['']
})
export class TemperatureIconComponent implements OnChanges {
  @Input() degrees: number;
  public temperatureEnum = Temperature;
  temperature: Temperature;

  ngOnChanges(changes: SimpleChanges) {
    let keys = Object.keys(Temperature)
      .filter(key => !isNaN(Number(key)))
      .map(key => parseFloat(key))

    // Assign and remove first element
    this.temperature = keys[0];
    keys = keys.slice(1);

    keys.forEach(key => {
      if (this.degrees > key)
        this.temperature = key;
    });
  }
}
