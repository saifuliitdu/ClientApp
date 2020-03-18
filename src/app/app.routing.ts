import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { ListTaskComponent } from './list-task';
import { AddTaskComponent } from './add-task';
import { EditTaskComponent } from './edit-task';
import { ListUserComponent } from './list-user';
import { AddUserComponent } from './add-user';
import { EditUserComponent } from './edit-user';
import { AuthGuard } from './_guards';

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'tasks', component: ListTaskComponent },
    { path: 'addtask', component: AddTaskComponent },
    { path: 'edittask', component: EditTaskComponent },
    { path: 'users', component: ListUserComponent },
    { path: 'adduser', component: AddUserComponent },
    { path: 'edituser', component: EditUserComponent },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);