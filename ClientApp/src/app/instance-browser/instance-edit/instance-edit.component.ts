import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription, forkJoin, of, switchMap } from 'rxjs';
import { DataState } from 'src/app/shared/enums/data-state';
import { InstanceConnectionInfo } from 'src/app/shared/models/instance-connection-info.model';
import { Instance } from 'src/app/shared/models/instance.model';
import { Subform } from 'src/app/shared/models/subform.model';
import { InstanceConnectionInfoService } from 'src/app/shared/services/instance-connection-info.service';
import { InstanceService } from 'src/app/shared/services/instance.service';

@Component({
  selector: 'app-instance-edit',
  templateUrl: './instance-edit.component.html'
})
export class InstanceEditComponent {
  instanceId: number;
  private _instance: Instance | null;
  private _instConnInfos: InstanceConnectionInfo[] | null;

  get instance() { return this._instance; }
  set instance(value) {
    if (this.instanceSub != null)
      this.instanceSub.unsubscribe();

    this._instance = value;
  }
  get instConnInfos() { return this._instConnInfos; }
  set instConnInfos(value) {
    if (this.connectionInfoSub != null)
      this.connectionInfoSub.unsubscribe();

    this._instConnInfos = value;
  }

  instanceSub: Subscription;
  connectionInfoSub: Subscription;

  public dataStateEnum = DataState;
  dataState: DataState;
  dataFetchTimeout: number | null = null;

  editConnInfoForms: Subform[];

  newInstConnInfos: InstanceConnectionInfo[];
  appendConnInfoForms: Subform[];

  markedDeleted: number[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private instanceService: InstanceService,
    private instConnInfoService: InstanceConnectionInfoService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.dataState = DataState.Loading;
        this.instanceId = params['id'];

        // Clear previous data
        this.instance = null;
        this.instConnInfos = null;
        this.editConnInfoForms = [];

        this.newInstConnInfos = [];
        this.appendConnInfoForms = [];
        this.markedDeleted = [];

        if (this.instanceId == null) {
          this.dataState = DataState.Available;
          return;
        }

        // Subscribe to updates
        this.instanceSub = this.instanceService.instances$.subscribe(
          (instances: Instance[]) => {
            this.updateInstance();
          }
        );
        // Getting instance
        this.updateInstance();

        // Subscribe to updates of instance connection info
        this.connectionInfoSub = this.instConnInfoService.instConnInfo$.subscribe(
          (connInfo: { instanceId: number, instConnInfos: InstanceConnectionInfo[] }) => {
            if (connInfo.instanceId != this.instanceId)
              return;
            this.instConnInfos = connInfo.instConnInfos;
          }
        );
        // Getting instance connetion info
        const initInstConnInfo = this.instConnInfoService.getInstanceConnectionInfos(this.instanceId);
        if (initInstConnInfo != null) {
          this.instConnInfos = initInstConnInfo;
        }
      }
    );
  }

  updateInstance() {
    const instanceResult = this.instanceService.getInstance(this.instanceId);
    if (!instanceResult) {
      if (this.dataState == DataState.Failed)
        return;
      if (this.dataFetchTimeout != null)
        return;
      this.dataFetchTimeout = window.setTimeout(() => {
        this.dataState = DataState.Failed;
        this.dataFetchTimeout = null;
      }, 5000);
      return;
    }

    if (this.dataFetchTimeout != null) {
      window.clearTimeout(this.dataFetchTimeout);
      this.dataFetchTimeout = null;
    }

    this.instance = instanceResult;
    this.dataState = DataState.Available;
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    // Validate
    if (!this.checkValidityOfSubforms())
      return;

    this.dataState = DataState.Loading;
    // Update or create Instance
    const formInstance = new Instance(
      this.instance ? this.instance.id : -1,
      value.name,
      value.description,
      value.osName
    );

    let instanceObservable;
    if (this.instanceId == null)
      instanceObservable = this.instanceService.createInstance(formInstance);
    else
      instanceObservable = this.instanceService.updateInstance(formInstance);

    instanceObservable!.pipe(
      switchMap(res => {
        let observables: Observable<unknown>[] = [];

        let currentIsntanceId = this.instanceId;
        if (!this.instanceId) {
          const resInstance = res as Instance;
          currentIsntanceId = resInstance.id;
        }

        // Create new connections
        this.appendConnInfoForms.forEach(form => {
          const instConnInfo = new InstanceConnectionInfo(
            form.id,
            form.value.ip,
            form.value.username,
            form.value.credentials.password,
            form.value.credentials.key,
            form.value.credentials.passphrase);

          const observable = this.instConnInfoService.createConnectionInfo(currentIsntanceId, instConnInfo);
          if (observable != null)
            observables.push(observable);
        });

        // Delete marked instance connections
        this.markedDeleted.forEach(currentId => {
          const observable = this.instConnInfoService.deleteConnectionInfo(currentId);
          if (observable != null)
            observables.push(observable);
        });

        // Update edited instance connections
        if (!this.editConnInfoForms?.length)
          observables.push(of(null));

        this.editConnInfoForms?.forEach(form => {
          if (this.markedDeleted.some((markElem) => markElem == form.id))
            return;

          const instConnInfo = new InstanceConnectionInfo(
            form.id,
            form.value.ip,
            form.value.username,
            form.value.credentials.password,
            form.value.credentials.key,
            form.value.credentials.passphrase);

          const observable = this.instConnInfoService.updateConnectionInfo(instConnInfo);
          if (observable != null)
            observables.push(observable);
        });

        return forkJoin(observables);
      })
    ).subscribe(() => this.router.navigate(['']));
  }

  // Existing connection methods

  checkValidityOfSubforms() {
    return !this.editConnInfoForms.some((element) => !element.valid && !this.markedDeleted.some((markElem) => markElem == element.id))
      && !this.appendConnInfoForms.some((element) => element.value == null || !element.valid);
  }

  onConnectionSubmit(form: Subform) {
    const index = this.editConnInfoForms.findIndex((element) => element.id == form.id);
    if (index == -1) {
      this.editConnInfoForms.push(form);
      return;
    }
    this.editConnInfoForms[index] = form;
  }

  onConnectionEditCancel(index: number) {
    if (this.instConnInfos == null)
      return;

    const id = this.instConnInfos[index].id;
    // Remove deleted mark
    const deletedIndex = this.markedDeleted.findIndex((element) => element == id);
    if (deletedIndex != -1)
      this.markedDeleted.splice(deletedIndex, 1);
    // Delete changes
    this.deleteConnSubform(id);
  }

  onConnectionDelete(index: number) {
    if (this.instConnInfos == null)
      return;
    this.markedDeleted.push(this.instConnInfos[index].id);
  }

  deleteConnSubform(id: number) {
    const formIndex = this.editConnInfoForms.findIndex((element) => element.id == id);
    if (formIndex != -1) {
      this.editConnInfoForms.splice(formIndex, 1);
    }
  }

  // New connection methods

  onNewConnectionCreated() {
    let newId = -1;
    if (this.newInstConnInfos.length)
      newId = Math.min(...this.newInstConnInfos.map(element => element.id)) - 1;
    const newConnInfo = new InstanceConnectionInfo(newId, '', '', null, null, null);

    this.newInstConnInfos.push(newConnInfo);
    this.appendConnInfoForms.push(new Subform(newId, false, null));
  }

  onNewConnectionSubmit(form: Subform) {
    const index = this.appendConnInfoForms.findIndex((element) => element.id == form.id);
    this.appendConnInfoForms[index] = form;
  }

  onNewConnectionDelete(index: number) {
    const id = this.newInstConnInfos[index].id;
    this.deleteNewConnSubform(id);
    // Delete component
    this.newInstConnInfos.splice(index, 1);
  }

  deleteNewConnSubform(id: number) {
    const formIndex = this.appendConnInfoForms.findIndex((element) => element.id == id);
    if (formIndex != -1) {
      this.appendConnInfoForms.splice(formIndex, 1);
    }
  }

  ngOnDestroy() {
    if (this.instanceSub != null)
      this.instanceSub.unsubscribe();
    if (this.connectionInfoSub != null)
      this.connectionInfoSub.unsubscribe();
  }
}
