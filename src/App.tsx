import * as React from 'react';
import { ChangeEvent, useEffect, useRef, useState } from "react";
import classNames from "classnames";

const list = ['rain', 'summer', 'winter'];

export function App() {
    const [activeSound, setActiveSound] = useState(list[0]);
    const audio = useRef(null);
    const path = `./${process.env.REACT_APP_STATIC_FOLDER_PATH}`;

    const handleIconBg = (item: string) => {
        const buttonIcon: HTMLElement = document.querySelector(`#icon-${item}`);
        buttonIcon.style.backgroundImage = audio.current.paused ?
            `url(${path}icons/pause.svg)` :
            `url(${path}icons/${item}.svg)`;
    }

    const handleButtonClick = (item: string) => {
        if (item === activeSound) {
            handleIconBg(item);
            audio.current.paused ? audio.current.play() : audio.current.pause();
        } else {
            audio.current.pause();
            const playPromise = audio.current.play();
            if (playPromise) {
                playPromise.then(() => {
                    handleIconBg(item);
                    audio.current.src = `${path}sounds/${item}.mp3`;
                    audio.current.play();
                })
            }
            setActiveSound(item);
        }
    }

    const handleVolumeInput = (e: ChangeEvent<HTMLInputElement>) => {
        audio.current.volume = + e.currentTarget.value / 100;
    }

    useEffect(() => {
        const icons: NodeListOf<HTMLElement> = document.querySelectorAll('.sounds__button-icon');
        icons.forEach(icon => {
            const iconId = icon.getAttribute('id')
                .replace('icon-', '');
            if (iconId !== activeSound) {
                icon.style.backgroundImage = `url(${path}icons/${iconId}.svg)`
            }
        })
    }, [activeSound])

    return(
        <div className="sounds">
            <span className="sounds__bg"  style={{backgroundImage: `url(${path}images/${activeSound}.jpg)`}} />
            <audio
                ref={audio}
                src={`${path}sounds/${activeSound}.mp3`
            }
             />
            <div className="sounds__buttons">
                {
                    list.map((item) => (
                        <div
                            className={classNames(
                                'sounds__button-block',
                                item === activeSound && 'is-active'
                            )}
                            key={item}
                        >
                            <button
                                id={item}
                                className="sounds__button"
                                style={{backgroundImage: `url(${path}images/${item}.jpg)`}}
                                onClick={() => handleButtonClick(item)}
                            >
                                <span
                                    className="sounds__button-icon"
                                    id={`icon-${item}`}
                                    style={{backgroundImage: `url(${path}icons/${item}.svg)`}}
                                />
                            </button>
                            { item === activeSound &&
                                <input
                                type="range"
                                defaultValue={50}
                                min={0}
                                max={100}
                                name={item}
                                id={item}
                                onInput={handleVolumeInput}
                                className="sounds__button-volume"
                                />
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}