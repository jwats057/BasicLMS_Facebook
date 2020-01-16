import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private http: HttpClient) { }

  public uploadImage(image: File): Observable<Response> {
    const formData = new FormData();

    formData.append('image', image);

    // @ts-ignore
    return this.http.post(`${environment.apiAddress}/utils/image-upload`, formData);
  }
  /**
   * get admin logged actions for review
   */
  getAdminLogs() {
    return this.http.get(`${environment.apiAddress}/utils/logs`);
  }

}
