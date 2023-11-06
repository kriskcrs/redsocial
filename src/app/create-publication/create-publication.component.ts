import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppComponent } from '../app.component';
import { HttpClient } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { throwError } from 'rxjs';
@Component({
  selector: 'app-create-publication',
  templateUrl: './create-publication.component.html',
  styleUrls: ['./create-publication.component.css']
})
export class CreatePublicationComponent {
  constructor(private _snackBar: MatSnackBar, private url: AppComponent, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    // this.validateSession(); habilitar a futuro
    //this.dataUserService()
  }

  //vars
  dataUser: any = {}
  path = this.url.url
  comments: any = []
  publication:any = {}
  publications: any = []
  users: any = []
  isFavorite = false;
  comentario: string = ""
  comentarioModificado:string =""
  idP: number = 1
  messageErroServer:string = "No existe conexion con el servidor"
  messageErrorParametros:string = "Parametros invalidos"
  editingCommentIndex: number = -1;

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
    console.log("paso acua publi")
    this.publicationsRequest().subscribe((response: any) => this.publicationsResponse(response))
  }
  publicationsRequest() {
    console.log("entraicion en el request")
    return this.http.get<any>(this.path + "/consult/publications").pipe(
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
    console.log(response)
    this.publications = response
    this.idP = this.publications[0].idPublication
    this.publication = this.publications[0]

    this.commentService()
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
    this.isFavorite = !this.isFavorite;
  }

  //graba comentario
  commentcreateService(c: any) {
    if (c == null || c == "") {
      this.openSnackBarTime("Debes colocar un comentario")
    } else {
      this.commentcreateRequest(c).subscribe((response: any) => this.commentcreateResponset(response))
    }
  }
  commentcreateRequest(comment: any) {
    let data = {
      text: comment,
      idPublication: this.idP
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
  commentcreateResponset(response: any) {
    this.openSnackBarTime(response.message)
    this.publicationsService()
    this.comentario = ""
  }






  //elimina comentarios
  deleteComment(c:any){
    console.log(c);
    this.deleteCommentRequest(c).subscribe((response: any) => this.deleteCommentResponse(response))
  }

  deleteCommentRequest(comment: any) {
    return this.http.delete<any>(this.path + "/delete/comment/"+comment.idComment).pipe(
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




  saveComment(commentM:any,comment:any) {
    let comentarioModificado ={
      idComment:comment.idComment,
      idPublication:comment.idPublication,
      text:commentM
    }
    this.editCommentRequest(comentarioModificado).subscribe((response: any) => {
      this.editCommentResponse(response);

    });
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



}
