import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, map, Observable, Subject, tap } from "rxjs";

import { environment } from "../../environments/environment";
import { AuthData } from "./auth.model";
import { User } from "./user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null!);
  token = null;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  Register(data: any): Observable<any> {
    return this.http.post<any>(environment.authApi + '/register', data)
  }

  VerifyOTP(data: any) {
    return this.http.post<any>(environment.authApi + '/verifyotp', data).pipe(tap(
      res => {
        this.handleAuthentication(
          res.USER_DATA.name,
          res.USER_DATA.email,
          res.USER_DATA.verified,
          res.USER_DATA.createdAt,
          res.token,
          res.expiresIn
        );
      }
    ));
  }

  login(data: any) {
    return this.http.post<any>(environment.authApi + '/login', data).pipe(tap(res => {

      this.handleAuthentication(
        res.USER_DATA.name,
        res.USER_DATA.email,
        res.USER_DATA.verified,
        res.USER_DATA.createdAt,
        res.token,
        res.expiresIn
      );
    }));
  }

  private handleAuthentication(name: string, email: string, verified: boolean, createdAt: string, token: string, expiresIn: string) {
    const expirationDate = new Date(new Date().getTime() + parseInt(expiresIn) * 1000);
    const user = new User(
      name,
      email,
      verified,
      createdAt,
      token,
      expirationDate
    );

    this.user.next(user);
    localStorage.setItem("logged_user", JSON.stringify(user));
    this.router.navigate(['/']);
    this.AutoLogout(parseInt(expiresIn) * 1000)

  }

  Logout() {
    this.user.next(null!);
    localStorage.removeItem("logged_user");
    this.router.navigate(['/']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  AutoLogin() {
    const userData: {
      name: String,
      email: String,
      verified: Boolean,
      createdAt: String,
      _token: String,
      _tokenExpiresInDate: String
    } = JSON.parse(localStorage.getItem("logged_user") as any);

    if (!userData) {
      return
    }
    const loggedUser = new User(
      userData.name,
      userData.email,
      userData.verified,
      userData.createdAt,
      userData._token,
      new Date(userData._tokenExpiresInDate as string),
    )
    if (loggedUser._token) {
      this.user.next(loggedUser);
      const expirationDuration =
        new Date(userData._tokenExpiresInDate as string).getTime() -
        new Date().getTime();
      this.AutoLogout(expirationDuration);
    }
  }

  AutoLogout(expirationDate: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.Logout();
    }, expirationDate);
  }
}
