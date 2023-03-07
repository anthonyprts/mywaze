import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class MapsService {

    constructor(private http: HttpClient) { }

    getCoordonneeDepart(adresse: string): Observable<any> {
        var tab:Number[];
        return this.http.get(`https://api-adresse.data.gouv.fr/search/?q=${adresse}`)
   
    }

    getCoordonneeArrivee(adresse: string): Observable<any> {
        var tab: Number[];
        return this.http.get(`https://api-adresse.data.gouv.fr/search/?q=${adresse}`)

    }

}