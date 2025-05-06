import "./styles.css"

import { init } from "./DOMManipulation"


document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    init.openNewDialog();
    
    // Maybe add some global error handling
    window.addEventListener('error', (e) => {
        console.error('Global error:', e);
    });
});