import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AssignTask, User } from '../_models';

@Injectable({ providedIn: 'root' })
export class TasksService {
    Url: string;

    constructor(private http: HttpClient) {
        this.Url = 'http://localhost:63327/api/AssignTasks';
    }

    getAll() {
        return this.http.get<AssignTask[]>(this.Url);
    }

    getAllByUserId(user: User) {
        return this.http.get<AssignTask[]>(this.Url + '/GetAssignTasksByUserId/' + user.userId);
    }

    getById(id: number) {
        return this.http.get(this.Url + '/GetAssignTask/' + id);
    }

    update(user: AssignTask) {
        return this.http.put(this.Url + '/PutAssignTask/' + user.taskId, user);
    }

    delete(id: number) {
        return this.http.delete(this.Url + '/DeleteAssignTask/' + id);
    }

    add(task: AssignTask) {
        console.log(task);
        alert(task);
        return this.http.post(this.Url + '/PostAssignTask', task);
    }
}