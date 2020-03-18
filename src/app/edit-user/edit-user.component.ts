import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { AuthenticationService, AlertService, UserService } from '../_services';

@Component({
  templateUrl: './edit-user.component.html',
})
export class EditUserComponent implements OnInit, OnDestroy {

    loading = false;
    submitted = false;
    users: User[] = [];

    editedItem: User;
    editUserForm: FormGroup;

    currentUser: User;
    currentUserSubscription: Subscription;
    
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private userService: UserService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        let userId = localStorage.getItem("editUserId");
        console.log("edit user id:  " + userId);
        if (!userId) {
            alert("Invalid action.")
            this.router.navigate(['users']);
            return;
        }
        this.editUserForm = this.formBuilder.group({
            userId: [],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(3)]],
            retypePassword: ['', [Validators.required, Validators.minLength(3)]],
            address: ['', Validators.required],
            mobile: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]]
        });
        this.userService.getById(+userId)
            .subscribe(data => {
                //console.log("get user by id");
                //console.log(data);
                this.editUserForm.setValue(data);
            });
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    // convenience getter for easy access to form fields
    get f() { return this.editUserForm.controls; }

    onSubmit() {
        this.submitted = true;
        
        // stop here if form is invalid
        if (this.editUserForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.update(this.editUserForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['/users']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
            });
    }
}
