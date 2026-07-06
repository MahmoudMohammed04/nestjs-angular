import { inject, Inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { Observable, from, switchMap } from 'rxjs';
import { API_CONFIG, APIConfig } from './apiConfig';
import { FirebaseService } from '../FireBaseProvider/Firebase.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private  socket!: Socket;

  private readonly http = inject(HttpClient);
  private readonly firebaseService = inject(FirebaseService);

  constructor(@Inject(API_CONFIG) private config: APIConfig) {}

   private url(path: string) {
    return `${this.config.domain}/api/${path}`;
  }

  // ---------------- AUTH ----------------

  register(dto: {
    username: string;
    phone?: string;
  }): Observable<any> {
    return this.http.post(this.url('auth/register'), dto);
  }

  async connect() {
  const token = await this.firebaseService.getToken();

  if (this.socket) {
    this.socket.disconnect();
  }

  this.socket = io(this.config.domain, {
    auth: { token },
    transports: ['websocket'], 
  });

  console.log('socket created:', this.socket.id);

  this.socket.on('connect', () => {
    console.log('socket connected:', this.socket.id);
  });
}

  disconnect() {
    this.socket.disconnect();
  }

  private requestHeaders() {
    return from(this.firebaseService.getToken()).pipe(
      switchMap((token) => [
        new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      ]),
    );
  }

  get<T>(
    url: string,
    query?: Record<string, any>,
  ): Observable<T> {
    return this.requestHeaders().pipe(
      switchMap((headers) =>
        this.http.get<T>(`${this.config.domain}/api/${url}`, {
          headers,
          params: new HttpParams({ fromObject: query ?? {} }),
        }),
      ),
    );
  }

  post<T>(url: string, body?: unknown): Observable<T> {
    return this.requestHeaders().pipe(
      switchMap((headers) =>
        this.http.post<T>(
          `${this.config.domain}/api/${url}`,
          body,
          { headers },
        ),
      ),
    );
  }

  put<T>(url: string, body?: unknown): Observable<T> {
    return this.requestHeaders().pipe(
      switchMap((headers) =>
        this.http.put<T>(
          `${this.config.domain}/api/${url}`,
          body,
          { headers },
        ),
      ),
    );
  }

  delete<T>(url: string): Observable<T> {
    return this.requestHeaders().pipe(
      switchMap((headers) =>
        this.http.delete<T>(
          `${this.config.domain}/api/${url}`,
          { headers },
        ),
      ),
    );
  }

  // Socket

  emit(event: string, data: unknown) {
    this.socket.emit(event, data);
  }

  emitWithAck<T>(event: string, data: unknown): Promise<T> {
    return this.socket.emitWithAck(event, data);
  }

  on<T>(event: string, callback: (data: T) => void) {
    this.socket.on(event, callback);
  }

  off(event: string) {
    this.socket.off(event);
  }
}