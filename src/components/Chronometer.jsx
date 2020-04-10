import React, { useState, useEffect } from 'react';
import { generate } from 'shortid';
import cx from 'classnames';
import './Chronometer.css';

const Chronometer = () => {

    const [timer, setTimer] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
        miliseconds: 0
    });

    const [running, setRunning] = useState(false);
    const [started, setStarted] = useState(false);
    const [arrTimestamps, setArrTimestamps] = useState([]);

    useEffect(() => {
        if (running) {
            const interval = setInterval(() => {
                tick();
            }, 100);

            // El return dentro del useEfect es el equivalente al componentWillUnmount
            return () => clearInterval(interval);
        }
    }, [running, timer]);

    const handleStartClick = () => {
        setRunning(true);
        setStarted(true);
    }

    const tick = () => {
        let { hours, minutes, seconds, miliseconds } = timer;
        miliseconds = miliseconds + 1;

        if (miliseconds === 10) {
            miliseconds = 0;
            seconds = seconds + 1;
        }

        if (seconds === 60) {
            seconds = 0;
            minutes = minutes + 1;
        }

        if (minutes === 60) {
            minutes = 0;
            hours = hours + 1;
        }

        updateTimer(hours, minutes, seconds, miliseconds);
    }

    const updateTimer = (hours, minutes, seconds, miliseconds) => {
        setTimer({ hours, minutes, seconds, miliseconds });
    }

    const handleStopClick = () => {
        if (running) {
            setRunning(false);
        }
    }

    const handleTimestamp = () => {
        if (running) {
            const timestamp = {
                hours: timer.hours,
                minutes: timer.minutes,
                seconds: timer.seconds,
                miliseconds: timer.miliseconds
            };

            // Guarda lo que había en el arrTimestamps y le añade el objeto nuevo
            setArrTimestamps([...arrTimestamps, timestamp]);
        }
    }

    const handleReset = () => {
        setRunning(false);
        setStarted(false);
        setArrTimestamps([]);
        updateTimer(0, 0, 0, 0);
    }

    const addZero = (value) => {
        return value < 10 ? `0${value}` : value;
    }

    let { hours, minutes, seconds, miliseconds } = timer;
    hours = addZero(hours);
    minutes = addZero(minutes);
    seconds = addZero(seconds);
    miliseconds = addZero(miliseconds);

    const startButton = cx({
        activeButton: !running,
        inactiveButton: running
    });

    const resetButton = cx({
        activeButton: true
    });

    const otherButtons = cx({
        activeButton: running,
        inactiveButton: !running
    });

    return (
        <>
            <div className="numbers">
                <p>{hours} : {minutes} : {seconds} : {miliseconds}</p>
            </div>
            <div className="buttons">
                <button className={startButton} onClick={handleStartClick}>{started ? 'GO ON' : 'START'}</button>
                <button className={otherButtons} onClick={handleStopClick}>STOP</button>
                <button className={otherButtons} onClick={handleTimestamp}>LAP</button>
                {started && <button className={resetButton} onClick={handleReset}>RESET</button>}
            </div>
            <div className="timestamps">
                <ul>
                    {arrTimestamps.map((timestamp, index) => (
                        <li key={generate()}>{`LAP ${index + 1}: ✅ 
                                ${addZero(timestamp.hours)} :
                                ${addZero(timestamp.minutes)} :
                                ${addZero(timestamp.seconds)} :
                                ${addZero(timestamp.miliseconds)}`}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Chronometer;