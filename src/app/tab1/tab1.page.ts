import { Component, OnDestroy, OnInit } from '@angular/core';

import { AlertController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

import { Observable, Subject, interval, Subscription } from 'rxjs';
import { switchMap, takeUntil, map, filter } from 'rxjs/operators';

import { Machine } from 'src/machine';
import { MachineService } from '../machine.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnDestroy, OnInit{

  constructor(
    private machineService: MachineService,
    private alertController: AlertController,
    private localNotifications: LocalNotifications
  ) {}

  
  public machinesMap$: Observable<Machine[]>;
  private refreshMachineData$: Observable<Machine[]>;
  public emgMachines$: Observable<Machine[]>;

  private killTrigger: Subject<void> = new Subject();  

  public machines$: Observable<Machine[]>;
  
  ngOnInit() {
    this.machinesMap$ = this.machineService.getMachines();
    this.refreshMachineData$ = interval(2000)
    .pipe(
      takeUntil(this.killTrigger),
      switchMap(()=>this.machinesMap$)
    );    
    this.machines$ = this.refreshMachineData$;

    this.emgMachines$ = this.refreshMachineData$.pipe(
      map(machines => machines.filter(machine => machine.status===2))
    );
    this.emgMachines$.subscribe(
      (emgMachinesInfo) => {

        emgMachinesInfo.map(
          
          emgMachineInfo => {
            this.localNotifications.schedule({
              title: `${emgMachineInfo.machineName}`,
              text: 'Emergency stop'
            });

          }
        )
      }
    );
  }

  ngOnDestroy(){
    this.killTrigger.next();
  }  

  /*public machines$: Observable<Machine[]>;
  public emgMachines$: Observable<Machine[]>;

  ngOnInit() {
    
    this.machines$ = this.machineService.getMachines();
    
    this.emgMachines$ = this.machineService.getMachines().pipe(
      map(machines => machines.filter(machine => machine.status===2))
    );

    this.emgMachines$.subscribe(
      (emgMachinesInfo) => {
        emgMachinesInfo.map(
          emgMachineInfo => {
            this.localNotifications.schedule({
              title: `${emgMachineInfo.machineName}`,
              text: 'Fuck up'
            });
            console.log(emgMachineInfo.machineName);
          }
        )
      }
    );
  }*/

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
      message: `This is the detail of ${this.machineStatus}`
    });

    await alert.present();
  }

}
