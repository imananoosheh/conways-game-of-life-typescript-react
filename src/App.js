import { useCallback, useRef, useState } from "react";
import "./App.css";

function App() {
    const numberOfRows = 50;
    const numberOfColumns = 50;
    const [grid, setGrid] = useState(() => {
        // initializing 50X50 cells filled with 0
        const rows = [];
        for (let i = 0; i < numberOfRows; i++) {
            rows.push(Array(numberOfColumns).fill(0));
        }
        return rows;
    });

    const [running, setRunning] = useState(false);

    const runningRef = useRef()
    runningRef.current = running

    const simulate = useCallback(()=>{
      if(!runningRef.current){
        return
      }
      setTimeout(simulate, 500)
    },[])

    return (
        <>
            <button
                onClick={() => {
                    setRunning(!running);
                }}
            >
                {running ? "stop" : "start"}
            </button>
            <button>random</button>
            <button>clear</button>
            <div className="grid-container">
                {grid.map((rows, r) =>
                    rows.map((col, c) => (
                        <div
                            className="grid-cell"
                            key={`${r}-${c}`}
                            onClick={() => {
                                let gridCopy = [...grid];
                                gridCopy[r][c] = gridCopy[r][c] === 0 ? 1 : 0;
                                setGrid(gridCopy);
                            }}
                            style={{
                                backgroundColor:
                                    grid[r][c] === 1 ? "teal" : undefined,
                            }}
                        ></div>
                    ))
                )}
            </div>
        </>
    );
}

export default App;
