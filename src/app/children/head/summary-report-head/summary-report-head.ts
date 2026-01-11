import {Component} from '@angular/core';
import {Footer} from "../../components/footer/footer";
import {Header} from "../components/header/header";

@Component({
    selector: 'app-reports',
    imports: [
        Footer,
        Header
    ],
    templateUrl: './summary-report-head.html',
    styleUrl: './summary-report-head.css',
})
export class SummaryReportHead {

}
