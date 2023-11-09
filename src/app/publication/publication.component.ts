import {Component, ViewChild} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from '../app.component';
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { throwError } from 'rxjs';


@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css']
})

export class PublicationComponent {

  modulos: any = []
  constructor(private _snackBar: MatSnackBar, private url: AppComponent, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.validateSession()
  }

  //vars
  modify: boolean = false
  add: boolean = true
  imgModify1:boolean = true
  dataUser: any = {}
  path = this.url.url
  comments: any = []
  publicationData: any = {}
  photo:any = {}
  publication:any = {}
  dataModify:any={}
  botones:boolean=true;
  moji:any=0
  publications: any = []
  users: any = []
  isFavorite = false;
  isFavoriteEdit = false;
  comentario: string = ""
  comentarioModificado: string = ""
  idP: any = localStorage.getItem("idPublication")
  messageErroServer: string = "No existe conexion con el servidor"
  messageErrorParametros: string = "Parametros invalidos"

  imagenDataUrl: string = ""

  userLogin: boolean = false;
  file: any
  imageSrc: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput: any;
  //urlImages: any = "C:\\Users\\josue\\WebstormProjects\\redsocial\\src\\assets"
  urlImages: any = "/Users/cristiancaceres/WebstormProjects/redsocial/src/assets"
 // urlImages: any = "C:\\Users\\ricar\\OneDrive\\Escritorio\\TAREAS\\Desarrollo\\redsocial\\src\\assets"
  serve: any = 10.10
  hide = true;
  dataCreate: any = {}
  idPhot:any=""

  validarBotones(){


    if(this.publicationData.publication.userIdUser == this.dataUser.idUser){
      this.botones=true
    }else {
      this.botones=false
    }
  }

  editingCommentIndex: number = -1;

  Modify(response: any) {
    this.dataModify.decription = response.publication.decription
    this.add = false
    this.modify = true
  }

  Add() {
    this.modify = false
    this.add = true
  }

  back() {
    this.modify = false
    this.add = true
  }


  //valida si la sesion esta vigente
  validateSession() {
    this.dataUser = localStorage.getItem("data")
    if (this.dataUser != null) {
      this.dataUser = JSON.parse(this.dataUser)
      this.dataUserService()
      this.userLogin = true;
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
        return throwError(error);
      })
    )
  }
  dataUserResponse(response: any) {
    if (response == null) {
      // this.revokeService()
    } else {
      this.dataUser = response
      this.userService()
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


  //retorna todos los comentarios
  commentService() {
    this.commentRequest().subscribe((response: any) => this.commentResult(response))
  }
  commentRequest() {
    return this.http.get<any>(this.path + "/consult/comment/" + this.idP).pipe(
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
  commentResult(response: any) {
    this.comments = response


  }


  //retorna todas las publicaciones

  publicationsService() {

    this.publicationsRequest().subscribe((response: any) => this.publicationsResponse(response))
  }
  publicationsRequest() {
    return this.http.get<any>(this.path + "/consult/publication/" + this.idP).pipe(
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
  publicationsResponse(response: any) {
    this.publicationData = response[0]

    this.photo = this.publicationData.photo
    this.publication = this.publicationData.publication
    this.validarBotones()
    this.toggleFavorite()
    this.commentService()
  }


  //editar la publicaciones

  publicationEditService() {
    let formularioValido: any = document.getElementById("modify");
    if(formularioValido.reportValidity()){
      this.publicationEditRequest().subscribe((response: any) => this.publicationEditResponse(response))

    }
  }
  publicationEditRequest() {
    this.dataModify.photoIdPhoto=this.idPhot
    return this.http.put<any>(this.path + "/modifyPublication/"+this.idP, this.dataModify,{ observe: 'response' }).pipe(
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
  publicationEditResponse(response: any) {
    if(response.status==200){
      this.openSnackBarTime("Publicacion modificada")
      this.home()
    }else{
      this.openSnackBarTime("No se pudo modificar")
    }
  }

  //editar el emoji

  publicationEmoji() {
      this.publicationEmojiRequest().subscribe((response: any) => this.publicationEmojiResponse(response))
  }
  publicationEmojiRequest() {
    return this.http.put<any>(this.path + "/modifyPublication/emoji/"+this.idP+"/"+this.moji,{ observe: 'response' }).pipe(
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
  publicationEmojiResponse(response: any) {
  }


  //usuarios
  userService() {
    this.userRequest().subscribe((response: any) => this.userResponset(response))
  }
  userRequest() {
    return this.http.get<any>(this.path + "/users").pipe(
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
  userResponset(response: any) {
    this.users = response
    this.publicationsService()
  }



  //obtiene nombre de usuario
  getNameUser(id: any): string {


    for (const publication of this.publications) {
      if (publication.idPublication === id) {
        for (const user of this.users) {
          if (user.idUser === publication.userIdUser) {
            return user.name + " " + user.lastName;
          }
        }
      }
    }
    return '';
  }

  //icono de corazon
  toggleFavorite() {
    if(this.publicationData.publication.emoji==0){
      this.isFavorite = false
      this.isFavoriteEdit=this.isFavorite
    }else if(this.publicationData.publication.emoji==1){
      this.isFavorite = true
      this.isFavoriteEdit=this.isFavorite

    }

  }

  toggleFavoriteEdit() {
  this.isFavoriteEdit=!this.isFavoriteEdit
    if(this.isFavoriteEdit){
      this.moji=1
      this.publicationEmoji()
    }else{
      this.moji=0
      this.publicationEmoji()
    }

  }

  //graba comentario
  commentcreateService(c: any) {
    if (c == null || c == "") {
      this.openSnackBarTime("Debes colocar un comentario")
    } else {
      this.commentcreateRequest(c).subscribe((response: any) => this.commentcreateResponse(response))
    }
  }
  commentcreateRequest(comment: any) {

    let data = {
      text: comment,
      idPublication: this.idP,
      userIdUser: this.dataUser.idUser
    }
    return this.http.post<any>(this.path + "/create/comment", data).pipe(
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
  commentcreateResponse(response: any) {
    this.openSnackBarTime(response.message)
    this.publicationsService()
    this.comentario = ""
  }



  //elimina comentarios
  deleteComment(c: any) {
    if (c.userIdUser == this.dataUser.idUser) {
      this.deleteCommentRequest(c).subscribe((response: any) => this.deleteCommentResponse(response))
    } else {
      this.openSnackBarTime("No puedes eliminar el comentario de otro usuario")
    }
  }
  deleteCommentRequest(comment: any) {
    return this.http.delete<any>(this.path + "/delete/comment/" + comment.idComment).pipe(
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
  deleteCommentResponse(response: any) {
    this.openSnackBarTime(response.message)
    this.publicationsService()
    this.comentario = ""
  }



  //edita comentario
  editComment(index: number) {
    this.editingCommentIndex = index;
    this.comentarioModificado = this.comments[index].text;
  }
  saveComment(commentM: any, comment: any) {
    if (comment.userIdUser == this.dataUser.idUser) {

      let comentarioModificado = {
        idComment: comment.idComment,
        idPublication: comment.idPublication,
        text: commentM,
        userIdUser: this.dataUser.idUser
      }
      this.editCommentRequest(comentarioModificado).subscribe((response: any) => {
        this.editCommentResponse(response);
      })
    } else {
      this.openSnackBarTime("No puedes modificar el comentario de otro usuario")
    }



  }
  editCommentRequest(comment: any) {
    return this.http.post<any>(this.path + "/update/comment", comment).pipe(
      catchError((error: any) => {
        if (error.status === 400) {
          this.openSnackBar(this.messageErrorParametros, "Aceptar");
        } else {
          this.openSnackBar(this.messageErroServer, "Aceptar");
        }
        return throwError(error);
      })
    );
  }
  editCommentResponse(response: any) {
    this.openSnackBarTime(response.message);
    this.publicationsService();
    this.comentario = "";
    this.editingCommentIndex = -1;
  }

  //imagenes
  onFileSelected(event: any) {
    this.imgModify1=false;
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

  validarImages(){
    if(this.imgModify1){
      this.dataModify.photoIdPhoto=this.photo.idPhoto
      this.publicationEditService()
    }else {
      this.imagenService()
    }
  }

  imagenService() {
    this.imagenRequest(this.file, this.urlImages, this.dataUser.idUser, this.serve).subscribe((response: any) => this.imagenResponse(response))
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
    this.publicationEditService()

  }

  home(){
    this.router.navigateByUrl("/home")
  }

  //elimina comentarios
  deletePublication(c: any) {
    if (c.publication.userIdUser == this.dataUser.idUser) {
      this.deletePublicationtRequest(c).subscribe((response: any) => this.deletePublicationResponse(response))
    } else {
      this.openSnackBarTime("No puedes eliminar la publicacion de otro usuario")
    }
  }
  deletePublicationtRequest(comment: any) {
    return this.http.delete<any>(this.path + "/delete/publication/" + this.idP).pipe(
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
  deletePublicationResponse(response: any) {
    this.openSnackBarTime(response.message)
    this.publications = ""
    this.home()
  }



}
