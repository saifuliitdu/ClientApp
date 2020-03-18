import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl  } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { AssignTask, User } from '../_models';
import { TasksService, AuthenticationService, AlertService, UserService } from '../_services';

@Component({
  templateUrl: './add-task.component.html',
})
export class AddTaskComponent implements OnInit {
    addTaskForm: FormGroup;
    loading = false;
    submitted = false;
    users: User[] =[];
   
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
            //console.log('from add taks component ');
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
        return this.addTaskForm.get('userId');
    }

    ngOnInit() {
        this.addTaskForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            userId: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required]
        });
        this.loadAllUsers();
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    //btnClick = function () {
    //    this.router.navigateByUrl('/add-task');
    //};
    
    private loadAllUsers() {

        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
            //console.log(this.users);
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.addTaskForm.controls; }

    onSubmit() {
       
        this.submitted = true;
        //console.log("add-task called");
        //console.log(this.addTaskForm.value);
        // stop here if form is invalid
        if (this.addTaskForm.invalid) {
            return;
        }

        this.loading = true;
        this.tasksService.add(this.addTaskForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['/tasks']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
