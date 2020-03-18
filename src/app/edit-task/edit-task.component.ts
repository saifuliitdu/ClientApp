import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { AssignTask, User } from '../_models';
import { TasksService, AuthenticationService, AlertService, UserService } from '../_services';

@Component({
  templateUrl: './edit-task.component.html',
})
export class EditTaskComponent implements OnInit {

    loading = false;
    submitted = false;
    users: User[] = [];

    editedItem: AssignTask;
    editTaskForm: FormGroup;

    currentUser: User;
    currentUserSubscription: Subscription;
    
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private tasksService: TasksService,
        private alertService: AlertService,
        private userService: UserService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
            //console.log('from edit taks component ');
            //console.log(this.currentUser);
        });
    }
    // Choose city using select dropdown
    changeCity(e) {
        console.log(e.value)
        this.userId.setValue(e.target.value, {
            onlySelf: true
        })
    }
    // Getter method to access formcontrols
    get userId() {
        return this.editTaskForm.get('userId');
    }

    ngOnInit() {
        let taskId = localStorage.getItem("editTaskId");
        console.log("edit task id:  " + taskId);
        if (!taskId) {
            alert("Invalid action.")
            this.router.navigate(['tasks']);
            return;
        }
        this.editTaskForm = this.formBuilder.group({
            taskId: [],
            name: ['', Validators.required],
            description: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            userId: ['', Validators.required],
        });
        this.tasksService.getById(+taskId)
            .subscribe(data => {
                //data.startDate = this.data.startDate.transform(data.startDate, 'MM/dd/yyyy');
                this.editTaskForm.setValue(data);
            });
        this.loadAllUsers();
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    //btnClick = function () {
    //    this.router.navigateByUrl('/addtask');
    //};

    private loadAllUsers() {

        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
            console.log(this.users);
        });
    }
    

    // convenience getter for easy access to form fields
    get f() { return this.editTaskForm.controls; }

    onSubmit() {

        this.submitted = true;
        //alert(JSON.stringify(this.addTaskForm.value))
        //return;
        console.log("edit-task called");
        console.log(this.editTaskForm.value);
        // stop here if form is invalid
        if (this.editTaskForm.invalid) {
            return;
        }

        this.loading = true;
        this.tasksService.update(this.editTaskForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    //this.alertService.success('Task added', true);
                    this.router.navigate(['/tasks']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
            });
    }
}
