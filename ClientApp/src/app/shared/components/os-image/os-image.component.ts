import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { OperatingSystemEnumHelper } from '../../utils';

@Component({
  selector: 'app-os-image',
  templateUrl: './os-image.component.html'
})
export class OsImageComponent implements OnInit, OnChanges {
  @Input() osName: string;
  @Input() fontSize: string = "1.5rem";
  @Input() hideText: boolean = false;

  imgPath: string;

  ngOnInit() {
    this.update();
  }

  ngOnChanges() {
    this.update();
  }

  update() {
    let osType = OperatingSystemEnumHelper.getOsByName(this.osName);

    if (osType == null) {
      this.imgPath = OperatingSystemEnumHelper.defaultOsImage;
      return;
    }
    this.imgPath = OperatingSystemEnumHelper.getImagePath(osType);
  }
}
