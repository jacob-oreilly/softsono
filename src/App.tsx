import { useState } from 'react';
import './App.css';
import MusicThing from './components/MusicThing';

type Oscillator = {
  audioCtx: AudioContext,
  gainNode: GainNode,
  osc: OscillatorNode,
  biquadFilter: BiquadFilterNode,
  convolver: ConvolverNode,
  distortion: WaveShaperNode  
}

function App() {
  const [oscList, setOscList] = useState<Oscillator[]>([]);
  const [startOscBtnValue, setStartOscBtnValue] = useState("Start");
  // const [mute, setMute] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  function createOsc() {
  
    const audCtx = new AudioContext();
    const gain = audCtx.createGain();
    const oscil = audCtx.createOscillator();
    const biquadFilter = audCtx.createBiquadFilter();
    const convolver = audCtx.createConvolver();
    const distortion = audCtx.createWaveShaper();
    const oscillator: Oscillator = {
      audioCtx: audCtx,
      gainNode: gain,
      osc: oscil,
      biquadFilter: biquadFilter,
      convolver: convolver,
      distortion: distortion
    };
  
    oscillator.osc.connect(oscillator.gainNode);
    oscillator.gainNode.connect(oscillator.biquadFilter);
    oscillator.gainNode.connect(oscillator.convolver);
    oscillator.gainNode.connect(oscillator.distortion);
    oscillator.gainNode.connect(oscillator.audioCtx.destination);
    oscillator.osc.start();
    audCtx.suspend();
    setOscList([
      ...oscList,
      oscillator
    ]);
  }

  function startStopOscillator() {
    oscList.forEach(oscillator => {
      if (oscillator.audioCtx.state === "suspended") {
        oscillator.audioCtx.resume();
        setIsMuted(true)
        setStartOscBtnValue("Stop");
      }
      else {
        oscillator.audioCtx.suspend();
        setStartOscBtnValue("Start");
      }
    });
  }
  function onClickGlobalMute() {
    setIsMuted(!isMuted)
  }



  return (
    <>
     <div className="container">
        <h1>Where music starts!!!</h1>
        <div>
          <button onClick={createOsc}>Add Osc</button>
          {/* <button className="start-all" id="startAll" onClick={startStopOscillator}>{startOscBtnValue}</button> */}
          <button className='mute-all' id='muteAll' onClick={onClickGlobalMute}>{isMuted ? `Unmute` : `Mute`}</button>
        </div>
        <div className='instruments-container'>
          {oscList?.map((osc, index) => (
            <div key={`osc_${index}`}>
              <MusicThing 
                audioCtx={osc.audioCtx} 
                gainNode={osc.gainNode} 
                osc={osc.osc}
                biquadFilter={osc.biquadFilter}
                convolver={osc.convolver}
                distortion={osc.distortion}
                isMuted={isMuted}
                onClickGlobalMute={onClickGlobalMute}
                 />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
