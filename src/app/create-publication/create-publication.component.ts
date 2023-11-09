import { Component, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from '../app.component';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { throwError } from 'rxjs';

@Component({
  selector: 'app-create-publication',
  templateUrl: './create-publication.component.html',
  styleUrls: ['./create-publication.component.css']
})
export class CreatePublicationComponent {
  constructor(private _snackBar: MatSnackBar, private url: AppComponent, private router: Router, private http: HttpClient,private urlImage:AppComponent) { }

  ngOnInit() {
    this.validateSession();
  }

  //vars
  dataUser: any = {}
  path = this.url.url
  comments: any = []
  publication: any = {}
  publications: any = []
  users: any = []
  isFavorite = false;
  messageErroServer: string = "No existe conexion con el servidor"
  messageErrorParametros: string = "Parametros invalidos"
  editingCommentIndex: number = -1;
  file: any
  imageSrc: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput: any;
  urlImages: any = this.urlImage.urlImages
  serve: any = 10.10
  hide = true;
  dataCreate: any = {}
  idPhot:any=""
  formData = new FormData();

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
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
    this._snackBar.open(message, '', { duration: 1000 });
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
          this.openSnackBar(this.messageErrorParametros, "Aceptar")
        } else {
          // error de conexion o un 500
          this.openSnackBar(this.messageErroServer, "Aceptar")
        }
        return throwError("error");
      })
    )
  }
  dataUserResponse(response: any) {
    if (response == null) {
      // this.revokeService()
    } else {
      this.dataUser = response
    }

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



  //crea la publicacion


   publicationsService(foto:any) {
     let formularioValido: any = document.getElementById("add");
     if(formularioValido.reportValidity()){
       this.publicationsRequest(foto).subscribe((response: any) => this.publicationsResponse(response))
     }
   }
   publicationsRequest(foto:any) {
    this.dataCreate.userIdUser=this.dataUser.idUser
     this.dataCreate.photoIdPhoto=foto
   
     return this.http.post<any>(this.path + "/createPublication",this.dataCreate).pipe(
       catchError((error: any) => {
           if (error.status === 400) {
             // error para parametros invalidos
             this.openSnackBar(this.messageErrorParametros, "Aceptar")
           } else {
             // error de conexion o un 500
             this.openSnackBar(this.messageErroServer, "Aceptar");
           }
           return throwError("error");
         }
       ))
   }
   publicationsResponse(response: any) {
     this.openSnackBarTime(response.message)
     this.router.navigateByUrl("/home")

   }



  //imagenes
  validarImages(){
    if(this.imageSrc == null){
   this.openSnackBarTime("Debes ingresar una imagen")
    }else {
      this.imagenService()
    }
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
  imagenService() {
    this.imagenRequest(this.file, this.urlImages,  this.serve).subscribe((response: any) => this.imagenResponse(response))
  }
  imagenRequest(file: File, path: any, server: any) {
   // const formData = { file, path, user, server };
   const formData = new FormData()
   formData.append('file', file)
   formData.append('server', server)
   formData.append('path', path)
   
    return this.http.post<any>(this.path + "/fileUp", formData, { observe: 'response' }).pipe(
      catchError((error: any) => {

        if(error.status == 0){
          this.openSnackBar("Tamaño supera limite esperado", "Aceptar")
        }
        else if (error.status === 400) {
          // error para parametros invalidos
          this.openSnackBar(this.messageErrorParametros, "Aceptar")
        } else {
          // error de conexion o un 500
          this.openSnackBar(this.messageErroServer, "Aceptar");
        }
        return throwError("fallo el servicio");
      }
      ))
  }
  imagenResponse(response: any) {
    this.idPhot = response.body.idImagen
    this.publicationsService(this.idPhot)

  }

home(){
  this.router.navigateByUrl("/home")
}

}
