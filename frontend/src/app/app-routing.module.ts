import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DeviceListComponent } from './components/device/device-list/device-list.component';
import { DeviceFormComponent } from './components/device/device-form/device-form.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'devices', component: DeviceListComponent, canActivate: [AuthGuard] },
    { path: 'devices/new', component: DeviceFormComponent, canActivate: [AuthGuard] },
    { path: 'devices/edit/:id', component: DeviceFormComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

