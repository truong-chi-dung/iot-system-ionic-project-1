import { Component, OnDestroy, OnInit } from '@angular/core';

import { AlertController } from '@ionic/angular';

import { Observable, Subject, interval } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { Machine } from 'src/machine';
import { MachineService } from '../machine.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  constructor(
    private machineService: MachineService,
    public alertController: AlertController
  ) {}

  //public machinesMap$: Observable<Machine[]> = this.machineService.getMachines();  
  //private killTrigger: Subject<void> = new Subject();
  //private refreshMachineData$: Observable<Machine[]> = interval(10000)
  //.pipe(
  //  takeUntil(this.killTrigger),
  //  switchMap(()=>this.machinesMap$)
  //);
  //public machines$: Observable<Machine[]> = this.refreshMachineData$;
  //ngOnDestroy(){
  //  this.killTrigger.next();
  //}  

  public machines$: Observable<Machine[]>;

  ngOnInit() {
    this.machines$ = this.machineService.getMachines();
  }

  machineStatus: String;

  async onSelectMachine(machine: Machine) {    

    if (machine.status==0) {
      this.machineStatus = 'Stop';
    } else if(machine.status==1) {
      this.machineStatus = 'Running';
    } else if(machine.status==2) {
      this.machineStatus = 'Emergency Stop';
    }

    const alert = await this.alertController.create({
      header: `${machine.machineName} Detail`,
      subHeader: `${this.machineStatus}`,
      message: 'This is the alert message'
    });

    await alert.present();
  }

}
