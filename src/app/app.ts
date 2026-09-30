import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { contacts } from '../Models/contacts.models';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { email } from '@angular/forms/signals';

@Component({
  imports: [RouterOutlet, AsyncPipe, FormsModule, ReactiveFormsModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})

export class App {
  http = inject(HttpClient)

  ContactsForm = new FormGroup({
    name: new FormControl<string>(''),
    email: new FormControl<string>(''),
    phone: new FormControl<string>(''),
    favorite: new FormControl<boolean>(false)
  })

  contacts$ = this.getContacts();

  onFormSubmit(){
    const addContactRequest={
      name: this.ContactsForm.value.name,
      email: this.ContactsForm.value.email,
      phone: this.ContactsForm.value.phone,
      favorite: this.ContactsForm.value.favorite
    }

    this.http.post('https://localhost:7004/api/contacts', addContactRequest)
    .subscribe({
      next: (value) =>{
        console.log(value);
        this.contacts$ = this.getContacts();
        this.ContactsForm.reset();
      }
    });
  }

  onDelete(id: string)
    {
      this.http.delete(`https://localhost:7004/api/contacts/${id}`)
      .subscribe({
        next: (value) =>{
          alert('Contact deleted')
          this.contacts$ = this.getContacts()
        }
      })
    }

  private getContacts(): Observable<contacts[]>{
    return this.http.get<contacts[]>('https://localhost:7004/api/contacts');
  }
}
