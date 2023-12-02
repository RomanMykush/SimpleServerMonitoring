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

  instConnInfoForms: Subform[];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private instanceService: InstanceService,
    private instConnInfoService: InstanceConnectionInfoService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.dataState = DataState.Loading;
        this.instanceId = params['id'];

        this.instance = null;
        this.instConnInfos = null;
        this.instConnInfoForms = [];

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

    let isntanceObservable;
    if (this.instanceId == null)
      // TODO: Implement creation of instances
      throw new Error('Creation of instances was not implemented.');
    else
      isntanceObservable = this.instanceService.updateInstance(formInstance);

    isntanceObservable!.pipe(
      switchMap(() => {
        if (!this.instConnInfoForms?.length)
          return of(null);

        // Update edited instance connections
        let observables: Observable<unknown>[] = [];

        this.instConnInfoForms.forEach(element => {
          const instConnInfo = new InstanceConnectionInfo(
            element.id,
            element.value.ip,
            element.value.username,
            element.value.credentials.password,
            element.value.credentials.key,
            element.value.credentials.passphrase);

          const observable = this.instConnInfoService.updateConnectionInfo(instConnInfo);
          if (observable != null)
            observables.push(observable);
        });

        return forkJoin(observables);
      })
    ).subscribe(() => this.router.navigate(['']));
  }

  // Subforms methods

  checkValidityOfSubforms() {
    return !this.instConnInfoForms.some((element) => !element.valid);
  }

  onConnectionSubmit(form: Subform) {
    const index = this.instConnInfoForms.findIndex((element) => element.id == form.id);
    if (index == -1) {
      this.instConnInfoForms.push(form);
      return;
    }
    this.instConnInfoForms[index] = form;
  }

  onConnectionEditCancel(index: number) {
    if (this.instConnInfos == null)
      return;

    const id = this.instConnInfos[index].id;
    this.deleteSubform(id);
  }

  onConnectionDelete(index: number) {
    if (this.instConnInfos == null)
      return;

    const id = this.instConnInfos[index].id;
    this.deleteSubform(id);
    // Delete component
    this.instConnInfos.splice(index, 1);
  }

  onConnectionCreated() {
    // TODO: Implement connection creation form
  }

  deleteSubform(id: number) {
    const formIndex = this.instConnInfoForms.findIndex((element) => element.id == id);
    if (formIndex != -1) {
      this.instConnInfoForms.splice(formIndex, 1);
    }
  }

  ngOnDestroy() {
    if (this.instanceSub != null)
      this.instanceSub.unsubscribe();
    if (this.connectionInfoSub != null)
      this.connectionInfoSub.unsubscribe();
  }
}
