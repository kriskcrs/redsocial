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
  messageErroServer: string = "No existe conexion con el servidor"
  messageErrorParametros: string = "Parametros invalidos"
  path = this.url.url
  dataCreate: any={}
  hide = true;
  file: any
  imageSrc: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput: any;
  urlImages: any = "C:\\Users\\josue\\WebstormProjects\\redsocial\\src\\assets"
  serve: any = 10.10
  email = new FormControl('', [Validators.required, Validators.email]);
  idPhot:any=""
  passwordConfirm = new FormControl('', [Validators.required]);



  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  matcher = new MyErrorStateMatcher();
  file1: any ='perfil.png'

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
  validationImagen(){
    if(this.imageSrc==null){
      this.idPhot=this.file1
      this.userCreation()
    }else{
      this.imagenService()
    }
  }
  imagenService() {
    if(this.dataCreate.password==this.passwordConfirm.value) {
      if (this.email.valid) {
        this.imagenRequest(this.file, this.urlImages, this.dataCreate.idUser, this.serve).subscribe((response: any) => this.imagenResponse(response))
      }
    }else{
      this.openSnackBar("Contraseñas no coiciden", "Aceptar");

    }
  }
  imagenRequest(file: File, path: any, user: any, server: any) {


    // const formData = { file, path, user, server };
    const formData = new FormData()
    formData.append('file', file)
    formData.append('server', server)
    formData.append('path', path)
    formData.append('user', user)

    return this.http.post<any>(this.path + "/fileUp", formData, { observe: 'response' }).pipe(
      catchError((error: any) => {
          if (error.status === 400) {
            // error para parametros invalidos
            this.openSnackBar(this.messageErrorParametros, "Aceptar")
          } else {
            // error de conexion o un 500
            this.openSnackBar(this.messageErroServer, "Aceptar");
          }
          return throwError(error);
        }
      ))
  }
  imagenResponse(response: any) {
    this.idPhot = response.body.idImagen
    this.userCreation()

  }
  userCreation() {
        let formularioValido: any = document.getElementById("add");
        if (formularioValido.reportValidity()) {
          this.userCreationRequest().subscribe(
            (response: any) => this.userCreationResponse(response)
          )

        }
  }
  userCreationRequest() {
    this.dataCreate.idUser=this.email.value
    this.dataCreate.fotoIdFoto=this.idPhot
    console.log(this.dataCreate)
    return this.http.post<any>(this.path + "/createUser", this.dataCreate, { observe: 'response' }).pipe(
      catchError((error: any) => {
        if (error.status === 400) {
          // error para parámetros inválidos
          this.openSnackBar(error.error.message, "Aceptar");
        } else {
          // error de conexión o un 500
          this.openSnackBar("Datos invalidos", "Aceptar");
        }
        return throwError(error);
      })
    )
  }
  openSnackBarTime(message: string) {
    this._snackBar.open(message, '', { duration: 1000 });
  }
  userCreationResponse(response: any) {
if (response.status === 200) {
  this.openSnackBarTime("No puedes modificar el comentario de otro usuario")
  this.router.navigateByUrl("/")
    }
    else {
      console.log(`Recibí un código de estado inesperado: ${response.status}`);
    }

  }

  login(){
    this.router.navigateByUrl("/")
  }
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Debes ingresar un valor';
    }
    return this.email.hasError('email') ? 'Tu correo electronico no es valido' : '';
  }

}
