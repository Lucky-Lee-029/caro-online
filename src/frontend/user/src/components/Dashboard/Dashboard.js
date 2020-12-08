import React from "react";
import { withRouter } from "react-router";
import SearchAppBar from "../Bar/Bar"
const DashboardComponent=()=>{
    return(
        <div>
            <SearchAppBar/>
            <h1>DashboardComponent</h1>
        </div>
    )
}

export default withRouter(DashboardComponent);