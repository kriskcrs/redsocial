import {Component, ViewChild} from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker'
import {NgIf} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AppComponent} from "../app.component";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent {
  constructor(private _snackBar: MatSnackBar, private url: AppComponent, private router: Router, private http: HttpClient) { }

  path = this.url.url
  dataCreate: any={}
  hide = true;
  file: any
  imageSrc: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput: any;

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  matcher = new MyErrorStateMatcher();

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result;
      };
      reader.readAsDataURL(selectedFile);
      this.file = selectedFile
    }
  }

  selectImage() {
    // Hacer clic en el input de tipo archivo para abrir el cuadro de diálogo de selección de archivo
    this.fileInput.nativeElement.click();
  }

  userCreation() {
    let formularioValido: any = document.getElementById("add");
    if (formularioValido.reportValidity()) {
      this.userCreationRequest().subscribe(
        (response: any) => this.userCreationResponse(response)
      )

    }  }
  userCreationRequest() {
    return this.http.post<any>(this.path + "/createUser", this.dataCreate, { observe: 'response' }).pipe(
      catchError((error: any) => {
        if (error.status === 400) {
          // error para parámetros inválidos
          this.openSnackBar(error.error.message, "Aceptar");
        } else {
          // error de conexión o un 500
          this.openSnackBar("No existe conexión con el servidor", "Aceptar");
        }
        return throwError(error);
      })
    )
  }

  userCreationResponse(response: any) {
if (response.status === 200) {
  this.openSnackBar("Usuario creado correctamente", "Aceptar");
  this.router.navigateByUrl("/")
    }
    else {
      console.log(`Recibí un código de estado inesperado: ${response.status}`);
    }

  }

  login(){
    this.router.navigateByUrl("/")
  }


}
