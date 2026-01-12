import { useEffect, useState } from "react";
import './MusicThing.css';

type MusicThingProps = {
    audioCtx: AudioContext,
    gainNode: GainNode,
    osc: OscillatorNode,
    biquadFilter: BiquadFilterNode,
    convolver: ConvolverNode,
    distortion: WaveShaperNode,
    isMuted: boolean,
    onClickGlobalMute: () => void
}

const MusicThing = (props: MusicThingProps) => {
    // const AudioContext = window.AudioContext;
    const [gain, setGain] = useState(0.5);
    const [soundWave, setSoundWave] = useState<OscillatorType>("sine");
    const [detune, setDetune] = useState(0.0);
    const [mute, setMute] = useState(false);
    const [startOscBtnValue, setStartOscBtnValue] = useState("Start");
    const [frequency, setFrequency] = useState(440.0);
    // const [biquadFilter, setBiquadFilter] = useState();
    // const [convolver, setConvolver] = useState();
    // const [distortion, setDistortion] = useState();

    // let mute = false;
    function startStopOscillator() {
        if (props.audioCtx.state === "suspended") {
            props.audioCtx.resume();
            setStartOscBtnValue("Stop");
        }
        else {
            props.audioCtx.suspend();
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

    function handleFrequencyInput(e: any) {
        setFrequency(e.target.value);
    }

    function setFrequencyViaMidi(note: number) {
        setFrequency(note);
    }

    function muteOsc() {
        if (!props.isMuted) {
            setMute(!mute);
        }
    }

    // function handleBiquadFilterInput(e: any) {
    //     setBiquadFilter(e.target.value);
    // }
    useEffect(() => {
        startStopOscillator()
        if (mute) {
            props.gainNode.gain.setValueAtTime(0, props.audioCtx.currentTime);
        }
        else {
            props.gainNode.gain.setValueAtTime(gain, props.audioCtx.currentTime);
        }
        props.osc.type = soundWave;
        props.osc.detune.setValueAtTime(detune, props.audioCtx.currentTime);
        props.osc.frequency.setValueAtTime(frequency, props.audioCtx.currentTime);
    })

    useEffect(() => {
        setMute(props.isMuted)
    }, [props.isMuted])
    return (
        <div className="instrument-container">
            <h3>Oscillator Node: </h3>
            <div className="osc-controlls">
                <div className="param">
                    {/* <button className="start-osc" id="startOsc" onClick={startStopOscillator}>{startOscBtnValue}</button> */}
                    <button className="mute" id="muteButton" onClick={muteOsc}>{mute ? `Unmute` : `Mute`}</button>
                </div>
                <div className="param">Gain: <input value={gain} onChange={handleGainInput} type="number" name="gain" id="gainInput" /></div>
                <div className="param">frequency: <input value={frequency} onChange={handleFrequencyInput} type="number" min="0" max="7050" name="frequency" id="frequencyInput" /></div>
                <div className="param">Detune: <input value={detune} onChange={handleDetuneInput} type="number" name="detune" id="detuneInput" /></div>
                {/* <div className="param">Biquad Filter: <input value={biquadFilter} onChange={handleBiquadFilterInput} type="range" min="0" max="7050" name="frequency" id="frequencyInput" /></div> */}
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

export default MusicThing