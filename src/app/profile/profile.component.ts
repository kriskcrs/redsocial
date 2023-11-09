import { Component , ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from '../app.component';
import {ErrorStateMatcher} from '@angular/material/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { throwError } from 'rxjs';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

interface Photo {
  urlPhoto: string;
  alt: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  modulos: any = []
  constructor(private _snackBar: MatSnackBar, private url: AppComponent, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.validateSession();
  }

  //boolean
  modify: boolean = false
  view: boolean = false
  btnAdd: boolean = false
  btnUpdate: boolean = false
  add: boolean = false
  tab: boolean = true
  header: boolean = true

  //vars
  path = this.url.url
  password = new FormControl('', [Validators.required]);
  passwordConfirm = new FormControl('', [Validators.required]);
  hide = true;
  serve: any = 10.10
  messageErrorParametros: string = "Parametros invalidos"
  messageErroServer: string = "No existe conexion con el servidor"
  
  //objetos
  perfilData: any = []
  perfilDataModify: any = []
  dataUser: any = {}
  photos: any = {}
  options: any = {}
  file: any
  idPhoto:any=""
  imageSrc: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput: any;
  publications: any = []
  publicationId: any = {}
  //url
  pageUrl = "profile"
  urlImages: any = "C:\\Users\\ricar\\OneDrive\\Escritorio\\TAREAS\\Desarrollo\\redsocial\\src\\assets"

  //bandera de botones
  optionsValidate() {
    this.options = localStorage.getItem("options");
    this.options = JSON.parse(this.options)

    let permisos: any = {}
    this.options.forEach((item: any) => {
      if (item.page === this.pageUrl) {
        permisos = item.permisos
      }
    })
    permisos.forEach((item: any) => {
      this.btnAdd = item.up == 1 ? true : false
      this.btnUpdate = item.update == 1 ? true : false
    })
  }

  //banderas
  Modify(id: any) {
    console.log("modifica")
    this.perfilDataModify = id
    this.add = false
    this.tab = false
    this.modify = true
    this.header = false

  }

  back() {
    console.log("back")
    this.modify = false
    this.add = false
    this.header = true
    this.perfilDataModify = {}
    this.ngOnInit()
  }


  backWelcome() {
    this.router.navigateByUrl("/home")
  }


  // Evitar el envío del formulario al presionar "Enter" en el campo de contraseña
  onPasswordKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      //this.login();
    }
  }


  //valida si la sesion esta vigente
  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.dataUserService();
    } else {
      this.router.navigateByUrl("/")

    }
  }
  //message
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  openSnackBarTime(message: string) {
    this._snackBar.open(message, '', { duration: 3000 });
  }

  //obtiene data del usuario
  dataUserService() {
    this.dataUserRequest().subscribe((response: any) => this.dataUserResponse(response))
  }
  dataUserRequest() {
    let session = this.dataUser.session
    return this.http.get<any>(this.path + "/dataUser/" + session).pipe(
      catchError((error: any) => {
        if (error.status === 400) {
          // error para parametros invalidos 
          this.openSnackBar("valores invalidos", "Aceptar")
        } else {
          // error de conexion o un 500
          this.openSnackBar("No existe conexión con el servidor", "Aceptar");
        }
        return throwError(error);
      })
    )
  }
  dataUserResponse(response: any) {
    if (response == null) {
     // this.revokeService()
    } else {
      this.dataUser = response
      
    }
    this.publication();
  }

  //revoke
  revokeService() {
    this.RequestRevoke().subscribe(
      (response: any) => this.ResponseRevoke(response)
    )
  }
  RequestRevoke() {
    return this.http.get<any>(this.path + "/revoke/" + this.dataUser.session).pipe(
      catchError(e => e)
    )
  }
  ResponseRevoke(response: any) {
    if (response == null) {
      localStorage.clear()
      this.router.navigateByUrl("/")
    } else {
      localStorage.clear()
      this.router.navigateByUrl("/")
    }
  }




  //obtener datos del perfil
  perfil() {
    this.requestPerfil().subscribe(
      (response: any) => this.responsePerfil(response)
    )

  }
  requestPerfil() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.get<any>(this.url + "/consult/profile/" + this.perfilData.idProfile, httpOptions).pipe(
      catchError((error: any) => {
        if (error.status === 400) {
          // error para parametros invalidos 
          this.openSnackBar("valores invalidos", "Aceptar")
        } else {
          // error de conexion o un 500
          this.openSnackBar("No existe conexión con el servidor", "Aceptar");
        }
        return throwError(error);
      }
      ))
  }
  responsePerfil(response: any) {
    this.perfilData = response
    
  }

   //modificacion de perfil

   modForm() {
    let formularioValido: any = document.getElementById("modForm");
    if (formularioValido.reportValidity()) {
      this.perfilDataModify.userModification = this.dataUser.user
      console.log(this.perfilDataModify);
      if( this.perfilDataModify.password == this.perfilDataModify.passwordConfirm ){
        this.imagenService()
        this.perfilDataModify.fotoIdFoto = this.idPhoto
        this.perfilDataModify.route = this.urlImages
        console.log(this.perfilDataModify)
        this.requestProfileUpdate().subscribe(
       (response: any) => this.responseProfileUpdate(response)
        )
      }else{
        this.openSnackBarTime ("Contraseñas nos coinciden")
      }
      
      
    }
  }
  requestProfileUpdate() {
    return this.http.put<any>(this.path + "/updateProfile/" + this.perfilDataModify.idUser, this.perfilDataModify).pipe(
      catchError((error: any) => {
        if (error.status === 400) {
          // error para parametros invalidos 
          this.openSnackBar("valores invalidos", "Aceptar")
        } else {
          // error de conexion o un 500
          this.openSnackBar("No existe conexión con el servidor", "Aceptar");
        }
        return throwError(error);
      }
      ))
  }
  responseProfileUpdate(response: any) {
    this.openSnackBarTime(response.message)
    this.dataUserService()
    this.modify = false;
  }

  matcher = new MyErrorStateMatcher();
  file1: any ='assets/perfil.png'

  SnackBar(message: string, action: string) {
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
    if(this.file==""){
      this.file=this.file1
    }else{
      this.imagenService()
    }
  }
  imagenService() {
    this.imagenRequest(this.file, this.urlImages, this.perfilDataModify.idUser, this.serve).subscribe((response: any) => this.imagenResponse(response))
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
            this.SnackBar(this.messageErrorParametros, "Aceptar")
          } else {
            // error de conexion o un 500
            this.SnackBar(this.messageErroServer, "Aceptar");
          }
          return throwError(error);
        }
      ))
  }
  imagenResponse(response: any) {
    this.idPhoto = response.body.idImagen

  }





  loadPhotos() {
    this.fetchPhotos()
      .subscribe(
        (photos: Photo[]) => {
          this.photos = photos;
        },
        (error) => {
          console.error('Error al cargar las fotos:', error);
        }
      );
  }

  fetchPhotos() {
    return this.http.get<Photo[]>(this.path);
  }

  //retorna todos los comentarios
  publication() {
    this.publicationRequest().subscribe((response: any) => this.publicationResult(response))
  }
  publicationRequest() {
    console.log(this.dataUser)
    return this.http.get<any>(this.path + "/consult/publicationUser/" + this.dataUser.idUser).pipe(
      catchError((error: any) => {
          if (error.status === 400) {
            // error para parametros invalidos
            this.openSnackBar(this.messageErrorParametros, "Aceptar")
          } else {
            // error de conexion o un 500
            this.openSnackBar(this.messageErroServer, "Aceptar")
          }
          return throwError(error);
        }
      ))
  }
  publicationResult(response: any) {
    this.publications = response
    console.log(this.publications)
  }

publicationSet(id:any){
  console.log('ID de la imagen clickeada: ' + id);
  localStorage.setItem("idPublication", JSON.stringify(id));
  this.router.navigateByUrl("/publication");

}

}
