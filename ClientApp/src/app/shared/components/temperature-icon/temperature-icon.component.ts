import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Temperature } from '../../enums/temperature';
import { EnumHelper } from '../../utils';

@Component({
  selector: 'app-temperature-icon',
  templateUrl: './temperature-icon.component.html'
})
export class TemperatureIconComponent implements OnChanges {
  @Input() degrees: number;
  public temperatureEnum = Temperature;
  temperature: Temperature;

  ngOnChanges(changes: SimpleChanges) {
    let keys = EnumHelper.getKeys(Temperature)
      .map(key => parseFloat(key));

    // Assign and remove first element
    this.temperature = keys[0];
    keys = keys.slice(1);

    keys.every(key => {
      if (this.degrees < key)
        return false;
      this.temperature = key;
      return true;
    });
  }
}
