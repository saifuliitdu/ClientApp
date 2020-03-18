import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    Url: string;

    constructor(private http: HttpClient) {
        this.Url = 'http://localhost:63327/api/Users/';
    }

    getAll() {
        return this.http.get<User[]>(this.Url);
    }

    getById(id: number) {
        return this.http.get(this.Url + id);
    }

    register(user: User) {
        return this.http.post(this.Url, user);
    }

    update(user: User) {
        return this.http.put(this.Url + user.userId, user);
    }

    delete(id: number) {
        return this.http.delete(this.Url + id);
    }
}