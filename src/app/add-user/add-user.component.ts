import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl  } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { AuthenticationService, AlertService, UserService } from '../_services';

@Component({
  templateUrl: './add-user.component.html',
})
export class AddUserComponent implements OnInit {
    addUserForm: FormGroup;
    loading = false;
    submitted = false;
    users: User[] =[];
   
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
        this.addUserForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(3)]],
            retypePassword: ['', [Validators.required, Validators.minLength(3)]],
            address: ['', Validators.required],
            mobile: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]]
        });
    }
    // convenience getter for easy access to form fields
    get f() { return this.addUserForm.controls; }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    onSubmit() {
       
        this.submitted = true;
        // stop here if form is invalid
        if (this.addUserForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.register(this.addUserForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    //this.alertService.success('User added', true);
                    this.router.navigate(['/users']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
