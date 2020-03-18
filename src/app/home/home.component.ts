import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User, AssignTask } from '../_models';
import { UserService, AuthenticationService, TasksService } from '../_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    users: User[] = [];
    tasks: AssignTask[] = [];

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private tasksService: TasksService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        //this.loadAllUsers();
        this.loadAllAssignTasks();
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    deleteUser(id: number) {
        this.userService.delete(id).pipe(first()).subscribe(() => {
            //this.loadAllUsers()
            this.loadAllAssignTasks();
        });
    }

    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }
    private loadAllAssignTasks() {
        //console.log("task.components.ts ");
        //console.log(this.currentUser);
        this.tasksService.getAllByUserId(this.currentUser).pipe(first()).subscribe(tasks => {
            this.tasks = tasks;
            //console.log("Tasks");
            //console.log(this.tasks);
        });
    }
}