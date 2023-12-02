import { Component, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { InstanceConnectionInfo } from 'src/app/shared/models/instance-connection-info.model';
import { Subform } from 'src/app/shared/models/subform.model';
import { InstanceConnectionInfoService } from 'src/app/shared/services/instance-connection-info.service';

@Component({
  selector: 'app-connection-edit',
  templateUrl: './connection-edit.component.html'
})
export class ConnectionEditComponent {
  @Output() valueChanged = new EventEmitter<Subform>();
  @Output() canceled = new EventEmitter();
  @Output() deleted = new EventEmitter();

  @Input() initData: InstanceConnectionInfo;

  @ViewChild('editForm', { static: true }) editForm: NgForm;

  isModified: boolean = false;

  constructor(private instConnInfoService: InstanceConnectionInfoService) { }

  onChange() {
    const value = this.editForm.value;
    const output = new Subform(
      this.initData.id,
      value.credentials.password || value.credentials.key ? !!this.editForm.valid : false,
      value
    );
    this.isModified = true;
    this.valueChanged.emit(output);
  }

  onCancelEdit() {
    this.editForm.reset({ ip: this.initData.ip, username: this.initData.sshUsername });

    this.isModified = false;
    this.canceled.emit();
  }

  onDelete() {
    this.instConnInfoService.deleteConnectionInfo(this.initData.id)?.subscribe(() => {
      this.deleted.emit();
    });
  }
}
