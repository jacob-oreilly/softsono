import { useEffect, useState } from "react";
import './MusicThing.css';



export default function MusicThing({ audioCtx, gainNode, oscOne }: { audioCtx: AudioContext, gainNode: GainNode, oscOne: OscillatorNode }) {
    // const AudioContext = window.AudioContext;
    const [gain, setGain] = useState(0.5);
    const [soundWave, setSoundWave] = useState<OscillatorType>("sine");
    const [detune, setDetune] = useState(0.0);
    const [mute, setMute] = useState(false);
    const [startOscBtnValue, setStartOscBtnValue] = useState("Start");

    // let mute = false;
    function startStopOscillator() {
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
            setStartOscBtnValue("Stop");
        }
        else {
            audioCtx.suspend();
            setStartOscBtnValue("Start");
        }
    }

    function handleGainInput(e: any) {
        setGain(e.target.value);
    }

    function handleWaveSelection(e: any) {
        setSoundWave(e.target.value);
    }

    function handleDetuneInput(e: any) {
        setDetune(e.target.value);
        // console.log("mute expected false, actual: " + mute);
        console.log(gain);
    }

    function muteOsc(e: any) {
        setMute(!mute);
    }

    useEffect(() => {
        if (mute) {
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        }
        else {
            gainNode.gain.setValueAtTime(gain, audioCtx.currentTime);
        }
        oscOne.type = soundWave;
        oscOne.detune.setValueAtTime(detune, audioCtx.currentTime);
    })
    return (
        <div className="instrument-container">
            <h3>Oscillator Node: </h3>
            <div className="osc-controlls">
                <div className="param">
                    <button className="start-osc" id="startOsc" onClick={startStopOscillator}>{startOscBtnValue}</button>
                    <button className="mute" id="muteButton" onClick={muteOsc}>Mute</button>
                </div>
                <div className="param">Gain: <input value={gain} onChange={handleGainInput} type="number" name="gain" id="gainInput" /></div>
                <div className="param">Detune: <input value={detune} onChange={handleDetuneInput} type="number" name="detune" id="detuneInput" /></div>
                <div className="param">
                    Sound Wave:
                    <select value={soundWave} onChange={handleWaveSelection}>
                        <option value="sine">sine</option>
                        <option value="square">square</option>
                        <option value="sawtooth">sawtooth</option>
                        <option value="triangle">triangle</option>
                    </select>
                </div>
            </div>
        </div>
    )
}