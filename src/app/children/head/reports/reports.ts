import {Component} from '@angular/core';
import {Footer} from "../../components/footer/footer";
import {Header} from "../components/header/header";

@Component({
    selector: 'app-reports',
    imports: [
        Footer,
        Header
    ],
    templateUrl: './reports.html',
    styleUrl: './reports.css',
})
export class Reports {

}
