import { useCallback, useRef, useState } from "react";
import "./App.css";
import produce from "immer";

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

    const runningRef = useRef();
    runningRef.current = running;

    const neighborsOperation = [
        [0, -1],
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
    ];

    const runSimulation = useCallback(() => {
        if (!runningRef.current) {
            return;
        }

        setGrid((g) => {
            return produce(g, (gridCopy) => {
                for (let i = 0; i < numberOfRows; i++) {
                    for (let k = 0; k < numberOfColumns; k++) {
                        let neighbors = 0;
                        neighborsOperation.forEach(([x, y]) => {
                            const newI = i + x;
                            const newK = k + y;
                            if (
                                newI >= 0 &&
                                newI < numberOfRows &&
                                newK >= 0 &&
                                newK < numberOfColumns
                            ) {
                                neighbors += g[newI][newK];
                            }
                        });

                        const isAboutToDie = neighbors < 2 || neighbors > 3;
                        const isAboutToReproduce =
                            g[i][k] === 0 && neighbors === 3;

                        if (isAboutToDie) {
                            gridCopy[i][k] = 0;
                        } else if (isAboutToReproduce) {
                            gridCopy[i][k] = 1;
                        }
                    }
                }
            });
        });

        setTimeout(runSimulation, 100);
    }, []);

    return (
        <>
            <button
                onClick={() => {
                    setRunning(!running);
                    if (!running) {
                        runningRef.current = true;
                        runSimulation();
                    }
                }}
            >
                {running ? "stop" : "start"}
            </button>

            <button
                onClick={() => {
                    let gridCopy = [...grid];
                    gridCopy.forEach((rows, r) => {
                        rows.forEach((col, c) => {
                            gridCopy[r][c] = Math.random() > 0.7 ? 1 : 0;
                        });
                    });
                    setGrid(gridCopy);
                }}
            >
                random
            </button>

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
