import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient

@Component({
  selector: 'app-nyoba-component',
  templateUrl: './nyoba.component.html',
})
export class NyobaComponent implements OnInit {
  constructor(private http: HttpClient) { } // Inject HttpClient

  ngOnInit(): void {
    this.sendTestRequest();
  }

  sendTestRequest() {
    this.http.get('http://localhost:8000/test').subscribe(
      (response) => {
        console.log('Test GET Response:', response);
      },
      (error) => {
        console.error('Test GET Error:', error);
      }
    );
  }
}
