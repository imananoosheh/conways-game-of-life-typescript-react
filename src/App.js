import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import produce from "immer";

function App() {
    const numberOfRows = 50;
    const numberOfColumns = 50;
    const [clickedCell, setClickedCell] = useState([]);
    const [grid, setGrid] = useState(() => {
        // initializing 50X50 cells filled with 0
        const rows = [];
        for (let i = 0; i < numberOfRows; i++) {
            rows.push(Array(numberOfColumns).fill(0));
        }
        return rows;
    });

    // custom patterns are:
    // ['blinker', 'toad', 'beacon', pulsar, 'penta-decathlon', 'glider']
    const [customPattern, setCustomPattern] = useState('')
    const [clickListen, setClickListen] = useState(false);
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

    useEffect(()=>{
        if (clickedCell.length !== 0) {
            let gridCopy = [...grid];
            const blinkerOperations = [
                [0, 0, 1],
                [0, 1, 1],
                [0, -1, 1],
                [-1, 0, 0],
                [1, 0, 0],
                [-1, -1, 0],
                [-1, 1, 0],
                [1, 1, 0],
                [1, -1, 0],
            ];
            const [clickedX, clickedY] = clickedCell;
            blinkerOperations.forEach(([x, y, value]) => {
                gridCopy[clickedX + x][clickedY + y] = value;
            });
            setGrid(gridCopy);
        }
    },[clickedCell])

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
                    setGrid(() => {
                        // initializing 50X50 cells filled with 0
                        const rows = [];
                        for (let i = 0; i < numberOfRows; i++) {
                            let col = [];
                            for (let j = 0; j < numberOfColumns; j++) {
                                col[j] = Math.random() > 0.7 ? 1 : 0;
                            }
                            rows.push(col);
                        }
                        return rows;
                    });
                    setClickListen(false)
                }}
            >
                random
            </button>

            <button
                onClick={() => {
                    setGrid(() => {
                        // initializing 50X50 cells filled with 0
                        const rows = [];
                        for (let i = 0; i < numberOfRows; i++) {
                            rows.push(Array(numberOfColumns).fill(0));
                        }
                        return rows;
                    });
                    setRunning(false);
                }}
            >
                clear
            </button>

            <button
                onClick={() => {
                    setClickListen(!clickListen);
                    setCustomPattern('blinker')
                    // if (clickedCell !== []) {
                    //     let gridCopy = [...grid];
                    //     const blinkerOperations = [
                    //         [0, 0, 1],
                    //         [0, 1, 1],
                    //         [0, -1, 1],
                    //         [-1, 0, 0],
                    //         [1, 0, 0],
                    //         [-1, -1, 0],
                    //         [-1, 1, 0],
                    //         [1, 1, 0],
                    //         [1, -1, 0],
                    //     ];
                    //     const [clickedX, clickedY] = clickedCell;
                    //     blinkerOperations.forEach(([x, y, value]) => {
                    //         gridCopy[clickedX + x][clickedY + y] = value;
                    //     });
                    //     setGrid(gridCopy);
                    // }
                }}
            >
                add blinker
            </button>

            <div className="grid-container">
                {grid.map((rows, r) =>
                    rows.map((col, c) => (
                        <div
                            className="grid-cell"
                            key={`${r}-${c}`}
                            data={`${r}-${c}`}
                            onClick={(e) => {
                                const keys = e.target.getAttribute("data").split('-').map(num => Number(num))
                                // console.log(keys)
                                const gridCopy = [...grid];
                                let [coordX,coordY] = keys
                                console.log(gridCopy[coordX][coordY])
                                gridCopy[coordX][coordY] = gridCopy[coordX][coordY] === 0 ? 1 : 0;
                                console.log(gridCopy[coordX][coordY])
                                if (clickListen) {
                                    setClickedCell([coordX, coordY]);
                                }
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
