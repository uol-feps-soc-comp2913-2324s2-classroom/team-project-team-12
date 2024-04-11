import { app, BrowserWindow } from 'electron';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Create and initialize the new window
const initWindow = () => {
    const win = new BrowserWindow({
        title: 'Journeys',
        icon: join(__dirname, '/lib/globe.ico'),
        autoHideMenuBar: true,
    });

    win.loadURL('http://localhost:3000');
};

// Start the application
app.on('ready', initWindow);

// Handle common macOS window creation behaviour
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) initWindow();
});

// Exit application once all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
