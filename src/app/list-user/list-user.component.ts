import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService, AuthenticationService } from '../_services';

@Component({
    templateUrl: './list-user.component.html'
})
export class ListUserComponent implements OnInit, OnDestroy {

    currentUser: User;
    currentUserSubscription: Subscription;
    users: User[] = [];

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    editUser(user: User) {
        console.log("edit user called");
        console.log(user);
        localStorage.removeItem("editUserId");
        localStorage.setItem("editUserId", user.userId.toString());
        this.router.navigate(['edituser']);
    };

    deleteUser(user: User) {
        if (window.confirm("Are you sure to delete.")) {
            this.userService.delete(user.userId).pipe(first()).subscribe(() => {
                this.loadAllUsers()
            });
        }
    }

    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }
}
