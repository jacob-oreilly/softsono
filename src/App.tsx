import React, { useState } from 'react';
import './App.css';
import MusicThing from './components/MusicThing';

type Oscillator = {
  audioCtx: AudioContext,
  gainNode: GainNode,
  osc: OscillatorNode
}

function App() {
  const [oscList, setOscList] = useState<Oscillator[]>([]);
  
  function createOsc() {
  
    const audCtx = new AudioContext();
    const gain = audCtx.createGain();
    const oscil = audCtx.createOscillator();
    const oscillator: Oscillator = {
      audioCtx: audCtx,
      gainNode: gain,
      osc: oscil
    };
  
    oscillator.osc.connect(oscillator.gainNode);
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
            <div key={`osc_${index}`}><MusicThing audioCtx={osc.audioCtx} gainNode={osc.gainNode} oscOne={osc.osc}/></div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
