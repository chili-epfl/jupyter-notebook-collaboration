//import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { NotebookPanel } from '@jupyterlab/notebook';
import { Cell } from '@jupyterlab/cells';
//import { ILabShell } from '@jupyterlab/application';

export function trackActivity(nb: NotebookPanel) {

    let prevCell: Cell | null = null;
    let disconnected = false;

    const notebook = nb.content;

    notebook.activeCellChanged.connect(() => {

        const cell = notebook.activeCell;

        // When entering a new cell, remove activity from previous cell's metadata
        if (prevCell) removeActivity(prevCell);

        // When entering a new cell, add activity to its metadata
        if (cell) {

            addActivity(cell);

            let activeUsers = cell.model.getMetadata('active_users');

            console.log('This cell has', activeUsers.toString(), 'active users');

        }

        // When closing the window, remove activity from last cell's metadata
        window.addEventListener('beforeunload', () => {
            if (prevCell && !disconnected) {

                removeActivity(prevCell);
                disconnected = true;

            }
        })

        prevCell = cell;

    });

    // Increment a cell's active users count
    function addActivity(cell: Cell) {

        let activeUsers = cell.model.getMetadata('active_users');
        if (Number.isNaN(activeUsers)) activeUsers = 0;
        activeUsers++;
        cell.model.setMetadata('active_users', activeUsers);
        
    }

    // Decrement a cell's active users count
    function removeActivity(cell: Cell) {
        
        let activeUsers = cell.model.getMetadata('active_users');
        activeUsers--;
        cell.model.setMetadata('active_users', activeUsers);

    }

}