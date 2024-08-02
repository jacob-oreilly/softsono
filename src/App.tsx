import React, { useState } from 'react';
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

  return (
    <>
     <div className="container">
        <h1>Where music starts!!!</h1>
        <div>
          <button onClick={createOsc}>Add Osc</button>
        </div>
        <div className='instruments-container'>
          {oscList?.map((osc, index) => (
            <div key={`osc_${index}`}>
              <MusicThing 
                audioCtx={osc.audioCtx} 
                gainNode={osc.gainNode} 
                oscOne={osc.osc}
                biquadFilterNode={osc.biquadFilter}
                convolverNode={osc.convolver}
                distortionNode={osc.distortion}
                 />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
