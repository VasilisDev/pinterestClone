import React from 'react';
import { Link } from 'react-router-dom';
import PageNotFound from '../images/PageNotFound.jpg';
import { FormattedMessage } from "react-intl";


const NotFound = () => (
<div>
<img src={PageNotFound} alt="404 error" style={{width: 400, height: 400, display: 'block', margin: 'auto', position: 'relative' }} />
<center><Link to="/">
<FormattedMessage
                id="notfound"
                defaultMessage="Return to Home Page"
              /></Link></center>
</div>
);
export default NotFound;
