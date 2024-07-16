// src/app/mock-data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer , Transaction } from './Model/customer.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'https://ahmedshahatcs.github.io/Api/db.json'; 

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<Customer[]> {
    return this.http.get<any>(`${this.baseUrl}`).pipe(
      map(data => data.customers as Customer[])
    );
  }

  getTransaction(customer_id: number): Observable<Transaction[]> {
    return this.http.get<any>(`${this.baseUrl}`).pipe(
      map(data => data.transactions.filter((transaction: Transaction) => transaction.customer_id === customer_id))
    );
  }
}
