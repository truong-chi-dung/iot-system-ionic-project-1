import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Machine } from 'src/machine';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  constructor(private http: HttpClient) { }

  getMachinesUrl = 'http://192.168.1.113:8080/nidec2/statusJson';

  getMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>(this.getMachinesUrl);
  }
}
