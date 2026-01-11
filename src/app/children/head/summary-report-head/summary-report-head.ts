import {Component} from '@angular/core';
import {Footer} from "../../components/footer/footer";
import {HeaderHead} from "../components/header-head/header-head";

@Component({
    selector: 'app-reports',
    imports: [
        Footer,
        HeaderHead
    ],
    templateUrl: './summary-report-head.html',
    styleUrl: './summary-report-head.css',
})
export class SummaryReportHead {

}
