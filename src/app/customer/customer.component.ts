import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../DataService'
import { Customer, Transaction } from '../Model/customer.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  Customer: Customer[] = [];
  customersTransactions: any[] = [];
  customer_serch: any[] = [];
  SearchByName: string = '';
  TransactionAmountSearch: number | null = null;
  public graph: any;

  @ViewChild('Graphs') Graphs!: ElementRef;

  constructor(private _DataService: DataService) { }

  ngOnInit(): void {
    this._DataService.getCustomers().subscribe(Customer => {
      this.Customer = Customer;
      this.Transactions();
    });
  }

  private Transactions(): void {
    this.Customer.forEach(Customer => {
      this._DataService.getTransaction(Customer.id).subscribe(transactions => {
        const Total_Amount = transactions.reduce((acc, curr) => acc + curr.amount, 0);
        this.customersTransactions.push({
          ...Customer,
          Total_Amount: Total_Amount,
          Transaction_Number: transactions.length,
          transactions: transactions
        });
        this.Search_of_Customers();
      });
    });
  }

  Search_of_Customers(): void {
    this.customer_serch = this.customersTransactions.filter(customer => {
      const Name = this.SearchByName ? customer.name.toLowerCase().includes(this.SearchByName.toLowerCase()) : true;
      const Amount = this.TransactionAmountSearch !== null ? customer.Total_Amount === this.TransactionAmountSearch : true;
      return Name && Amount;
    });
  }

  Search_by_name(): void {
    this.TransactionAmountSearch = null;
    this.Search_of_Customers();
  }

  Search_by_tran(): void {
    this.SearchByName = '';
    this.Search_of_Customers();
  }

  Chart(customerId: number): void {
    const customer = this.customersTransactions.find(c => c.id === customerId);
    if (!customer) return;

    const transactions = customer.transactions;
    const dailyTotals = transactions.reduce((acc: { [key: string]: number }, transaction: Transaction) => {
      const date = transaction.date;
      acc[date] = (acc[date] || 0) + transaction.amount;
      return acc;
    }, {} as { [key: string]: number });

    const labels = Object.keys(dailyTotals);
    const data = Object.values(dailyTotals);

    if (this.graph) {
      this.graph.destroy();
    }
    this.graph = new Chart("Graph", {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: "Graph of Transaction ",
          data: data,
          backgroundColor: 'white',
          borderColor: 'white',
          borderWidth: 2,
          fill: false
        }]
      },
      options: {
        aspectRatio: 2.5,
        scales: {
          x: {
            ticks: {
              color: 'white'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.5)'
            }
          },
          y: {
            ticks: {
              color: 'white'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.5)' // 
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'white'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            titleColor: 'black',
            bodyColor: 'black',
            borderColor: 'black',
            borderWidth: 1
          }
        }
      }
    });
  }

  Select_Customer(customerId: number): void {
    this.Chart(customerId);

  }


}
