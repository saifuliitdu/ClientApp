import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { AssignTask, User } from '../_models';
import { TasksService, AuthenticationService } from '../_services';

@Component({ templateUrl: 'list-task.component.html' })
export class ListTaskComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    tasks: AssignTask[] = [];

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private tasksService: TasksService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
            console.log('from taks component ');
            console.log(this.currentUser);
        });
    }

    ngOnInit() {
        this.loadAllAssignTasks();
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }
    
    deleteTask(task: AssignTask) {
        //console.log("delete Task");
        //console.log(task);

        if (window.confirm("Are you sure to delete.")) {
            this.tasksService.delete(task.taskId).pipe(first()).subscribe(() => {
                this.loadAllAssignTasks()
            });
        }       
    }
    editTask(task: AssignTask) {
        //console.log("edit Task");
        //console.log(task);
        localStorage.removeItem("editTaskId");
        localStorage.setItem("editTaskId", task.taskId.toString());
        this.router.navigate(['edittask']);
    };

    private loadAllAssignTasks() {
        //console.log("task.components.ts ");
        //console.log(this.currentUser);
        this.tasksService.getAll().pipe(first()).subscribe(tasks => {
            this.tasks = tasks;
            //console.log("Tasks");
            //console.log(this.tasks);
        });
    }
}