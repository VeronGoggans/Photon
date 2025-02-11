import { ApplicationController } from './src/frontend/core/architecture/controller/applicationController.js';

document.addEventListener('DOMContentLoaded', async () => {
    const app = new ApplicationController();
    await app.start();
})